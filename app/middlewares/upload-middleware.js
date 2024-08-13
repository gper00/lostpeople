import multer from 'multer'
import path from 'path'
import crypto from 'crypto'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from '../config/cloudinary-config.js'

const allowedExtensions = ['.jpg', '.jpeg', '.png']

// Cloudinary storage configuration for posts
const postStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads/posts',
        format: async (req, file) => {
            const ext = path.extname(file.originalname).toLowerCase()
            return ext === '.jpeg' ? 'jpg' : ext.slice(1) // Supports jpg, png
        },
        public_id: (req, file) => crypto.randomBytes(16).toString('hex')
    }
})

// Cloudinary storage configuration for users
const userStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads/users',
        format: async (req, file) => {
            const ext = path.extname(file.originalname).toLowerCase()
            return ext === '.jpeg' ? 'jpg' : ext.slice(1) // Supports jpg, png
        },
        public_id: (req, file) => crypto.randomBytes(16).toString('hex')
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
