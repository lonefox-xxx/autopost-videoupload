const fs = require("fs");
const path = require("path");

function collectMP4FilePaths(folderPath) {
  try {
    console.log("Collecting video paths..");
    const mp4FilePaths = [];
    const files = fs.readdirSync(folderPath);
    files.forEach((file) => {
      const filePath = path.join(folderPath, file);
      if (fs.statSync(filePath).isFile() && path.extname(file) === ".mp4") {
        mp4FilePaths.push(filePath);
      }
    });

    return mp4FilePaths;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return [];
  }
}

module.exports = collectMP4FilePaths;
