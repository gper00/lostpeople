import express from 'express'
import { usersPage, createUserPage, storeUser, userDetailPage, editUserPage, updateUser, removeUserImage, deleteUser } from '../controllers/user-controller.js'
import validateUser from '../middlewares/validators/user-validator.js'
import { logoutAction } from '../controllers/auth-controller.js'
import { postsPage, createPostPage, storePost, postDetailPage, editPostPage, updatePost, removePostThumbnail, deletePost, } from '../controllers/post-controller.js'
import validatePost from '../middlewares/validators/post-validator.js'
import { uploadPostThumbnail, uploadUserImage } from '../middlewares/upload-middleware.js'
import { thumbnailErrorHandler, imageErrorHandler } from '../utils/error-handler.js'
import { authSuperAdmin, checkPostAccess } from '../middlewares/auth-middleware.js'

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

router.post('/logout', logoutAction)

export default router
