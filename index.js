import 'dotenv/config' // environment variables
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import expressEjsLayouts from 'express-ejs-layouts'
import connectDB from './app/config/db-config.js'
import { setupMiddleware } from './app/config/middleware-config.js'
import methodOverride from 'method-override'
import visitorRoutes from './app/routes/visitor-routes.js'
import adminRoutes from './app/routes/admin-routes.js'
import apiRoutes from './app/routes/api-routes.js'
import { authenticateToken } from './app/middlewares/auth-middleware.js'

// import morgan from 'morgan'

import compression from 'compression'

const app = express()
const PORT = process.env.PORT || 5000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Enable response compression
app.use(compression())

connectDB() // connect to database

// Performance and security middleware can be added here later

// Setup EJS
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

// Initialize core middleware
setupMiddleware(app)

// Configure static files caching
app.use(express.static('public', {
  maxAge: '1d',
  immutable: true
}))

// Template and method override setup
app.use(expressEjsLayouts)
app.use(methodOverride('_method'))

// app.use(morgan('dev'))

// Routes
app.use('/api', apiRoutes)
app.use(visitorRoutes)
app.use('/dashboard', authenticateToken, adminRoutes)


// Apply error handlers
import { errorHandlers } from './app/config/middleware-config.js'
errorHandlers(app)

// Create HTTP server
const server = app.listen(PORT, () =>
  console.log(`Server is running on http://127.0.0.1:${PORT}`)
)

// Handle server errors
server.on('error', error => {
  console.error('Server error:', error)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  server.close(() => {
    console.log('Process terminated')
  })
})
