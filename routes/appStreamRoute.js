const appStreamController = require("../controller/appStreamController");

const express = require("express");
const router = express.Router();

router.post("/getSku", appStreamController.getSku);

router.post("/getUniqueValue", appStreamController.getUniqueValue);

router.post("/getNextValue", appStreamController.getNextValue);

module.exports = router;
