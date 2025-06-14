# Lostpeople - Web Application

A full-stack web application built with Express.js, EJS, and MongoDB. This application features user authentication, content management, and a responsive design.

## Features

- User Authentication (Login/Register)
- Admin Dashboard
- Content Management System
- File Upload with Cloudinary Integration
- CSRF Protection
- Session Management
- Responsive Design

## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: EJS (Embedded JavaScript)
- **Database**: MongoDB
- **Authentication**: JWT, bcrypt
- **File Storage**: Cloudinary
- **Other Tools**:
  - express-session for session management
  - express-validator for input validation
  - multer for file uploads
  - marked for markdown processing
  - slugify for URL-friendly slugs

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd lostpeople
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
lostpeople/
├── app/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middlewares/    # Custom middlewares
│   ├── models/         # Database models
│   ├── routes/         # Route definitions
│   └── utils/          # Utility functions
├── public/             # Static files (CSS, JS, images)
├── views/              # EJS templates
├── index.js           # Application entry point
└── package.json       # Project dependencies
```

## Development

- `npm run dev`: Start development server with nodemon
- `npm start`: Start production server

## Security Features

- CSRF Protection
- Session Management
- Password Hashing
- Input Validation
- Secure File Upload

## Future Improvements

1. **Code Refactoring**
   - Implement MVC pattern more strictly
   - Separate business logic from controllers
   - Add service layer

2. **Architecture Improvements**
   - Consider moving to TypeScript
   - Implement proper error handling system
   - Add request validation middleware
   - Implement proper logging system

3. **Feature Enhancements**
   - Add API documentation
   - Implement rate limiting
   - Add caching layer
   - Implement real-time features
   - Add unit and integration tests

4. **Performance Optimization**
   - Implement caching strategies
   - Optimize database queries
   - Add compression middleware
   - Implement lazy loading for images

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
