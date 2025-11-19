const express = require('express');
const cors = require('cors');
const config = require('./config');
const logger = require('./logger');
const routes = require('./routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info('Request', {
            method: req.method,
            path: req.path,
            status: res.statusCode,
            duration: `${duration}ms`
        });
    });
    next();
});

// Routes
app.use('/api/notifications', routes);

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: config.SERVICE_NAME,
        time: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error('Unhandled error', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    server.close(() => {
        logger.info('Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    server.close(() => {
        logger.info('Server closed');
        process.exit(0);
    });
});

// Start server
const server = app.listen(config.PORT, () => {
    logger.info(`${config.SERVICE_NAME} listening on port ${config.PORT}`);
});

module.exports = app;
