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
      <div className="panel">
        <div className="panel-header">
          <h2 className="panel-title">Create New Order</h2>
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <div className="success" style={{ marginBottom: '16px' }}>
          <strong>How it works:</strong><br/>
          When you create an order, the Order Service (Java) will:
          <ol style={{ marginTop: '8px', marginLeft: '20px' }}>
            <li>Call User Service to verify the user exists</li>
            <li>Call Product Service to check product availability</li>
            <li>Call Notification Service to send a confirmation</li>
          </ol>
          This demonstrates microservice orchestration!
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select User</label>
            <select
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              required
            >
              <option value="">Choose a user...</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Select Product</label>
            <select
              value={formData.productId}
              onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
              required
            >
              <option value="">Choose a product...</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - ${product.price} (Stock: {product.stock})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Create Order
          </button>
        </form>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h2 className="panel-title">All Orders ({orders.length})</h2>
          <button onClick={fetchOrders} className="btn btn-success">
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="loading">No orders found. Create one!</div>
        ) : (
          <div className="item-list">
            {orders.map((order) => (
              <div key={order.id} className="item">
                <div className="item-header">
                  <div className="item-title">Order #{order.id}</div>
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="btn btn-danger"
                    style={{ padding: '4px 12px', fontSize: '12px' }}
                  >
                    Delete
                  </button>
                </div>
                <div className="item-details">
                  <strong>User ID:</strong> {order.userId}
                </div>
                <div className="item-details">
                  <strong>Product ID:</strong> {order.productId}
                </div>
                <div className="item-details">
                  <strong>Quantity:</strong> {order.quantity}
                </div>
                <div className="item-details">
                  <strong>Total:</strong> ${order.totalPrice?.toFixed(2) || 'N/A'}
                </div>
                <div className="item-details">
                  <strong>Status:</strong> {order.status || 'Confirmed'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
