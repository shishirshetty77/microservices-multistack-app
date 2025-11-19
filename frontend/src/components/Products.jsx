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
      <div className="panel">
        <div className="panel-header">
          <h2 className="panel-title">
            {editingId ? 'Edit Product' : 'Create New Product'}
          </h2>
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Enter product name"
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
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Update Product' : 'Create Product'}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn"
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

      <div className="panel">
        <div className="panel-header">
          <h2 className="panel-title">All Products ({products.length})</h2>
          <button onClick={fetchProducts} className="btn btn-success">
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="loading">No products found. Create one!</div>
        ) : (
          <div className="item-list">
            {products.map((product) => (
              <div key={product.id} className="item">
                <div className="item-header">
                  <div className="item-title">{product.name}</div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleEdit(product)}
                      className="btn btn-primary"
                      style={{ padding: '4px 12px', fontSize: '12px' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="btn btn-danger"
                      style={{ padding: '4px 12px', fontSize: '12px' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="item-details">
                  <strong>Price:</strong> ${product.price.toFixed(2)}
                </div>
                <div className="item-details">
                  <strong>Stock:</strong> {product.stock} units
                </div>
                <div className="item-details">
                  <strong>ID:</strong> {product.id}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
