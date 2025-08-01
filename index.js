import 'dotenv/config' // environment variables
import 'express-async-errors'
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

// Enhanced compression with higher level
app.use(compression({
  level: 6,                    // Higher compression level (default is 6)
  threshold: 0,                // Compress all responses
  filter: (req, res) => {
    // Don't compress responses with this header
    if (req.headers['x-no-compression']) {
      return false;
    }
    // Compress everything else
    return compression.filter(req, res);
  }
}))

connectDB() // connect to database

// Performance and security middleware can be added here later

// Setup EJS
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

// Initialize core middleware
setupMiddleware(app)

// Configure optimized static files caching with better cache control
app.use(express.static('public', {
  maxAge: '7d',              // Increase cache duration to 7 days
  immutable: true,           // Never-changing files are immutable
  etag: true,                // Enable ETags for cache validation
  lastModified: true,        // Use last-modified for cache validation
}))

// Set specific caching rules for different file types
app.use((req, res, next) => {
  // Skip non-static files
  if (!req.path.match(/\.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2)$/i)) {
    return next();
  }

  // Set appropriate cache headers based on file type
  const now = new Date();

  // Cache fonts and images longer (30 days)
  if (req.path.match(/\.(jpg|jpeg|png|gif|ico|svg|woff|woff2)$/i)) {
    res.setHeader('Cache-Control', 'public, max-age=2592000, immutable');
    res.setHeader('Expires', new Date(now.getTime() + 2592000000).toUTCString());
  }
  // Cache CSS and JS for 7 days
  else if (req.path.match(/\.(css|js)$/i)) {
    res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
    res.setHeader('Expires', new Date(now.getTime() + 604800000).toUTCString());
  }

  next();
});

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
app.listen(PORT, () =>
  console.log(`Server is running on http://127.0.0.1:${PORT}`)
)

export default app
