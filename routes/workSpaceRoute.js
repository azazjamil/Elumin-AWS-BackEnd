const workSpaceController = require("../controller/workSpaceController");

const express = require("express");
const router = express.Router();

router.post("/getSku", workSpaceController.getSku);

router.post("/getUniqueValue", workSpaceController.getUniqueValue);

router.post("/getNextValue", workSpaceController.getNextValue);

module.exports = router;
