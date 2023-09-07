const fs = require('node:fs/promises');

async function main() {
  const inputFile = process.argv[2];
  const outputFile = process.argv[3];

  if (!inputFile || !outputFile) {
    console.error('Usage: node index.js input.txt output.txt');
    process.exit(1);
  }

  const wordCountMap = new Map();

  try {
    const data = await fs.readFile(inputFile, 'utf8');
    const lines = data.split(/\r?\n/);

    // eslint-disable-next-line no-restricted-syntax
    for (const line of lines) {
      const words = line.split(/\s+/);

      // eslint-disable-next-line no-restricted-syntax
      for (const word of words) {
        const cleanedWord = word
          .replace(/[^a-zA-Zа-яА-ЯёЁ]/g, '')
          .toLowerCase();

        if (cleanedWord) {
          wordCountMap.set(
            cleanedWord,
            (wordCountMap.get(cleanedWord) || 0) + 1
          );
        }
      }
    }

    const sortedWords = Array.from(wordCountMap.keys()).sort();
    const vector = sortedWords.map((word) => wordCountMap.get(word));

    await fs.writeFile(outputFile, vector.join(' '));
    console.log('Indexing complete.');
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
}

main();
