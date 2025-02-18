const { body, validationResult } = require('express-validator')
const Post = require('../../models/post-model.js')
const { deletePostThumbnail } = require('../../utils/delete-file.js')
const { isEmpty } = require('../../utils/obj.js')

const validatePost = [
    body('title')
        .isString()
        .trim()
        .isLength({ min: 10, max: 255 })
        .withMessage('Title must be between 10 and 255 characters long'),
    body('newCategory')
        .optional()
        .trim()
        .isLength({ max: 25 })
        .withMessage('Category must not exceed 25 characters')
        .custom(async (value) => {
            if (value) {
                const categoryExists = await Post.findOne({ category: value })
                if (categoryExists) {
                    return Promise.reject('Category already exists')
                }
            }
        }),
    body('tags')
        .optional()
        .custom((tags) => {
            tags.split(',')
                .map((tag) => tag.trim())
                .forEach((tag) => {
                    if (typeof tag !== 'string' || tag.trim().length > 25) {
                        throw new Error(
                            'Each tag cannot be more than 25 characters'
                        )
                    }
                })
            return true
        }),
    body('excerpt')
        .isString()
        .trim()
        .isLength({ min: 30, max: 500 })
        .withMessage('Excerpt must be between 30 and 500 characters long'),
    body('content')
        .isString()
        .trim()
        .isLength({ min: 100 })
        .withMessage('Content must be at least 100 characters long'),
    body('status')
        .optional()
        .isIn(['draft', 'published'])
        .withMessage('The value of published is invalid'),
    async (req, res, next) => {
        const errors = validationResult(req)
        req.errors = req.errors || {}

        const validationMessage = Object.assign(req.errors, errors.mapped())

        if (!isEmpty(validationMessage)) {
            if (req.file && req.file.filename) {
                try {
                    await deletePostThumbnail(req.file.filename)
                } catch (err) {
                    console.log(err.message)
                }
            }

            req.flash('errors', req.errors)
            req.flash('postData', req.body)

            const redirectUrl = req.params.id
                ? `/dashboard/posts/${req.params.id}/edit`
                : '/dashboard/posts/create'
            return res.redirect(redirectUrl)
        }
        next()
    }
]

module.exports = validatePost
