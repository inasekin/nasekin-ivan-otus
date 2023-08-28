const fs = require('node:fs/promises');
const path = require('node:path');

async function getFilesAndFolders(directory) {
  const result = {
    files: [],
    dirs: [],
  };

  async function exploreDir(dirPath) {
    const items = await fs.readdir(dirPath);

    // eslint-disable-next-line consistent-return
    const subPromises = items.map(async (item) => {
      const itemPath = path.join(dirPath, item);
      const stats = await fs.stat(itemPath);

      if (stats.isDirectory()) {
        result.dirs.push(itemPath);
        return exploreDir(itemPath);
      }
      result.files.push(itemPath);
    });

    await Promise.all(subPromises);
  }

  await exploreDir(directory);
  return result;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length !== 1) {
    // eslint-disable-next-line no-console
    console.error('Usage: node tree.js <path>');
    return;
  }

  const inputPath = args[0];

  try {
    const tree = await getFilesAndFolders(inputPath);
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(tree, null, 2));
    // eslint-disable-next-line no-console
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('An error occurred:', error.message);
  }
}

main();
