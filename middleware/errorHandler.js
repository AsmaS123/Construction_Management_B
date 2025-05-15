// middlewares/errorHandler.js
function errorHandler(err, req, res, next) {
  console.error(err.stack, "err.stack");

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === "development" ? err : undefined,
  });
}

module.exports = errorHandler;
