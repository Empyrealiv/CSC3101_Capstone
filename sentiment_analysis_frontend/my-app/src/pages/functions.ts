import { ITokenInfo, IWordImportance } from "../types";
import { IMPORTANT_WORD_THRESHOLD } from "./constants.ts";

export const processText = (text: string, tokens: IWordImportance[]) => {
  const rawTokens = text
    .split(/(\s+|[.,!?;:'"()[\]{}])/)
    .filter((token) => token.length > 0);

  let currentTokenIndex = 0;
  const tokenInfo: ITokenInfo[] = [];

  // For each raw token, try to match it with important words
  for (let i = 0; i < rawTokens.length; i++) {
    const rawToken = rawTokens[i];
    const isSpace = /^\s+$/.test(rawToken);
    debugger;

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
