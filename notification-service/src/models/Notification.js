class Notification {
    constructor(userId, message, type = 'info') {
        this.id = null;
        this.userId = userId;
        this.message = message;
        this.type = type; // info, success, warning, error
        this.read = false;
        this.createdAt = new Date();
    }

    validate() {
        if (!this.userId || this.userId.trim() === '') {
            return { valid: false, error: 'User ID is required' };
        }
        if (!this.message || this.message.trim() === '') {
            return { valid: false, error: 'Message is required' };
        }
        return { valid: true };
    }

    toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            message: this.message,
            type: this.type,
            read: this.read,
            createdAt: this.createdAt
        };
    }
}

module.exports = Notification;
