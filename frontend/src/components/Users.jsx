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
      <div className="top-bar">
        <h2 className="page-title">User Management</h2>
        <button onClick={fetchUsers} className="btn-icon">
          🔄
        </button>
      </div>

      <div className="form-split-layout">
        <div className="form-panel">
          <h3 style={{ marginBottom: '24px', color: 'white' }}>
            {editingId ? 'Edit User' : 'Create New User'}
          </h3>

          {error && <div className="status-badge status-unhealthy" style={{ marginBottom: '16px', width: '100%' }}>{error}</div>}
          {success && <div className="status-badge status-healthy" style={{ marginBottom: '16px', width: '100%' }}>{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g. John Doe"
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="john@example.com"
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                {editingId ? 'Update' : 'Create User'}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn"
                  style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}
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

        <div className="panel" style={{ padding: '0', overflow: 'hidden' }}>
          <div className="panel-header" style={{ padding: '24px', borderBottom: '1px solid var(--border-glass)' }}>
            <h3 style={{ margin: 0 }}>Registered Users ({users.length})</h3>
          </div>

          {loading ? (
            <div className="loading" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading users...</div>
          ) : users.length === 0 ? (
            <div className="loading" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>No users found. Create one!</div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td style={{ fontFamily: 'monospace', color: 'var(--primary)' }}>#{user.id}</td>
                      <td>
                        <div style={{ fontWeight: '600', color: 'white' }}>{user.name}</div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{user.email}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button
                            onClick={() => handleEdit(user)}
                            className="btn"
                            style={{ padding: '8px 16px', fontSize: '12px', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="btn btn-danger"
                            style={{ padding: '8px 16px', fontSize: '12px' }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Users;
