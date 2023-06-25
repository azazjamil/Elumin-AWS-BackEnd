const express = require("express");
const router = express.Router();
const controller = require("../controller/authController");

router.post("/register", controller.registerUser);
router.post("/login", controller.loginUser);

module.exports = router;
