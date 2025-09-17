require('dotenv').config()

const express = require('express')
const path = require('path')
const expressEjsLayouts = require('express-ejs-layouts')
const connectDB = require('./app/config/db-config.js')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const csrf = require('csurf')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const visitorRoutes = require('./app/routes/visitor-routes.js')
const adminRoutes = require('./app/routes/admin-routes.js')
const { authenticateToken } = require('./app/middlewares/auth-middleware.js')
const { routeErrorHandler } = require('./app/utils/error-handler.js')
const morgan = require('morgan')
const compression = require('compression')

const app = express()

// Performance optimizations
app.use(compression({ level: 6, threshold: 1024 }))
app.set('trust proxy', 1)
app.disable('x-powered-by')

const PORT = process.env.PORT || 5000
const csrfProtection = csrf({ cookie: true })

connectDB() // connect to database

// Setup EJS with caching
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))
if (process.env.NODE_ENV === 'production') {
    app.set('view cache', true)
}

// Optimized middleware order
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())

// Static files with caching
app.use(express.static(path.join(__dirname, '/public'), {
    maxAge: process.env.NODE_ENV === 'production' ? '1y' : '0',
    etag: true,
    lastModified: true
}))

app.use(expressEjsLayouts)
app.use(methodOverride('_method'))

// Session with optimized settings
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        }
    })
)

app.use(flash())
app.use(csrfProtection)
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken()
    next()
})

// Conditional logging
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'))
}

// Routes
app.use(visitorRoutes)
app.use('/dashboard', authenticateToken, adminRoutes)
app.use(routeErrorHandler)

app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
)
