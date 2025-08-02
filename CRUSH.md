# CRUSH.md - Coding Guidelines for this Repository

## Build/Lint/Test Commands

```bash
# Run the application in development mode with auto-reload
npm run dev

# Run the application in production mode
npm start

# Run ESLint to check for syntax and style issues
npm run lint

# Run ESLint and automatically fix issues where possible
npm run lint:fix

# Build CSS with PostCSS/Tailwind
npm run build:css
```

## Code Style Guidelines

### Language and Framework
- JavaScript (ES6+ modules)
- Node.js with Express framework
- EJS templating engine

### Imports
- Use ES6 import/export syntax
- Group imports in logical order:
  1. Node.js built-in modules
  2. External packages
  3. Internal modules (relative paths)

### Formatting
- Indentation: 2 spaces (no tabs)
- Line endings: Unix (LF)
- Quotes: Single quotes preferred
- Semicolons: Required at end of statements
- Line length: No strict limit but aim for readability

### Naming Conventions
- Variables: camelCase
- Functions: camelCase
- Classes/Constructors: PascalCase
- Constants: UPPER_SNAKE_CASE
- Files: kebab-case (.js extensions)

### Types
- Use JSDoc for function documentation when helpful
- Prefer explicit variable declarations with meaningful names

### Error Handling
- Use async/await with try/catch blocks for asynchronous operations
- Use express-async-errors package for automatic async error handling
- Create custom error classes extending built-in Error class
- Use middleware for centralized error handling

### Additional Notes
- Models use Mongoose for MongoDB interaction
- Controllers handle business logic
- Routes define API endpoints
- Utils contain helper functions
- Middlewares handle authentication, validation, and request processing