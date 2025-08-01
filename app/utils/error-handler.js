import logger from './logger.js';

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    // Log the error
    logger.error(
        `${statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
        {
            error: {
                message: err.message,
                stack: err.stack,
            },
        }
    );

    // If the request expects JSON (e.g., an API call), send a JSON response
    if (req.originalUrl.startsWith('/api/')) {
        return res.status(statusCode).json({
            message: err.message,
            stack: process.env.NODE_ENV === 'production' ? null : err.stack,
        });
    }

    // Otherwise, render the appropriate error page
    if (statusCode === 404) {
        return res.status(404).render('404');
    }

    res.status(statusCode).render('error', {
        message: 'We are sorry, but something went wrong on our end. Please try again later.',
        // We only pass the detailed error object in development mode
        err: process.env.NODE_ENV !== 'production' ? err : null,
    });
};

export default errorHandler;