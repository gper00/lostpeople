import multer from 'multer'
import path from 'path'
import crypto from 'crypto'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from '../config/cloudinary-config.js'

/**
 * List of allowed file extensions for image uploads
 */
const allowedExtensions = ['.jpg', '.jpeg', '.png']

/**
 * Maximum file size in bytes (1MB)
 */
const MAX_FILE_SIZE = 1 * 1024 * 1024

/**
 * Cloudinary storage configuration for post thumbnails
 */
const postStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads/posts',
    format: async (req, file) => {
      const ext = path.extname(file.originalname).toLowerCase()
      return ext === '.jpeg' ? 'jpg' : ext.slice(1) // Convert jpeg to jpg, otherwise use extension
    },
    public_id: (req, file) => crypto.randomBytes(16).toString('hex'),
    transformation: [{ width: 800, crop: 'limit' }] // Resize large images
  }
})

/**
 * Cloudinary storage configuration for user profile images
 */
const userStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads/users',
    format: async (req, file) => {
      const ext = path.extname(file.originalname).toLowerCase()
      return ext === '.jpeg' ? 'jpg' : ext.slice(1) // Convert jpeg to jpg, otherwise use extension
    },
    public_id: (req, file) => crypto.randomBytes(16).toString('hex'),
    transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }] // Crop to square and focus on face
  }
})

/**
 * File filter to validate uploaded images
 * @param {Object} req - Express request object
 * @param {Object} file - Uploaded file information
 * @param {Function} cb - Callback function
 */
const fileFilter = (req, file, cb) => {
  // Check if a file was actually uploaded
  if (!file.originalname) {
    const error = new Error('No file selected')
    error.code = 'NO_FILE_UPLOADED'
    return cb(error, false)
  }

  // Check file type based on mime type
  if (!file.mimetype.startsWith('image/')) {
    const error = new Error('Only image files are allowed')
    error.code = 'INVALID_FILE_TYPE'
    return cb(error, false)
  }

  // Check file extension
  const ext = path.extname(file.originalname).toLowerCase()
  if (!allowedExtensions.includes(ext)) {
    const error = new Error(`Only ${allowedExtensions.join(', ')} files are allowed`)
    error.code = 'INVALID_FILE_TYPE'
    return cb(error, false)
  }

  // File is valid
  cb(null, true)
}

/**
 * Multer middleware for uploading post thumbnails
 */
const uploadPostThumbnail = multer({
  storage: postStorage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE }
}).single('thumbnail')

/**
 * Multer middleware for uploading user profile images
 */
const uploadUserImage = multer({
  storage: userStorage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE }
}).single('image')

/**
 * Creates a middleware to handle multer upload errors gracefully.
 * @param {string} fieldName - The name of the file input field.
 * @returns {Function} - Express middleware function.
 */
const createUploadErrorHandler = (fieldName) => {
    return (err, req, res, next) => {
        if (err) {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    req.flash('failed', `${fieldName} exceeds the maximum size of 1MB.`);
                } else {
                    req.flash('failed', `Error uploading ${fieldName}: ${err.message}`);
                }
            } else {
                req.flash('failed', err.message);
            }
            return res.redirect('back');
        }
        next();
    };
};

export { uploadPostThumbnail, uploadUserImage, createUploadErrorHandler }
