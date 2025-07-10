const express = require('express')
const { usersPage, createUserPage, storeUser, userDetailPage, editUserPage, updateUser, removeUserImage, deleteUser } = require('../controllers/user-controller.js')
const validateUser = require('../middlewares/validators/user-validator.js')
const { logoutAction } = require('../controllers/auth-controller.js')
const { postsPage, createPostPage, storePost, postDetailPage, editPostPage, updatePost, removePostThumbnail, deletePost, } = require('../controllers/post-controller.js')
const validatePost = require('../middlewares/validators/post-validator.js')
const { uploadPostThumbnail, uploadUserImage } = require('../middlewares/upload-middleware.js')
const { thumbnailErrorHandler, imageErrorHandler } = require('../utils/error-handler.js')
const { authSuperAdmin, checkPostAccess } = require('../middlewares/auth-middleware.js')

const router = express.Router()

// Dashboard home
router.get('/', (req, res) => {
    const successMessage = req.flash('success')
    const errorMessage = req.flash('failed')
    res.render('dashboard/index', {
        layout: 'layouts/dashboard',
        successMessage,
        errorMessage,
        pageActive: 'home'
    })
})

// User
router.get('/users/', authSuperAdmin, usersPage)
router.get('/users/create', authSuperAdmin, createUserPage)
router.post('/users/', authSuperAdmin, validateUser, storeUser)
router.get('/users/:id', userDetailPage)
router.get('/users/:id/edit', editUserPage)
router.patch('/users/:id', uploadUserImage, imageErrorHandler, validateUser, updateUser)
router.patch('/users/:id/remove-image', removeUserImage)
router.delete('/users/:id', authSuperAdmin, deleteUser)

// Post
router.get('/posts', postsPage)
router.get('/posts/create', createPostPage)
router.get('/posts/:id', checkPostAccess, postDetailPage)
router.post('/posts', uploadPostThumbnail, thumbnailErrorHandler, validatePost, storePost)
router.get('/posts/:id/edit',checkPostAccess,  editPostPage)
router.patch('/posts/:id', checkPostAccess, uploadPostThumbnail, thumbnailErrorHandler, validatePost, updatePost)
router.patch('/posts/:id/remove-thumbnail', checkPostAccess, removePostThumbnail)
router.delete('/posts/:id', checkPostAccess, deletePost)


// api
// router.get('/api/posts', getAllPost)
// router.get('/api/latest-post', getLatestPost)

router.post('/logout', logoutAction)

module.exports = router
