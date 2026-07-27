const logger = require('../utils/logger');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Terjadi kesalahan pada server';

  if (!err.isOperational) {
    logger.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
}

function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} tidak ditemukan`,
  });
}

module.exports = { errorHandler, notFoundHandler };
