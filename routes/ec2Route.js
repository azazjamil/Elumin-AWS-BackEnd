const ec2Controller = require("../controller/ec2Controller");

const express = require("express");
const router = express.Router();

router.post("/getSku", ec2Controller.getSku);

router.post("/getUniqueValue", ec2Controller.getUniqueValue);

router.post("/getNextValue", ec2Controller.getNextValue);

module.exports = router;
