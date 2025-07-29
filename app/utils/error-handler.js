import logger from './logger.js'
import util from 'util'

// Custom error classes
export class ApiError extends Error {
  constructor(message, statusCode = 500, details = {}) {
    super(message)
    this.statusCode = statusCode
    this.details = details
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends ApiError {
  constructor(errors, message = 'Validation failed') {
    super(message, 400, { errors })
  }
}

// Central error handler
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = `${err.statusCode}`.startsWith('4') ? 'fail' : 'error'

  // Log unexpected errors
  if (!err.isOperational) {
    logger.error(`${err.statusCode} ${err.message}`, {
      error: err,
      request: {
        method: req.method,
        url: req.originalUrl,
        params: req.params,
        query: util.isArray(req.query) ? req.query : {}
      },
      stack: err.stack
    })
  }

  // Error response formatting
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: err.details
    })
  })
}

export const notFoundHandler = (req, res, next) => {
  next(new ApiError(`Not found - ${req.method} ${req.originalUrl}`, 404))
}

export const createUploadErrorHandler = fieldName => (err, req, res, next) => {
  if (err) {
    logger.error('File upload error', { error: err, field: fieldName })
    next(new ValidationError(
      { [fieldName]: err.message },
      'File upload failed'
    ))
  }
  next()
}

// Process-level error handlers
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', { promise, reason })
  process.exit(1)
})

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error)
  process.exit(1)
})
