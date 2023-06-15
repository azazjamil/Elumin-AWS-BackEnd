const fs = require("fs");
const path = require("path");

// Function to get all files in a directory
function getAllFiles(directoryPath) {
  let files = [];

  function traverseDirectory(currentPath) {
    const items = fs.readdirSync(currentPath);

    items.forEach((item) => {
      const itemPath = path.join(currentPath, item);
      const isDirectory = fs.statSync(itemPath).isDirectory();

      if (isDirectory) {
        traverseDirectory(itemPath);
      } else {
        files.push(itemPath);
      }
    });
  }

  traverseDirectory(directoryPath);
  return files;
}

// Function to delete files or directories not mentioned in the object
module.exports = function deleteUnmentionedFiles(
  directoryPath,
  mentionedFiles
) {
  const allFiles = getAllFiles(directoryPath);

  allFiles.forEach((file) => {
    if (!mentionedFiles[file]) {
      if (fs.existsSync(file)) {
        const isDirectory = fs.statSync(file).isDirectory();
        if (isDirectory) {
          fs.rmdirSync(file, { recursive: true });
          console.log(`Deleted directory: ${file}`);
        } else {
          fs.unlinkSync(file);
          console.log(`Deleted file: ${file}`);
        }
      }
    }
  });
};
