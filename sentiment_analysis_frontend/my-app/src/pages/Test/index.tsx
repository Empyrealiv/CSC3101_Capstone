import React from "react";

interface ImportantWord {
  word: string;
  contribution: number;
}

const text = "I'm so glad I was able to attend the concert, the singers were AMAZING!"
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
]

export const Test = () => {
  const percentage = 0.3; // Highlight the top 20%

  // Calculate the number of words to highlight
  const topN = Math.ceil(importantWords.length * percentage);

  // Sort words by contribution in descending order
  const sortedWords = [...importantWords].sort((a, b) => b.contribution - a.contribution);

  // Select the top N words
  const highlightedWords = sortedWords.slice(0, topN);

  // Create a mapping for word styles
  const wordStyles = highlightedWords.reduce((map, word) => {
    map[word.word.toLowerCase()] = {
      backgroundColor: "rgba(255, 0, 0, 0.5)", // Highlight color
      padding: "2px 4px",
      borderRadius: "4px",
      margin: "0 2px",
    };
    return map;
  }, {} as Record<string, React.CSSProperties>);

  // Split the text into tokens and apply styles
  const tokens = text.split(/(\s+)/); // Split by spaces, keeping spaces intact

  console.log(text.split(/(\s+)/))

  return (
    <p>
      {tokens.map((token, index) => {
        const lowerCaseToken = token.toLowerCase();
        const style = wordStyles[lowerCaseToken] || {};
        return (
          <span key={index} style={style}>
            {token}
          </span>
        );
      })}
    </p>
  );
};
