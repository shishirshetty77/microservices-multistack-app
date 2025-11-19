import { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../api';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      // API returns array directly, not wrapped in object
      const usersData = Array.isArray(response.data) ? response.data : [];
      setUsers(usersData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users: ' + err.message);
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateUser(editingId, formData);
        setSuccess('User updated successfully!');
        setEditingId(null);
      } else {
        await createUser(formData);
        setSuccess('User created successfully!');
      }
      setFormData({ name: '', email: '' });
      fetchUsers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Operation failed: ' + err.message);
    }
  };

  const handleEdit = (user) => {
    setFormData({ name: user.name, email: user.email });
    setEditingId(user.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        setSuccess('User deleted successfully!');
        fetchUsers();
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError('Delete failed: ' + err.message);
      }
    }
  };

  return (
    <div className="main-content">
      <div className="panel">
        <div className="panel-header">
          <h2 className="panel-title">
            {editingId ? 'Edit User' : 'Create New User'}
          </h2>
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Enter user name"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="Enter email address"
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Update User' : 'Create User'}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ name: '', email: '' });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h2 className="panel-title">All Users ({users.length})</h2>
          <button onClick={fetchUsers} className="btn btn-success">
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="loading">No users found. Create one!</div>
        ) : (
          <div className="item-list">
            {users.map((user) => (
              <div key={user.id} className="item">
                <div className="item-header">
                  <div className="item-title">{user.name}</div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleEdit(user)}
                      className="btn btn-primary"
                      style={{ padding: '4px 12px', fontSize: '12px' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="btn btn-danger"
                      style={{ padding: '4px 12px', fontSize: '12px' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="item-details">
                  <strong>Email:</strong> {user.email}
                </div>
                <div className="item-details">
                  <strong>ID:</strong> {user.id}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Users;
