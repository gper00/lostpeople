import multer from 'multer'
import path from 'path'
import crypto from 'crypto'

const allowedExtensions = ['.jpg', '.jpeg', '.png']

// Multer storage configuration
const postStorage = multer.diskStorage({ // post
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/posts')
    },
    filename: (req, file, cb) => {
        crypto.randomBytes(16, (err, raw) => {
            if (err) return cb(err)

            const ext = path.extname(file.originalname).toLowerCase()
            cb(null, raw.toString('hex') + ext)
        })
    }
})

const userStorage = multer.diskStorage({ // user
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/users')
    },
    filename: (req, file, cb) => {
        crypto.randomBytes(16, (err, raw) => {
            if (err) return cb(err)

            const ext = path.extname(file.originalname).toLowerCase()
            cb(null, raw.toString('hex') + ext)
        })
    }
})

// Multer file filter to check file extension
const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    if (!allowedExtensions.includes(ext)) {
        const error = new Error('Forbidden extension')
        error.code = 'INVALID_FILE_TYPE'
        return cb(error, false)
    }
    cb(null, true)
}

// Multer upload configuration
const uploadPostThumbnail = multer({
    storage: postStorage,
    fileFilter,
    limits: { fileSize: 1 * 1024 * 1024 } // 1MB
}).single('thumbnail')

const uploadUserImage = multer({
    storage: userStorage,
    fileFilter,
    limits: { fileSize: 1 * 1024 * 1024 } // 1MB
}).single('image')

export { uploadPostThumbnail, uploadUserImage }
