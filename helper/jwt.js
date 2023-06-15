const jwt = require("jsonwebtoken");
const CustomError = require("./customError");

require("dotenv").config();

const secretKey = process.env.JWT_SECRET;

function generateToken(payload) {
  try {
    return jwt.sign(payload, secretKey, { expiresIn: "1h" });
  } catch (error) {
    // Handle token generation error
    throw new Error("Token generation failed");
  }
}

function verifyToken(token) {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    // Handle token verification error
    throw new CustomError(403, "Token Expired: Token verification failed. ");
  }
}
module.exports = {
  generateToken,
  verifyToken,
};
