const jwt = require('jsonwebtoken')
const User = require('../models/user-model.js')
const Post = require('../models/post-model.js')

const authenticateToken = (req, res, next) => {
    const token =
        req.cookies.accessToken ||
        req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
        return res.redirect('/login')
    }

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        async (err, decodedToken) => {
            if (err) {
                return res.redirect('/login')
            }

            try {
                const authUser = await User.findById(
                    decodedToken.userId
                ).select('-password')
                if (!authUser) {
                    return res.redirect('/login')
                }

                const now = Math.floor(Date.now() / 1000)
                if (decodedToken.exp - now < 60 * 10) {
                    const newToken = jwt.sign(
                        { userId: authUser._id, role: authUser.role },
                        process.env.ACCESS_TOKEN_SECRET,
                        { expiresIn: '2h' }
                    )
                    res.cookie('accessToken', newToken, {
                        httpOnly: true,
                        maxAge: 60 * 60 * 2000 // 2 hour
                    })
                }

                res.locals.authUser = authUser
                req.user = authUser
                next()
            } catch (error) {
                console.error(error)
                return res.redirect('/login')
            }
        }
    )
}

const checkAuthenticated = (req, res, next) => {
    const token =
        req.cookies.accessToken ||
        req.header('Authorization')?.replace('Bearer ', '')

    if (token) {
        return res.redirect('/dashboard')
    }

    next()
}

const authSuperAdmin = (req, res, next) => {
    if (req.user.role !== 'super-admin') {
        const message =
            req.method === 'GET'
                ? 'Unable to access the page'
                : 'Method not allowed'
        req.flash('failed', message)
        res.status(403)
        return res.redirect('/dashboard')
    }

    next()
}

const checkPostAccess = async (req, res, next) => {
    try {
        const postId = req.params.id
        const post = await Post.findById(postId)

        if (!post) {
            req.flash('failed', 'Post not found')
            return res.redirect('/dashboard')
        }

        if (
            req.user.role !== 'super-admin' &&
            post.userId.toString() !== req.user._id.toString()
        ) {
            req.flash(
                'failed',
                'You do not have permission to access this post'
            )
            return res.redirect('/dashboard/posts')
        }

        next()
    } catch (err) {
        console.log(err)
        req.flash('failed', 'An error occurred')
        res.redirect('/dashboard/posts')
    }
}

module.exports = {
    authenticateToken,
    checkAuthenticated,
    authSuperAdmin,
    checkPostAccess
}
