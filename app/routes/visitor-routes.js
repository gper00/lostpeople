import express from 'express'
import { homePage, postDetailPage, postsPage } from '../controllers/home-controller.js'
import { checkAuthenticated } from '../middlewares/auth-middleware.js'
import { loginPage, loginAction } from '../controllers/auth-controller.js'
import validateData from '../middlewares/validators/login-validator.js'

const router = express.Router()

router.get('/', postsPage)
router.get('/login', checkAuthenticated, loginPage)
router.post('/login', validateData, loginAction)

router.get('/:slug([^/]*)', (req, res, next) => {
  const excludedPaths = ['login', 'logout', 'dashboard']
  if (excludedPaths.includes(req.params.slug)) {
    return next('route')
  }
  postDetailPage(req, res, next)
})

export default router
