const jwtHelper = require("../helper/jwt");
const { CustomError } = require("./errorMiddleware");

function authenticate(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    throw new CustomError(
      401,
      "You dont have permission to perform this action"
    );
  }

  try {
    const decoded = jwtHelper.verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    res.send(err);
    next(err);
  }
}

module.exports = authenticate;
