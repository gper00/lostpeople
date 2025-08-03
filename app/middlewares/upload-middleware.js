const multer = require('multer')
const path = require('path')
const crypto = require('crypto')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../config/cloudinary-config.js')

const allowedExtensions = ['.jpg', '.jpeg', '.png']

// Konfigurasi Cloudinary storage untuk posts
const postStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads/posts',
        format: async (req, file) => {
            const ext = path.extname(file.originalname).toLowerCase()
            return ext === '.jpeg' ? 'jpg' : ext.slice(1) // Mendukung jpg, png
        },
        public_id: (req, file) => crypto.randomBytes(16).toString('hex')
    }
})

// Konfigurasi Cloudinary storage untuk users
const userStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads/users',
        format: async (req, file) => {
            const ext = path.extname(file.originalname).toLowerCase()
            return ext === '.jpeg' ? 'jpg' : ext.slice(1) // Mendukung jpg, png
        },
        public_id: (req, file) => crypto.randomBytes(16).toString('hex')
    }
})

// Filter file
const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    if (!allowedExtensions.includes(ext)) {
        const error = new Error('Forbidden extension')
        error.code = 'INVALID_FILE_TYPE'
        return cb(error, false)
    }
    cb(null, true)
}

// Konfigurasi upload menggunakan multer
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

module.exports = { uploadPostThumbnail, uploadUserImage }
