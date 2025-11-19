import { useState, useEffect } from 'react';
import { getNotifications, createNotification, deleteNotification } from '../api';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({ userId: '', message: '', type: 'info' });

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await getNotifications();
      // API returns array directly, not wrapped in object
      const notificationsData = Array.isArray(response.data) ? response.data : [];
      setNotifications(notificationsData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch notifications: ' + err.message);
      console.error('Fetch notifications error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createNotification(formData);
      setSuccess('Notification created successfully!');
      setFormData({ userId: '', message: '', type: 'info' });
      fetchNotifications();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Creation failed: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await deleteNotification(id);
        setSuccess('Notification deleted successfully!');
        fetchNotifications();
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError('Delete failed: ' + err.message);
      }
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'warning': return '#f59e0b';
      default: return '#3b82f6';
    }
  };

  return (
    <div className="main-content">
      <div className="panel">
        <div className="panel-header">
          <h2 className="panel-title">Create Notification</h2>
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <div className="success" style={{ marginBottom: '16px' }}>
          <strong>Auto-Generated:</strong><br/>
          Notifications are automatically created by the Order Service when orders are placed.
          You can also manually create them here.
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>User ID</label>
            <input
              type="text"
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              required
              placeholder="Enter user ID"
            />
          </div>
          <div className="form-group">
            <label>Message</label>
            <input
              type="text"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              placeholder="Enter notification message"
            />
          </div>
          <div className="form-group">
            <label>Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            Create Notification
          </button>
        </form>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h2 className="panel-title">All Notifications ({notifications.length})</h2>
          <button onClick={fetchNotifications} className="btn btn-success">
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="loading">No notifications found. Create an order to generate one!</div>
        ) : (
          <div className="item-list">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className="item"
                style={{ borderLeft: `4px solid ${getTypeColor(notification.type)}` }}
              >
                <div className="item-header">
                  <div style={{ flex: 1 }}>
                    <div className="item-title">
                      {notification.message}
                    </div>
                    <div className="item-details" style={{ marginTop: '8px' }}>
                      <strong>Type:</strong>{' '}
                      <span 
                        style={{ 
                          color: getTypeColor(notification.type),
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          fontSize: '12px'
                        }}
                      >
                        {notification.type}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(notification.id)}
                    className="btn btn-danger"
                    style={{ padding: '4px 12px', fontSize: '12px' }}
                  >
                    Delete
                  </button>
                </div>
                <div className="item-details">
                  <strong>User ID:</strong> {notification.userId}
                </div>
                <div className="item-details">
                  <strong>Notification ID:</strong> {notification.id}
                </div>
                {notification.timestamp && (
                  <div className="item-details">
                    <strong>Created:</strong> {new Date(notification.timestamp).toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
