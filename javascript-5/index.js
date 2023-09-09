const fs = require('node:fs');
const readline = require('node:readline');
const stream = require('node:stream');
const util = require('node:util');

const pipeline = util.promisify(stream.pipeline);

async function main() {
  const inputFile = process.argv[2];
  const outputFile = process.argv[3];

  if (!inputFile || !outputFile) {
    console.error('Usage: node index.js input.txt output.txt');
    process.exit(1);
  }

  const wordCountMap = new Map();

  try {
    const readStream = fs.createReadStream(inputFile, 'utf8');
    const lineStream = readline.createInterface({ input: readStream });

    // eslint-disable-next-line no-restricted-syntax
    for await (const line of lineStream) {
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

    const writeStream = fs.createWriteStream(outputFile);
    await pipeline(stream.Readable.from(vector.join(' ')), writeStream);

    console.log('Indexing complete.');
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
}

main();
