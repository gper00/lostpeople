// import 'dotenv/config' // environment variables
// import express from 'express'
// import path from 'path'
// import { fileURLToPath } from 'url'
// import expressEjsLayouts from 'express-ejs-layouts'
// import connectDB from './app/config/db-config.js'
// import session from 'express-session'
// import cookieParser from 'cookie-parser'
// import csrf from 'csurf'
// import flash from 'connect-flash'
// import methodOverride from 'method-override'
// import visitorRoutes from './app/routes/visitor-routes.js'
// import adminRoutes from './app/routes/admin-routes.js'
// import { authenticateToken } from './app/middlewares/auth-middleware.js'
// import { routeErrorHandler } from './app/utils/error-handler.js'
// // import morgan from 'morgan'

// const app = express()
// const PORT = process.env.PORT || 5000
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)
// const csrfProtection = csrf({ cookie: true })

// connectDB() // connect to database

// // Setup EJS
// app.set('view engine', 'ejs')
// app.set('views', path.join(__dirname, '/views'))

// app.use(express.urlencoded({ extended: true }))
// app.use(cookieParser())
// app.use(express.static(path.join(__dirname, '/public')))
// app.use(expressEjsLayouts)
// app.use(methodOverride('_method'))
// app.use(
//     session({
//         secret: process.env.SESSION_SECRET,
//         resave: false,
//         saveUninitialized: true
//     })
// )
// app.use(flash())
// app.use(csrfProtection)
// app.use((req, res, next) => {
//     res.locals.csrfToken = req.csrfToken()
//     next()
// })
// // app.use(morgan('dev'))

// // Routes
// app.use(visitorRoutes)
// app.use('/dashboard', authenticateToken, adminRoutes)
// app.use(routeErrorHandler)

// app.listen(PORT, () =>
//     console.log(`Server is running on http://127.0.0.1:${PORT}`)
// )



// require('dotenv/config') // environment variables
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
// const morgan = require('morgan')

const app = express()
const PORT = process.env.PORT || 5000
// const __dirname = __dirname // CommonJS secara otomatis memiliki `__dirname`
const csrfProtection = csrf({ cookie: true })

connectDB() // connect to database

// Setup EJS
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '/public')))
app.use(expressEjsLayouts)
app.use(methodOverride('_method'))
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true
    })
)
app.use(flash())
app.use(csrfProtection)
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken()
    next()
})
// app.use(morgan('dev'))

// Routes
app.use(visitorRoutes)
app.use('/dashboard', authenticateToken, adminRoutes)
app.use(routeErrorHandler)

app.listen(PORT, () =>
    console.log(`Listening on port ${PORT}`)
)
