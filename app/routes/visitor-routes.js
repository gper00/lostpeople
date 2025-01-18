import express from 'express'
import { aboutPage, homePage, postDetailPage, postsPage } from '../controllers/home-controller.js'
import { checkAuthenticated } from '../middlewares/auth-middleware.js'
import { loginPage, loginAction } from '../controllers/auth-controller.js'
import validateData from '../middlewares/validators/login-validator.js'

const router = express.Router()

router.get('/', homePage)
router.get('/about', aboutPage)
router.get('/posts', postsPage)
router.get('/posts/:slug', postDetailPage)
router.get('/login', checkAuthenticated, loginPage)
router.post('/login', validateData, loginAction)

export default router
