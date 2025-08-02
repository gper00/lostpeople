import 'dotenv/config'; // environment variables
import 'express-async-errors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import expressEjsLayouts from 'express-ejs-layouts';
import connectDB from './app/config/db-config.js';
import { setupMiddleware } from './app/config/middleware-config.js';
import methodOverride from 'method-override';
import visitorRoutes from './app/routes/visitor-routes.js';
import adminRoutes from './app/routes/admin-routes.js';
import apiRoutes from './app/routes/api-routes.js';
import { authenticateToken } from './app/middlewares/auth-middleware.js';
// import morgan from 'morgan'

import compression from 'compression';

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
}));

connectDB(); // connect to database

// Performance and security middleware can be added here later

// Setup EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// Initialize core middleware
setupMiddleware(app);

// Method override setup
app.use(methodOverride('_method'));

// app.use(morgan('dev'))

// Configure optimized static files caching with better cache control
app.use(express.static('public', {
  maxAge: '7d',              // Increase cache duration to 7 days
  immutable: true,           // Never-changing files are immutable
  etag: true,                // Enable ETags for cache validation
  lastModified: true,        // Use last-modified for cache validation
}));

// Routes
app.use('/api', apiRoutes);
app.use(visitorRoutes);
app.use('/dashboard', authenticateToken, adminRoutes);


// Apply error handlers
import { errorHandlers } from './app/config/middleware-config.js';
errorHandlers(app);

// Create HTTP server
app.listen(PORT, () =>
  console.log(`Server is running on port ${PORT}`)
);

export default app;
