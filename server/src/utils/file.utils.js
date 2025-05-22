const fs = require('fs');
const path = require('path');

const getLatestXmlFile = (folderPath) => {
  const files = fs.readdirSync(folderPath).filter((file) => file.endsWith('.xml'));
  if (!files.length) return null;

  const sorted = files.sort((a, b) => {
    const aTime = fs.statSync(path.join(folderPath, a)).mtime;
    const bTime = fs.statSync(path.join(folderPath, b)).mtime;
    return bTime - aTime;
  });

  return path.join(folderPath, sorted[0]);
};

module.exports = {
  getLatestXmlFile,
};
