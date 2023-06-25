const fileController = require("../controller/filesController");

const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", fileController.getFiles);
router.post("/", fileController.uploadFiles);
router.get("/clean", fileController.cleanDirectory);

module.exports = router;
