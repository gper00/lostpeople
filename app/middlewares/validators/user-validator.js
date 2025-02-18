const { body, validationResult } = require('express-validator')
const User = require('../../models/user-model.js')
const { deleteUserImage } = require('../../utils/delete-file.js')
const { isEmpty } = require('../../utils/obj.js')

const validateUser = [
    body('fullname')
        .trim()
        .notEmpty()
        .withMessage('Fullname is required.')
        .isLength({ min: 5, max: 100 })
        .withMessage('Fullname must be between 5 and 100 characters.'),
    body('username')
        .optional()
        .trim()
        .isLength({ max: 25 })
        .withMessage('Username must be less than 25 characters.')
        .custom(async (username, { req }) => {
            if (username && req.method === 'PATCH') {
                const userId = req.params.id
                const user = await User.findOne({ username })
                if (user && user._id.toString() !== userId) {
                    throw new Error('Username already in use.')
                }
            }
            return true
        }),
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required.')
        .isEmail()
        .withMessage('Invalid email address.')
        .isLength({ max: 100 })
        .withMessage('Email must be less than 100 characters.'),
    body('password')
        .notEmpty()
        .withMessage('Password is required.')
        .isLength({ min: 4 })
        .withMessage('Password must be at least 4 characters long.'),
    body('repassword')
        .notEmpty()
        .withMessage('Password confirmation is required.')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error(
                    'Password confirmation does not match password.'
                )
            }
            return true
        }),
    body('bio')
        .trim()
        .optional()
        .isLength({ max: 400 })
        .withMessage('Bio must be less than 400 characters.'),
    body('facebook')
        .trim()
        .optional({ checkFalsy: true })
        .isLength({ max: 100 })
        .withMessage('Facebook URL must be less than 100 characters.')
        .matches(/^https?:\/\/(www\.)?facebook\.com\/[A-Za-z0-9_.-]+$/)
        .withMessage('Invalid Facebook URL.'),
    body('instagram')
        .trim()
        .optional({ checkFalsy: true })
        .isLength({ max: 100 })
        .withMessage('Instagram URL must be less than 100 characters.')
        .matches(/^https?:\/\/(www\.)?instagram\.com\/[A-Za-z0-9_.-]+$/)
        .withMessage('Invalid Instagram URL.'),
    body('twitter')
        .trim()
        .optional({ checkFalsy: true })
        .isLength({ max: 100 })
        .withMessage('Twitter URL must be less than 100 characters.')
        .matches(/^https?:\/\/(www\.)?twitter\.com\/[A-Za-z0-9_.-]+$/)
        .withMessage('Invalid Twitter URL.'),
    body('whatsapp')
        .trim()
        .optional({ checkFalsy: true })
        .isLength({ max: 100 })
        .withMessage('WhatsApp URL must be less than 100 characters.')
        .matches(/^https?:\/\/(www\.)?wa\.me\/[0-9]+$/)
        .withMessage('Invalid WhatsApp URL.'),
    body('telegram')
        .trim()
        .optional({ checkFalsy: true })
        .isLength({ max: 100 })
        .withMessage('Telegram URL must be less than 100 characters.')
        .matches(/^https?:\/\/(www\.)?t\.me\/[A-Za-z0-9_.-]+$/)
        .withMessage('Invalid Telegram URL.'),
    async (req, res, next) => {
        const errors = validationResult(req)
        req.errors = req.errors || {}

        const validationMessage = Object.assign(req.errors, errors.mapped())

        if (!isEmpty(validationMessage)) {
            if (req.file && req.file.filename) {
                try {
                    await deleteUserImage(req.file.filename)
                } catch (err) {
                    console.log(err.message)
                }
            }

            req.flash('errors', req.errors)
            req.flash('userData', req.body)

            const redirectUrl = req.params.id
                ? `/dashboard/users/${req.params.id}/edit`
                : '/dashboard/users/create'
            return res.redirect(redirectUrl)
        }
        next()
    }
]

module.exports = validateUser
