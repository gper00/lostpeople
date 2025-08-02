import { body, validationResult } from 'express-validator';
import Post from '../../models/post-model.js';
import { deletePostThumbnail } from '../../utils/delete-file.js';
import { isEmpty } from '../../utils/obj.js';

/**
 * Validates post form submission data and handles errors
 */
const validatePost = [
  // Title validation
  body('title')
    .isString()
    .trim()
    .isLength({ min: 10, max: 255 })
    .withMessage('Title must be between 10 and 255 characters long'),

  // New category validation
  body('newCategory')
    .optional()
    .trim()
    .isLength({ max: 25 })
    .withMessage('Category must not exceed 25 characters')
    .custom(async (value) => {
      if (value) {
        const categoryExists = await Post.findOne({ category: value });
        if (categoryExists) {
          throw new Error('Category already exists');
        }
      }
      return true;
    }),

  // Tags validation
  body('tags')
    .optional()
    .custom(tags => {
      if (!tags || tags.trim() === '') {
        return true;
      }

      try {
        const tagList = tags.split(',').map(tag => tag.trim());

        // Check for empty tags
        if (tagList.some(tag => tag === '')) {
          throw new Error('Tags cannot be empty');
        }

        // Check tag length
        tagList.forEach(tag => {
          if (tag.length > 25) {
            throw new Error('Each tag cannot be more than 25 characters');
          }
        });

        return true;
      } catch (error) {
        if (error.message.includes('tags')) {
          throw error;
        }
        throw new Error('Invalid tag format. Use comma-separated values');
      }
    }),

  // Excerpt validation
  body('excerpt')
    .isString()
    .trim()
    .isLength({ min: 30, max: 500 })
    .withMessage('Excerpt must be between 30 and 500 characters long'),

  // Content validation
  body('content')
    .isString()
    .trim()
    .isLength({ min: 100 })
    .withMessage('Content must be at least 100 characters long'),

  // Status validation
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Invalid post status value'),

  // Custom validation handler
  async (req, res, next) => {
    const errors = validationResult(req);
    req.errors = req.errors || {};

    // Combine validation errors with any upload errors
    const validationMessage = Object.assign(req.errors, errors.mapped());

    if (!isEmpty(validationMessage)) {
      // Clean up uploaded file if validation failed
      if (req.file && req.file.path) {
        try {
          await deletePostThumbnail(req.file.path);
          console.log('Cleaned up invalid thumbnail upload:', req.file.path);
        } catch (err) {
          console.error('Error deleting invalid thumbnail:', err.message);
        }
      }

      // Send error information to the client
      req.flash('error', 'Please fix the errors in the form');

      // Detailed errors for form validation
      req.flash('errors', validationMessage);

      // Preserve user input
      req.flash('postData', req.body);

      // Determine where to redirect based on context (create or edit)
      const redirectUrl = req.params.id
        ? `/dashboard/posts/${req.params.id}/edit`
        : '/dashboard/posts/create';

      return res.redirect(redirectUrl);
    }

    // All validation passed
    next();
  }
];

export default validatePost;
