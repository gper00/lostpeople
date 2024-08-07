import { body, validationResult } from 'express-validator'

const validateData = [
    body('usernameOrEmail')
        .notEmpty()
        .withMessage('Please enter username or email'),
    body('password')
        .notEmpty()
        .withMessage('Password can not be empty.'),
    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const errorObject = errors.mapped()
            req.flash('errors', errorObject)
            req.flash('userData', req.body)
            return res.redirect('/login')
        }
        next()
    }
]

export default validateData
