const fileController = require("../controller/filesController");

const express = require("express");
const router = express.Router();

router.get("/", fileController.getFiles);
router.post("/", fileController.uploadFiles);
router.put("/", fileController.uploadFiles);

module.exports = router;
