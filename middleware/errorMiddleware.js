const CustomError = require("../helper/customError");

const errorHandler = (err, req, res, next) => {
  console.log("error - middleware");

  let status = 500;
  let message = "Internal Server Error";

  if (err instanceof CustomError) {
    status = err.status;
    message = err.message;
  } else if (err instanceof SyntaxError) {
    status = 400;
    message = "Invalid JSON payload";
  }
  // Send error response
  res.status(status).json({ error: message, status });
};

module.exports = errorHandler;
