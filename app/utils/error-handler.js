export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const response = {
    status: statusCode,
    message: err.message || 'Internal Server Error'
  }

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack
  }

  res.status(statusCode).json(response)
}

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    status: 404,
    message: 'Resource not found'
  })
}

export const createUploadErrorHandler = fieldName => (err, req, res, next) => {
  if (err) {
    req.flash('failed', `${err.message} on ${fieldName} field`)
    return res.redirect('back')
  }
  next()
}
