import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { useCart } from '../context/CartContext';
import { showToast } from '../components/Toast';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ category: '', search: '' });
  const [categories, setCategories] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [filter.category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/products', { params: filter });
      setProducts(data);
    } catch (err) {
      showToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/products/categories');
      setCategories(data);
    } catch (err) {}
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product);
    } catch (err) {
      showToast('Login to start shopping', 'info');
    }
  };

  return (
    <div className="portal-container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--border-light)', paddingBottom: '2rem', marginBottom: '3rem' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '2.25rem' }}>Equipment Shop</h1>
          <p className="page-subtitle">Professional gear and apparel designed for speed, durability, and performance.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Filter:</span>
            <select 
              className="input-saas" 
              style={{ width: '220px', paddingLeft: '65px', borderRadius: '12px', fontWeight: 700 }}
              value={filter.category}
              onChange={(e) => setFilter({...filter, category: e.target.value})}
            >
              <option value="">All Equipment</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {loading ? (
        <LoadingSpinner />
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '8rem 0' }}>
          <div style={{ fontSize: '4rem', marginBottom: '2rem', opacity: 0.2 }}>🛍️</div>
          <h3 style={{ fontWeight: 800, color: 'var(--navy)', fontSize: '1.75rem', marginBottom: '1rem' }}>No products found</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>We couldn't find any items matching your criteria. Try browsing all categories.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {products.map(product => (
            <div key={product._id} className="card-saas animate-fade-up" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
              <Link to={`/shop/${product._id}`} style={{ position: 'relative', height: '280px', backgroundColor: '#f8fafc', display: 'block' }}>
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', opacity: 0.2 }}>
                    🏊‍♂️
                  </div>
                )}
                
                <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <span className="badge-saas info" style={{ backgroundColor: 'white', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                    {product.category.toUpperCase()}
                  </span>
                </div>

                {product.stock <= 5 && product.stock > 0 && (
                  <span className="badge-saas warning" style={{ position: 'absolute', top: '16px', right: '16px', boxShadow: 'var(--shadow-md)' }}>Low Stock</span>
                )}
                {product.stock === 0 && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="badge-saas warning" style={{ fontSize: '0.875rem', padding: '8px 16px', fontWeight: 800 }}>SOLD OUT</span>
                  </div>
                )}
              </Link>
              
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <Link to={`/shop/${product._id}`} style={{ textDecoration: 'none' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '1.5rem', transition: 'color 0.2s' }} className="shop-title-hover">{product.name}</h3>
                </Link>
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>MSRP</div>
                    <div style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--navy)' }}>${product.price.toFixed(2)}</div>
                  </div>
                  
                  <button 
                    className="btn-saas btn-saas-primary"
                    disabled={product.stock === 0}
                    onClick={() => handleAddToCart(product)}
                    style={{ padding: '10px 24px', borderRadius: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <span>Add</span> 🛒
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
