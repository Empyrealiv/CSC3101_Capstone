import React, { useState, useEffect } from "react";

interface ImportantWord {
  word: string;
  contribution: number;
}

const text =
  "I'm so glad I was able to attend the concert, the singers were AMAZING!";
const importantWords: ImportantWord[] = [
  { word: "i", contribution: 0.0216365996748209 },
  { word: "'", contribution: 0.01440274715423584 },
  { word: "m", contribution: 0.03804069384932518 },
  { word: "so", contribution: 0.04646851494908333 },
  { word: "glad", contribution: 0.19935238361358643 },
  { word: "i", contribution: 0.030639562755823135 },
  { word: "was", contribution: 0.054863423109054565 },
  { word: "able", contribution: 0.10374948382377625 },
  { word: "to", contribution: 0.016108425334095955 },
  { word: "attend", contribution: 0.07091092318296432 },
  { word: "the", contribution: 0.015344358049333096 },
  { word: "concert", contribution: 0.054089345037937164 },
  { word: ",", contribution: 0.023239828646183014 },
  { word: "the", contribution: 0.018424080684781075 },
  { word: "singers", contribution: 0.09252167493104935 },
  { word: "were", contribution: 0.036569975316524506 },
  { word: "amazing", contribution: 0.0758146122097969 },
  { word: "!", contribution: 0.03512530028820038 },
];

interface TokenInfo {
  text: string;
  isSpace: boolean;
  contribution?: number;
  isHighlighted: boolean;
  originalIndex?: number;
}

export const Test = () => {
  const [hoveredToken, setHoveredToken] = useState<number | null>(null);
  const [processedTokens, setProcessedTokens] = useState<TokenInfo[]>([]);
  
  const percentage = 0.3;

  useEffect(() => {
    processText();
  }, []);

  const processText = () => {
    // First, split the text by spaces and non-spaces
    const rawTokens = text.split(/(\s+)/);
    
    let currentImportantWordIndex = 0;
    const tokens: TokenInfo[] = [];
    
    // For each raw token, try to match it with important words
    for (let i = 0; i < rawTokens.length; i++) {
      const rawToken = rawTokens[i];
      const isSpace = /^\s+$/.test(rawToken);
      
      if (isSpace) {
        // Just add spaces as is
        tokens.push({
          text: rawToken,
          isSpace: true,
          isHighlighted: false,
        });
      } else {
        // For non-space tokens, try to match with importantWords
        const lowerCaseToken = rawToken.toLowerCase();
        
        // Check if we still have important words to process
        if (currentImportantWordIndex < importantWords.length) {
          // Special handling for contractions and combined tokens
          // Example: "I'm" might be split into ["i", "'", "m"] in importantWords
          
          // Case 1: Simple direct match
          if (lowerCaseToken === importantWords[currentImportantWordIndex].word.toLowerCase()) {
            tokens.push({
              text: rawToken,
              isSpace: false,
              contribution: importantWords[currentImportantWordIndex].contribution,
              isHighlighted: false, // Will set this later after sorting
              originalIndex: currentImportantWordIndex,
            });
            currentImportantWordIndex++;
          } 
          // Case 2: Contraction or compound token that spans multiple importantWords entries
          else {
            // Try to see if this token contains multiple important words
            let combinedToken = "";
            let tempIndex = currentImportantWordIndex;
            let combined = false;
            
            // Look ahead to see if we can combine several importantWords to match this token
            while (tempIndex < importantWords.length) {
              combinedToken += importantWords[tempIndex].word.toLowerCase();
              if (combinedToken === lowerCaseToken) {
                // Found a match by combining!
                combined = true;
                
                // Calculate average contribution of the combined tokens
                let totalContribution = 0;
                for (let j = currentImportantWordIndex; j <= tempIndex; j++) {
                  totalContribution += importantWords[j].contribution;
                }
                const avgContribution = totalContribution / (tempIndex - currentImportantWordIndex + 1);
                
                tokens.push({
                  text: rawToken,
                  isSpace: false,
                  contribution: avgContribution,
                  isHighlighted: false, // Will set this later after sorting
                  originalIndex: currentImportantWordIndex, // Just use the first index for reference
                });
                
                currentImportantWordIndex = tempIndex + 1;
                break;
              }
              tempIndex++;
            }
            
            // If we couldn't find a match by combining, just add the token without contribution
            if (!combined) {
              tokens.push({
                text: rawToken,
                isSpace: false,
                isHighlighted: false,
              });
            }
          }
        } else {
          // No more important words to match, just add the token
          tokens.push({
            text: rawToken,
            isSpace: false,
            isHighlighted: false,
          });
        }
      }
    }
    
    // Now calculate which tokens should be highlighted based on contribution
    const tokensWithContribution = tokens.filter(t => t.contribution !== undefined);
    
    // Sort by contribution
    const sortedTokens = [...tokensWithContribution].sort(
      (a, b) => (b.contribution || 0) - (a.contribution || 0)
    );
    
    // Get the top N tokens
    const topN = Math.ceil(sortedTokens.length * percentage);
    const highlightedTokens = sortedTokens.slice(0, topN);
    
    // Mark tokens as highlighted
    highlightedTokens.forEach(highlightedToken => {
      tokens.forEach(token => {
        if (token.originalIndex === highlightedToken.originalIndex) {
          token.isHighlighted = true;
        }
      });
    });
    
    setProcessedTokens(tokens);
  };

  const formatContribution = (value: number): string => {
    return (value * 100).toFixed(2) + "%";
  };

  return (
    <div style={{ backgroundColor: "white", padding: "20px", display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <p>
        {processedTokens.map((token, index) => {
          const style: React.CSSProperties = token.isHighlighted
            ? {
                backgroundColor: "rgba(255, 0, 0, 0.5)",
                padding: "2px 4px",
                borderRadius: "4px",
                margin: "0 2px",
                position: "relative",
                cursor: "pointer",
              }
            : {};
            
          const hoverProps = token.isHighlighted && token.contribution !== undefined
            ? {
                onMouseEnter: () => setHoveredToken(index),
                onMouseLeave: () => setHoveredToken(null),
                className: "important-word"
              }
            : {};
            
          return (
            <span key={index} style={style} {...hoverProps}>
              {token.text}
              {hoveredToken === index && token.contribution !== undefined && (
                <span
                  style={{
                    position: "absolute",
                    bottom: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "#333",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "14px",
                    whiteSpace: "nowrap",
                    zIndex: 10,
                    boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
                  }}
                >
                  Importance: {formatContribution(token.contribution)}
                </span>
              )}
            </span>
          );
        })}
      </p>
    </div>
  );
};