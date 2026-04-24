// Global error handling middleware - catches all unhandled errors
const errorHandler = (err, req, res, next) => {
  // Log error details in development
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', err.stack);
  }

  // Default error values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Sequelize validation error (e.g., unique constraint, field validation)
  if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = err.errors.map(e => e.message).join(', ');
  }

  // Sequelize unique constraint error (e.g., duplicate email)
  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    message = 'A record with this value already exists.';
  }

  // Sequelize foreign key error
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    statusCode = 400;
    message = 'Invalid reference to a related resource.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Include stack trace only in development mode
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// 404 handler for unknown routes
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = { errorHandler, notFound };
