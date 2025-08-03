const router = require('express').Router()
const {
    aboutPage,
    homePage,
    postDetailPage,
    postsPage
} = require('../controllers/home-controller')
const { checkAuthenticated } = require('../middlewares/auth-middleware')
const { loginPage, loginAction } = require('../controllers/auth-controller')
const validateData = require('../middlewares/validators/login-validator')

// Rute yang lebih spesifik harus selalu didefinisikan pertama.
router.get('/', postsPage) // Mengarahkan halaman utama ke halaman postingan
router.get('/about', aboutPage)
router.get('/login', checkAuthenticated, loginPage)
router.post('/login', validateData, loginAction)

// Rute '/posts' jika Anda ingin memiliki URL kanonis untuk daftar postingan
// Jika tidak, baris ini bisa dihapus jika '/' sudah cukup.
router.get('/posts', postsPage)

// Rute slug ini sekarang berada di urutan terakhir.
// Express akan mencoba mencocokkan semua rute di atas terlebih dahulu.
// Jika tidak ada yang cocok, baru ia akan menganggap permintaan ini sebagai slug postingan.
// Ini secara otomatis akan mengabaikan permintaan untuk /favicon.ico atau aset lainnya
// karena itu akan ditangani oleh express.static sebelum mencapai titik ini.
router.get('/:slug', postDetailPage)

module.exports = router