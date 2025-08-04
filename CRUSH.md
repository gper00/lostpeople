# CRUSH Development Guidelines

## Build Commands
- `npm run dev` - Run development server with nodemon
- `npm start` - Run production server
- `npm run build` - Build production assets (CSS/JS)
- `npm run build:css` - Build CSS bundle
- `npm run build:js` - Build JS bundle
- `npm run copy:fonts` - Copy font assets

## Code Style Guidelines

### General
- Use async/await instead of callbacks/promises
- Use 4-space indentation (no tabs)
- Use single quotes for strings
- Use camelCase for variables and functions
- Use PascalCase for constructors/classes
- Use UPPER_SNAKE_CASE for constants

### Imports
- Use CommonJS require/module.exports
- Group imports in this order:
  1. Core Node.js modules
  2. External packages
  3. Local modules
- Place imports at the top of the file

### Error Handling
- Always handle errors in try/catch blocks
- Use req.flash() for user-facing error messages
- Log errors with console.error()
- Use specific error handling for CastError (invalid IDs)

### Models
- Use mongoose for MongoDB interactions
- Define validation rules in schema
- Use timestamps: true for createdAt/updatedAt
- Add indexes for frequently queried fields

### Controllers
- Use async functions for all route handlers
- Structure functions as: try { success logic } catch (err) { error handling }
- Use req.flash() for success/error messages
- Always redirect after POST/PUT/DELETE operations
- Use consistent variable names: layout, pageActive, etc.

### Routing
- Use express-validator for request validation
- Implement validation middleware before controller logic
- Use clear route naming conventions

### Utilities
- Create reusable helper functions
- Implement proper error handling in utilities
- Use caching where appropriate