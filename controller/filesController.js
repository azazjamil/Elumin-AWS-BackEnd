const fs = require("fs");
const path = require("path");
const md5 = require("md5");
const uploader = require("huge-uploader-nodejs");
const directoryPath = "./data/";

const getFiles = async (req, res) => {
  try {
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
    console.error("Error retrieving files:", err);
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
          // chunk written to disk
          res.writeHead(204, "No Content");
          res.end();

          // on last chunk, assembleChunks function is returned
          // the response is already sent to the browser because it can take some time if the file is huge
          if (assembleChunks) {
            // so you call the promise, it assembles all the pieces together and cleans the temporary files
            assembleChunks()
              // when it's done, it returns an object with the path to the file and additional post parameters if any
              .then((data) => {
                console.log(data);
                fs.renameSync(
                  data.filePath,
                  directoryPath + data.postParams.filename
                );
              }) // { filePath: 'tmp/1528932277257', postParams: { email: 'upload@corp.com', name: 'Mr Smith' } }
              // errors if any are triggered by the file system (disk is full…)
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

          // this error is triggered if a chunk with uploader-chunk-number header != 0
          // is sent and there is no corresponding temp dir.
          // It means that the upload dir has been deleted in the meantime.
          // Although uploads should be resumable, you can't keep partial uploads for days on your server
          if (err && err.message === "Upload has expired") {
            res.writeHead(410, "Gone", { "Content-Type": "text/plain" });
            res.end(err.message);
            return;
          }

          // other FS errors
          res.writeHead(500, "Internal Server Error"); // potentially saturated disk
          res.end();
        });
    }
  });
};

module.exports = { getFiles, uploadFiles };
