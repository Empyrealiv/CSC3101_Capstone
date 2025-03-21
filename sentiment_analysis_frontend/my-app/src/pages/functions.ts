import { ITokenInfo, IUploadCSVResponse, IWordImportance } from "../types";
import {
  IMPORTANT_WORD_THRESHOLD,
  BINARY_EMOTIONS_MAP,
  TERNARY_EMOTIONS_MAP,
  EMOTIONS_6_MAP,
  GOEMOTIONS_MAP,
} from "./constants.ts";
import emojiRegex from 'emoji-regex';

const splitTextWithEmojis = (text) => {
  const regex = emojiRegex();
  
  const basicTokens = text
    .split(/(\s+|[.,!?;:'"()[\]{}])/)
    .filter(token => token.length > 0);
  
  const finalTokens: string[] = [];
  
  for (const token of basicTokens) {
    if (regex.test(token)) {
      const withMarkers = token.replace(regex, '\u0000$&\u0000');
      const emojiTokens = withMarkers.split('\u0000').filter(t => t.length > 0);
      finalTokens.push(...emojiTokens);
    } else {
      finalTokens.push(token);
    }
  }
  
  return finalTokens;
};

export const processText = (text: string, tokens: IWordImportance[]) => {
  const rawTokens = splitTextWithEmojis(text)

  let currentTokenIndex = 0;
  const tokenInfo: ITokenInfo[] = [];

  // For each raw token, try to match it with important words
  for (let i = 0; i < rawTokens.length; i++) {
    const rawToken = rawTokens[i];
    const isSpace = /^\s+$/.test(rawToken);
    if (isSpace) {
      tokenInfo.push({
        text: rawToken,
        isSpace: true,
        isHighlighted: false,
      });
    } else {
      const lowerCaseToken = rawToken.toLowerCase();

      if (currentTokenIndex < tokens.length) {
        // Ignore special tokens
        if (
          tokens[currentTokenIndex].word === "[UNK]" ||
          tokens[currentTokenIndex].word === "/"
        ) {
          tokenInfo.push({
            text: rawToken,
            isSpace: false,
            isHighlighted: false,
          });
          currentTokenIndex++;
          continue;
        }
        // Case 1: Simple direct match
        if (lowerCaseToken === tokens[currentTokenIndex].word.toLowerCase()) {
          tokenInfo.push({
            text: rawToken,
            isSpace: false,
            contribution: tokens[currentTokenIndex].contribution,
            isHighlighted: false,
            originalIndex: currentTokenIndex,
          });
          currentTokenIndex++;
        }
        // Case 2: Contraction or compound token that spans multiple token entries
        else {
          let combinedToken = "";
          let tempIndex = currentTokenIndex;
          let combined = false;

          // Combination algorithm
          while (tempIndex < tokens.length) {
            // Ignore special tokens
            if (
              tokens[tempIndex].word === "[UNK]" ||
              tokens[tempIndex].word === "/"
            ) {
              tokenInfo.push({
                text: rawToken,
                isSpace: false,
                isHighlighted: false,
              });
              currentTokenIndex = tempIndex + 1;
              break;
            }
            // If token starts with ##, it is a subword, remove the ## and combine
            if (tokens[tempIndex].word.startsWith("##")) {
              tokens[tempIndex].word = tokens[tempIndex].word.slice(2);
            }
            combinedToken += tokens[tempIndex].word.toLowerCase();
            if (combinedToken === lowerCaseToken) {
              combined = true;

              let totalContribution = 0;
              for (let j = currentTokenIndex; j <= tempIndex; j++) {
                totalContribution += tokens[j].contribution;
              }

              tokenInfo.push({
                text: rawToken,
                isSpace: false,
                contribution: totalContribution,
                isHighlighted: false,
                originalIndex: currentTokenIndex,
              });

              currentTokenIndex = tempIndex + 1;
              break;
            }
            tempIndex++;
          }

          // If we couldn't find a match by combining, just add the token without contribution
          if (!combined) {
            tokenInfo.push({
              text: rawToken,
              isSpace: false,
              isHighlighted: false,
            });
          }
        }
      } else {
        // No more words to match, just add the token
        tokenInfo.push({
          text: rawToken,
          isSpace: false,
          isHighlighted: false,
        });
      }
    }
  }

  const tokenInfoWithContribution = tokenInfo.filter(
    (token) => token.contribution !== undefined
  );

  const sortedTokens = [...tokenInfoWithContribution].sort(
    (a, b) => (b.contribution || 0) - (a.contribution || 0)
  );

  const topN = Math.ceil(sortedTokens.length * IMPORTANT_WORD_THRESHOLD);
  const highlightedTokens = sortedTokens.slice(0, topN);

  highlightedTokens.forEach((highlightedToken) => {
    tokenInfo.forEach((token) => {
      if (token.originalIndex === highlightedToken.originalIndex) {
        token.isHighlighted = true;
      }
    });
  });
  return tokenInfo;
};

export const formatContribution = (value: number): string => {
  return (value * 100).toFixed(2) + "%";
};

export const createChartData = (mode: string, labels: string[]) => {
  let emotionMap;

  switch (mode) {
    case "binary":
      emotionMap = BINARY_EMOTIONS_MAP;
      break;
    case "ternary":
      emotionMap = TERNARY_EMOTIONS_MAP;
      break;
    case "emotions-6-class":
      emotionMap = EMOTIONS_6_MAP;
      break;
    case "goemotions":
      emotionMap = GOEMOTIONS_MAP;
      break;
    default:
      emotionMap = null;
  }

  if (!emotionMap) {
    throw new Error("Error processing data");
  }
  
  const predictionCounts = labels.reduce(
    (counts, predictionCode) => {
      counts[predictionCode] = (counts[predictionCode] || 0) + 1;
      return counts;
    },
    {} as Record<string, number>
  );

  const chartData = Object.entries(emotionMap).map(([code, emotionName]) => {
    return {
      name: emotionName as string,
      value: predictionCounts[code] || 0,
    };
  });
  return chartData;
};

export const getEmotionMap = (data: IUploadCSVResponse) => {
  let emotionMap;

  switch (data.mode) {
    case "binary":
      emotionMap = BINARY_EMOTIONS_MAP;
      break;
    case "ternary":
      emotionMap = TERNARY_EMOTIONS_MAP;
      break;
    case "emotions-6-class":
      emotionMap = EMOTIONS_6_MAP;
      break;
    case "goemotions":
      emotionMap = GOEMOTIONS_MAP;
      break;
    default:
      emotionMap = null;
  }

  if (!emotionMap) {
    throw new Error("Error processing data");
  }

  return emotionMap;
};
