import { useState, useEffect } from 'react';
import { getOrders, createOrder, deleteOrder, getUsers, getProducts } from '../api';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({ userId: '', productId: '', quantity: '1' });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getOrders();
      // API returns array directly, not wrapped in object
      const ordersData = Array.isArray(response.data) ? response.data : [];
      setOrders(ordersData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch orders: ' + err.message);
      console.error('Fetch orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersAndProducts = async () => {
    try {
      const [usersRes, productsRes] = await Promise.all([
        getUsers(),
        getProducts()
      ]);
      // API returns arrays directly, not wrapped in objects
      const usersData = Array.isArray(usersRes.data) ? usersRes.data : [];
      const productsData = Array.isArray(productsRes.data) ? productsRes.data : [];
      setUsers(usersData);
      setProducts(productsData);
    } catch (err) {
      console.error('Failed to fetch users/products:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchUsersAndProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        userId: formData.userId,
        productId: formData.productId,
        quantity: parseInt(formData.quantity)
      };

      await createOrder(data);
      setSuccess('Order created successfully! Notification sent to user.');
      setFormData({ userId: '', productId: '', quantity: '1' });
      fetchOrders();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Order creation failed: ' + err.response?.data?.error || err.message);
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteOrder(id);
        setSuccess('Order deleted successfully!');
        fetchOrders();
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError('Delete failed: ' + err.message);
      }
    }
  };

  return (
    <div className="main-content">
      <div className="top-bar">
        <h2 className="page-title">Order Processing</h2>
        <button onClick={fetchOrders} className="btn-icon">
          🔄
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="form-panel" style={{ width: '100%' }}>
          <h3 style={{ marginBottom: '24px', color: 'white' }}>Create New Order</h3>

          {error && <div className="status-badge status-unhealthy" style={{ marginBottom: '16px', width: '100%' }}>{error}</div>}
          {success && <div className="status-badge status-healthy" style={{ marginBottom: '16px', width: '100%' }}>{success}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
              <div className="form-group">
                <label>User ID</label>
                <input
                  type="text"
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  required
                  placeholder="Enter User ID"
                />
              </div>
              <div className="form-group">
                <label>Product ID</label>
                <input
                  type="text"
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  required
                  placeholder="Enter Product ID"
                />
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                  min="1"
                  placeholder="1"
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '24px' }}>
              Place Order
            </button>
          </form>
        </div>

        <div className="panel" style={{ padding: '0', overflow: 'hidden', width: '100%' }}>
          <div className="panel-header" style={{ padding: '24px', borderBottom: '1px solid var(--border-glass)' }}>
            <h3 style={{ margin: 0 }}>Recent Orders ({orders.length})</h3>
          </div>

          {loading ? (
            <div className="loading" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="loading" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>No orders found. Create one!</div>
          ) : (
            <div className="table-container">
              <table style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ width: '10%' }}>Order ID</th>
                    <th style={{ width: '20%' }}>User ID</th>
                    <th style={{ width: '20%' }}>Product ID</th>
                    <th style={{ width: '10%' }}>Qty</th>
                    <th style={{ width: '20%' }}>Total</th>
                    <th style={{ width: '20%' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td style={{ fontFamily: 'monospace', color: 'var(--primary)' }}>#{order.id}</td>
                      <td>User #{order.userId}</td>
                      <td>Product #{order.productId}</td>
                      <td>{order.quantity}</td>
                      <td style={{ color: 'var(--success)', fontWeight: '600' }}>${order.totalPrice.toFixed(2)}</td>
                      <td>
                        <span className="status-badge status-healthy">
                          {order.status}
                        </span>
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

export default Orders;
