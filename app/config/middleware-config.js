import express from 'express'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import { ROLES } from '../utils/constants.js'
import flash from 'connect-flash'
import csrf from 'csurf'
import compression from 'compression'
import path from 'path'
import { fileURLToPath } from 'url'
import { errorHandler, notFoundHandler } from '../utils/error-handler.js'
import cors from 'cors'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const setupMiddleware = app => {
  // Basic Express setup
  app.use(express.urlencoded({ extended: true, limit: '1mb' }))
  app.use(express.json({ limit: '1mb' }))
  app.use(cookieParser())

  // CORS configuration
  const corsOptions = {
    origin: '*', // Mengizinkan semua origin untuk pengembangan. Ganti dengan domain spesifik Anda untuk produksi.
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
  }
  app.use(cors(corsOptions))

  // Compression middleware
  app.use(compression())

  // Static files with caching (1 day)
  app.use(express.static(path.join(__dirname, '../../public'), {
    maxAge: '1d'
  }))

  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    }
  }))

  // Flash messages and CSRF protection
  app.use(flash())
  const csrfProtection = csrf({ cookie: true })
  app.use(csrfProtection)

  // Add global template variables
  app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken()
    res.locals.siteTitle = 'LostPeople Blog'
    res.locals.defaultDesc = 'Platform pencarian orang hilang terkini'
    res.locals.defaultKeywords = ['orang hilang', 'pencarian', 'blog']
    res.locals.defaultImage = '/assets/img/logo.png'
    res.locals.canonicalUrl = process.env.BASE_URL + req.originalUrl
    res.locals.ROLES = ROLES // Tambahkan ini
    next()
  })

  // Response time logging
  app.use((req, res, next) => {
    const start = Date.now()
    res.on('finish', () => {
      const duration = Date.now() - start
      console.log(`${req.method} ${req.originalUrl} - ${duration}ms`)
    })
    next()
  })
}


/**
 * @param {import('express').Application} app
 */
export const errorHandlers = app => {
  app.use(notFoundHandler)
  app.use(errorHandler)
}
