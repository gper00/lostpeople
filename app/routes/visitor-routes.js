const express = require('express')
const { aboutPage, homePage, postDetailPage, postsPage } = require('../controllers/home-controller.js')
const { checkAuthenticated } = require('../middlewares/auth-middleware.js')
const { loginPage, loginAction } = require('../controllers/auth-controller.js')
const validateData = require('../middlewares/validators/login-validator.js')

const router = express.Router()

// router.get('/', homePage)
// router.get('/posts', postsPage)
// router.get('/posts/:slug', postDetailPage)
router.get('/', postsPage)
router.get('/about', aboutPage)
router.get('/login', checkAuthenticated, loginPage)
router.post('/login', validateData, loginAction)

router.get('/:slug([^/]*)', (req, res, next) => {
    const excludedPaths = ['login', 'logout', 'dashboard'];
    if (excludedPaths.includes(req.params.slug)) {
      return next('route');
    }
    postDetailPage(req, res, next);
});

module.exports = router
