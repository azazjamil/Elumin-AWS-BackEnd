const CustomError = require("../helper/customError");
// Error middleware function
const errorHandler = (err, req, res, next) => {
  console.log("error - middleware");
  // Default error status and message
  let status = 500;
  let message = "Internal Server Error";

  // Check for specific error types
  if (err instanceof CustomError) {
    // Handle custom error
    status = err.status;
    message = err.message;
  } else if (err instanceof SyntaxError) {
    // Handle syntax error
    status = 400;
    message = "Invalid JSON payload";
  }

  // Log the error
  console.error(err);

  // Send error response
  res.status(status).json({ error: message });
};

module.exports = errorHandler;
