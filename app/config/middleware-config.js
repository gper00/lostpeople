import express from 'express'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import { ROLES } from '../utils/constants.js'
import flash from 'connect-flash'
import methodOverride from 'method-override'
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

  // Method override middleware
  app.use(methodOverride('_method'))

  // CORS configuration - more restrictive and secure
  const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
      ? process.env.ALLOWED_ORIGINS?.split(',') || 'https://gper00.github.io'
      : '*', // Only allow specific origins in production
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
    maxAge: 86400, // Cache preflight requests for 24 hours (in seconds)
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  }
  app.use(cors(corsOptions))

  // Enhanced compression middleware
  app.use(compression({
    level: 6,
    threshold: 1024, // Only compress responses larger than 1KB
    filter: (req, res) => {
      // Don't compress already compressed content or if client requested no compression
      if (req.headers['x-no-compression'] ||
          (req.headers['accept-encoding'] && !req.headers['accept-encoding'].includes('gzip'))) {
        return false;
      }
      // Use default filter for everything else
      return compression.filter(req, res);
    }
  }))

  // Static files with caching (1 day)
  app.use(express.static(path.join(__dirname, '../../public'), {
    maxAge: '1d'
  }))

  // Enhanced secure session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax', // Provides some CSRF protection
      path: '/'
    },
    name: 'sessionId', // Don't use default name (connect.sid)
    rolling: true // Reset expiration date on each request
  }))

  // Flash messages and CSRF protection
  app.use(flash())
  const csrfProtection = csrf({ cookie: true, value: (req) => req.query._csrf || req.body._csrf });
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

  // Enhanced response time logging with proper format
  app.use((req, res, next) => {
    const start = Date.now()
    res.on('finish', () => {
      const duration = Date.now() - start

      // Only log requests that take longer than 100ms in development
      // In production, we'd use a proper logging system
      if (duration > 100 || process.env.NODE_ENV === 'production') {
        console.log(`${req.method} ${req.originalUrl} - ${duration}ms`)
      }
    })
    next()
  })

  // Add security headers
  app.use((req, res, next) => {
    // Basic security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');

    // In production, add more strict headers
    if (process.env.NODE_ENV === 'production') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
      // Only enable referrer for same-origin requests
      res.setHeader('Referrer-Policy', 'same-origin');
    }

    next();
  });
}


/**
 * @param {import('express').Application} app
 */
export const errorHandlers = app => {
  app.use(notFoundHandler)
  app.use(errorHandler)
}
