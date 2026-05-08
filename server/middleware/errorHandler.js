import mongoose from 'mongoose';

export function notFoundHandler(req, _res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

export function errorHandler(error, _req, res, _next) {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal server error';
  let details = error.details || undefined;

  if (error instanceof mongoose.Error.ValidationError) {
    statusCode = 422;
    message = 'Validation failed';
    details = Object.values(error.errors).map((err) => ({
      path: err.path,
      msg: err.message
    }));
  }

  if (error.code === 11000) {
    statusCode = 409;
    message = 'A record with this unique value already exists';
    details = error.keyValue;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(error);
  }

  res.status(statusCode).json({
    message,
    details
  });
}
