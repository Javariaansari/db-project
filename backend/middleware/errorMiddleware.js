// backend/middleware/errorMiddleware.js

// 404 handler - for unknown routes
function notFound(req, res, next) {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

// Central error handler - must have 4 args for Express to treat it as error middleware
function errorHandler(err, req, res, next) {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Internal Server Error";

  // Postgres unique_violation
  if (err.code === "23505") {
    statusCode = 409;
    message = "Duplicate record. This entry already exists.";
  }

  // Postgres foreign_key_violation
  if (err.code === "23503") {
    statusCode = 400;
    message = "Invalid reference. Related record does not exist.";
  }

  // Postgres not_null_violation
  if (err.code === "23502") {
    statusCode = 400;
    message = `Missing required field: ${err.column || ""}`;
  }

  console.error(`[ERROR] ${req.method} ${req.originalUrl} -> ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
}

module.exports = { notFound, errorHandler };
