const fs = require('fs');
const path = require('path');

const getLatestXmlFile = async (folderPath) => {
  let latestFile = null;
  let latestMTime = 0;
  let fileCount = 0; // counter for XML files

  // Calculate the cutoff timestamp (current time - 24 hours)
  const cutoffTime = Date.now() - 24 * 60 * 60 * 1000;

  const dir = await fs.promises.opendir(folderPath);
  for await (const dirent of dir) {
    if (dirent.isFile() && dirent.name.endsWith('.xml')) {
      fileCount++; // increment count for each XML file found
      const filePath = path.join(folderPath, dirent.name);
      try {
        const { mtimeMs } = await fs.promises.stat(filePath);

        // Skip if file is older than 24 hours
        if (mtimeMs < cutoffTime) continue;

        // Track latest file
        if (mtimeMs > latestMTime) {
          latestMTime = mtimeMs;
          latestFile = filePath;
        }
      } catch (err) {
        console.error(`Failed to stat ${filePath}:`, err.message);
      }
    }
  }

  console.log(`📂 Found ${fileCount} XML file(s) in folder: ${folderPath}`);

  return latestFile;
};

module.exports = {
  getLatestXmlFile,
};
