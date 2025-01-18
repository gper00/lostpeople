import jwt from 'jsonwebtoken'
import User from '../models/user-model.js'
import bcrypt from 'bcrypt'

const loginPage = (req, res) => {
    const errors = req.flash('errors')[0] ?? {}
    const userData = req.flash('userData')[0] ?? {}
    const errorMessage = req.flash('failed')

    res.render('login', {
        layout: false,
        errors,
        userData,
        errorMessage
    })
}

const loginAction = async (req, res) => {
    try {
        const { usernameOrEmail, password, rememberMe } = req.body

        const user = await User.findOne({
            $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
        })
        if (!user) {
            req.flash('failed', 'User not found')
            req.flash('userData', req.body)
            return res.redirect('/login')
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            req.flash('failed', 'User not found')
            req.flash('userData', req.body)
            return res.redirect('/login')
        }

        const expiresIn = rememberMe ? '7d' : '1h'
        const accessToken = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn }
        )

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000 // 7 days or 1 hour
        })

        const redirectUrl = req.session.returnTo || '/dashboard'
        delete req.session.returnTo
        res.redirect(redirectUrl)
    } catch (err) {
        console.error(err)
        req.flash('failed', err.message || 'Something went wrong')
        return res.redirect('/login')
    }
}

const logoutAction = (req, res) => {
    res.clearCookie('accessToken')
    req.session.destroy((err) => {
        if (err) {
            console.error(err)
            return res.status(500).send('Something went wrong')
        }
        res.redirect('/login')
    })
}

export { loginPage, loginAction, logoutAction }
