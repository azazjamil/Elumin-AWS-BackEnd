const fs = require("fs");
const path = require("path");
const uploader = require("huge-uploader-nodejs");
const deleteUnmentionedFiles = require("../helper/cleandirectory");

const directoryPath = "./data/";
const mentionedFiles = {
  "data\\amazon appstream.json": true,
  "data\\amazon workspaces.json": true,
  "data\\amazonEC2.json": true,
};

const getFiles = async (req, res) => {
  try {
    deleteUnmentionedFiles(directoryPath, mentionedFiles);

    const files = await fs.promises.readdir(directoryPath);
    const avaiableFiles = [];

    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const stats = await fs.promises.stat(filePath);

      const info = {
        name: file,
        size: stats.size,
        modified: stats.mtime,
        created: stats.birthtime,
      };

      avaiableFiles.push(info);
    }
    res.status(200).send({ error: false, data: avaiableFiles });
  } catch (err) {
    res.status(500).send({ error: true, message: "Something went wrong!" });
  }
};

const uploadFiles = async (req, res) => {
  const tmpDir = directoryPath;
  const maxFileSize = 100;
  const maxChunkSize = 25;

  const requestedFilename = req.headers["xxx-filename-xxx"];

  if (!requestedFilename) {
    res.statusCode = 400;
    res.end("Missing xxx-filename-xxx header");
    return;
  }

  const filePath = path.join(directoryPath, requestedFilename);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.statusCode = 404;
      res.end("File not found");
    } else {
      uploader(req, tmpDir, maxFileSize, maxChunkSize)
        .then((assembleChunks) => {
          res.writeHead(204, "No Content");
          res.end();

          if (assembleChunks) {
            assembleChunks()
              .then((data) => {
                fs.renameSync(
                  data.filePath,
                  directoryPath + data.postParams.filename
                );
              })
              .catch((err) => console.log(err));
          }
        })
        .catch((err) => {
          if (err.message === "Missing header(s)") {
            res.writeHead(400, "Bad Request", {
              "Content-Type": "text/plain",
            });
            res.end("Missing uploader-* header");
            return;
          }

          if (err.message === "Missing Content-Type") {
            res.writeHead(400, "Bad Request", {
              "Content-Type": "text/plain",
            });
            res.end("Missing Content-Type");
            return;
          }

          if (err.message.includes("Unsupported content type")) {
            res.writeHead(400, "Bad Request", {
              "Content-Type": "text/plain",
            });
            res.end("Unsupported content type");
            return;
          }

          if (err.message === "Chunk is out of range") {
            res.writeHead(400, "Bad Request", {
              "Content-Type": "text/plain",
            });
            res.end(
              "Chunk number must be between 0 and total chunks - 1 (0 indexed)"
            );
            return;
          }

          if (err.message === "File is above size limit") {
            res.writeHead(413, "Payload Too Large", {
              "Content-Type": "text/plain",
            });
            res.end(`File is too large. Max fileSize is: ${maxFileSize}MB`);
            return;
          }

          if (err.message === "Chunk is above size limit") {
            res.writeHead(413, "Payload Too Large", {
              "Content-Type": "text/plain",
            });
            res.end(`Chunk is too large. Max chunkSize is: ${maxChunkSize}MB`);
            return;
          }

          if (err && err.message === "Upload has expired") {
            res.writeHead(410, "Gone", { "Content-Type": "text/plain" });
            res.end(err.message);
            return;
          }

          res.writeHead(500, "Internal Server Error");
          res.end();
        });
    }
  });
};

const cleanDirectory = async (req, res) => {
  try {
    deleteUnmentionedFiles(directoryPath, mentionedFiles);
    res
      .status(200)
      .send({ message: "directory is clean no unwanted files are present" });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getFiles, uploadFiles, cleanDirectory };
