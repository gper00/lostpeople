const thumbnailErrorHandler = (err, req, res, next) => {
    if (err) {
        req.errors = req.errors || {}
        if (err.code === 'INVALID_FILE_TYPE') {
            req.errors.thumbnail = {
                msg: 'Only .jpg, .jpeg, and .png files are allowed'
            }
        } else if (err.code === 'LIMIT_FILE_SIZE') {
            req.errors.thumbnail = { msg: 'File size must be less than 1MB' }
        } else {
            req.errors.thumbnail = { msg: err.message }
        }
    }

    next()
}

const imageErrorHandler = (err, req, res, next) => {
    if (err) {
        req.errors = req.errors || {}
        if (err.code === 'INVALID_FILE_TYPE') {
            req.errors.image = {
                msg: 'Only .jpg, .jpeg, and .png files are allowed'
            }
        } else if (err.code === 'LIMIT_FILE_SIZE') {
            req.errors.image = { msg: 'File size must be less than 1MB' }
        } else {
            req.errors.image = { msg: err.message }
        }
    }

    next()
}

export { thumbnailErrorHandler, imageErrorHandler }
