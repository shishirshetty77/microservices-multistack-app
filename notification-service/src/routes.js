const express = require('express');
const router = express.Router();
const Notification = require('./models/Notification');
const logger = require('./logger');

// In-memory storage
const notifications = new Map();
let nextId = 1;

// Send notification
router.post('/send', (req, res) => {
    try {
        const { userId, message, type } = req.body;

        const notification = new Notification(userId, message, type);
        
        const validation = notification.validate();
        if (!validation.valid) {
            logger.warn('Notification validation failed', { error: validation.error });
            return res.status(400).json({ error: validation.error });
        }

        notification.id = String(nextId++);
        notifications.set(notification.id, notification);

        logger.info('Notification sent', { 
            notificationId: notification.id, 
            userId: notification.userId 
        });

        res.status(201).json(notification.toJSON());
    } catch (error) {
        logger.error('Failed to send notification', error);
        res.status(500).json({ error: 'Failed to send notification' });
    }
});

// Get notifications for a user
router.get('/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        
        const userNotifications = Array.from(notifications.values())
            .filter(n => n.userId === userId)
            .map(n => n.toJSON());

        res.json(userNotifications);
    } catch (error) {
        logger.error('Failed to get user notifications', error);
        res.status(500).json({ error: 'Failed to get notifications' });
    }
});

// Get all notifications
router.get('/', (req, res) => {
    try {
        const allNotifications = Array.from(notifications.values())
            .map(n => n.toJSON());

        res.json(allNotifications);
    } catch (error) {
        logger.error('Failed to get notifications', error);
        res.status(500).json({ error: 'Failed to get notifications' });
    }
});

// Mark notification as read
router.patch('/:id/read', (req, res) => {
    try {
        const { id } = req.params;
        
        const notification = notifications.get(id);
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        notification.read = true;
        
        logger.info('Notification marked as read', { notificationId: id });
        
        res.json(notification.toJSON());
    } catch (error) {
        logger.error('Failed to mark notification as read', error);
        res.status(500).json({ error: 'Failed to update notification' });
    }
});

// Delete notification
router.delete('/:id', (req, res) => {
    try {
        const { id } = req.params;
        
        if (!notifications.has(id)) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        notifications.delete(id);
        
        logger.info('Notification deleted', { notificationId: id });
        
        res.json({ message: 'Notification deleted successfully' });
    } catch (error) {
        logger.error('Failed to delete notification', error);
        res.status(500).json({ error: 'Failed to delete notification' });
    }
});

module.exports = router;
