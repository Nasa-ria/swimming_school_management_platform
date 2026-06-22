import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { showToast } from '../../components/Toast';

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    category: '',
    stock: 0,
    description: '',
    image_url: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/admin/inventory');
      setProducts(data);
    } catch (err) {
      showToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, formData);
        showToast('Product updated', 'success');
      } else {
        await api.post('/products', formData);
        showToast('Product created', 'success');
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      showToast('Action failed', 'error');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      showToast('Product deleted', 'success');
      fetchProducts();
    } catch (err) {
      showToast('Delete failed', 'error');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="page-title">Shop Inventory</h1>
          <p className="page-subtitle">Manage school equipment, apparel, and merchandise listings.</p>
        </div>
        <button className="btn-saas btn-saas-primary" onClick={() => { setEditingProduct(null); setFormData({ name: '', price: 0, category: '', stock: 0, description: '', image_url: '' }); setIsModalOpen(true); }}>
          <span>+</span> Add Product
        </button>
      </header>

      <section className="table-wrapper-saas">
        <table className="table-saas">
          <thead>
            <tr>
              <th>Product Information</th>
              <th>Category</th>
              <th>Price</th>
              <th>Availability</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '44px', height: '44px', background: '#f8fafc', border: '1px solid var(--border-light)', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {p.image_url ? (
                        <img src={p.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={p.name} />
                      ) : (
                        <span style={{ fontSize: '1.2rem' }}>🛍️</span>
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--navy)' }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {p.id?.slice(-6).toUpperCase() || p._id?.slice(-6).toUpperCase() || 'N/A'}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="badge-saas info" style={{ fontWeight: 700 }}>{p.category}</span>
                </td>
                <td style={{ fontWeight: 800, color: 'var(--navy)' }}>${p.price.toFixed(2)}</td>
                <td>
                  <span className={`badge-saas ${p.stock <= 5 ? 'warning' : 'success'}`}>
                    {p.stock} in stock
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button className="btn-saas btn-saas-outline" style={{ padding: '4px 12px', fontSize: '0.75rem' }} onClick={() => handleEdit(p)}>Edit</button>
                    <button className="btn-saas btn-saas-outline" style={{ padding: '4px 12px', fontSize: '0.75rem', color: 'var(--danger)', borderColor: 'var(--danger-soft)' }} onClick={() => handleDelete(p.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '5rem' }}>
                  <div style={{ color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
                    <h3 style={{ fontWeight: 800, color: 'var(--navy)' }}>Inventory is empty</h3>
                    <p>Add your first product to start selling gear to your students.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* SaaS Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1.5rem' }}>
          <div className="card-saas animate-fade-up" style={{ width: '100%', maxWidth: '540px', padding: '2.5rem', border: 'none', boxShadow: 'var(--shadow-xl)' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy)' }}>{editingProduct ? 'Update Product' : 'Add New Product'}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Enter the product specifications for the school shop.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label-saas">Product Name</label>
                <input type="text" className="input-saas" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Pro Goggles X1" required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <label className="form-label-saas">Category</label>
                  <input type="text" className="input-saas" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="Equipment" required />
                </div>
                <div>
                  <label className="form-label-saas">Price ($)</label>
                  <input type="number" step="0.01" className="input-saas" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label-saas">Initial Stock Level</label>
                <input type="number" className="input-saas" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} required />
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label className="form-label-saas">Product Image URL</label>
                <input type="text" className="input-saas" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} placeholder="https://example.com/image.jpg" />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-saas btn-saas-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-saas btn-saas-primary">
                  {editingProduct ? 'Save Changes' : 'List Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
