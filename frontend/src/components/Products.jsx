import { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '', stock: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      // API returns array directly, not wrapped in object
      const productsData = Array.isArray(response.data) ? response.data : [];
      setProducts(productsData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products: ' + err.message);
      console.error('Fetch products error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        name: formData.name,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };

      if (editingId) {
        await updateProduct(editingId, data);
        setSuccess('Product updated successfully!');
        setEditingId(null);
      } else {
        await createProduct(data);
        setSuccess('Product created successfully!');
      }
      setFormData({ name: '', price: '', stock: '' });
      fetchProducts();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Operation failed: ' + err.message);
    }
  };

  const handleEdit = (product) => {
    setFormData({ 
      name: product.name, 
      price: product.price.toString(), 
      stock: product.stock.toString() 
    });
    setEditingId(product.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        setSuccess('Product deleted successfully!');
        fetchProducts();
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError('Delete failed: ' + err.message);
      }
    }
  };

  return (
    <div className="main-content">
      <div className="top-bar">
        <h2 className="page-title">Product Inventory</h2>
        <button onClick={fetchProducts} className="btn-icon">
          🔄
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="form-panel" style={{ width: '100%' }}>
          <h3 style={{ marginBottom: '24px', color: 'white' }}>
            {editingId ? 'Edit Product' : 'Add New Product'}
          </h3>

          {error && <div className="status-badge status-unhealthy" style={{ marginBottom: '16px', width: '100%' }}>{error}</div>}
          {success && <div className="status-badge status-healthy" style={{ marginBottom: '16px', width: '100%' }}>{success}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g. Wireless Mouse"
                />
              </div>
              <div className="form-group">
                <label>Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  placeholder="0.00"
                />
              </div>
              <div className="form-group">
                <label>Stock Quantity</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                  placeholder="0"
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                {editingId ? 'Update' : 'Add Product'}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn"
                  style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ name: '', price: '', stock: '' });
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="panel" style={{ padding: '0', overflow: 'hidden', width: '100%' }}>
          <div className="panel-header" style={{ padding: '24px', borderBottom: '1px solid var(--border-glass)' }}>
            <h3 style={{ margin: 0 }}>Inventory List ({products.length})</h3>
          </div>

          {loading ? (
            <div className="loading" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading products...</div>
          ) : products.length === 0 ? (
            <div className="loading" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>No products found. Add one!</div>
          ) : (
            <div className="table-container">
              <table style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ width: '10%' }}>ID</th>
                    <th style={{ width: '30%' }}>Product Name</th>
                    <th style={{ width: '20%' }}>Price</th>
                    <th style={{ width: '20%' }}>Stock</th>
                    <th style={{ textAlign: 'right', width: '20%' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td style={{ fontFamily: 'monospace', color: 'var(--primary)' }}>#{product.id}</td>
                      <td>
                        <div style={{ fontWeight: '600', color: 'white' }}>{product.name}</div>
                      </td>
                      <td style={{ color: 'var(--success)', fontWeight: '600' }}>${product.price.toFixed(2)}</td>
                      <td>
                        <span className={`status-badge ${product.stock > 10 ? 'status-healthy' : 'status-unhealthy'}`}>
                          {product.stock} units
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button
                            onClick={() => handleEdit(product)}
                            className="btn"
                            style={{ padding: '8px 16px', fontSize: '12px', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
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

export default Products;
