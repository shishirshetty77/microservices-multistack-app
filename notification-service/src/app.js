const express = require('express');
const cors = require('cors');
const config = require('./config');
const logger = require('./logger');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

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

app.use('/api/notifications', routes);

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: config.SERVICE_NAME,
        time: new Date().toISOString()
    });
});

app.use((err, req, res, next) => {
    logger.error('Unhandled error', err);
    res.status(500).json({ error: 'Internal server error' });
});

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

const server = app.listen(config.PORT, () => {
    logger.info(`${config.SERVICE_NAME} listening on port ${config.PORT}`);
});

module.exports = app;
