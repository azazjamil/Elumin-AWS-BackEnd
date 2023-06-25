const ec2Controller = require("../controller/ec2Controller");
const mailer = require("../helper/mailer");

const express = require("express");
const router = express.Router();

router.post("/getSku", ec2Controller.getSku);

router.post("/getUniqueValue", ec2Controller.getUniqueValue);

router.post("/getNextValue", ec2Controller.getNextValue);

router.post("/sendMail", mailer.sendEmailWithAttachment);

module.exports = router;
