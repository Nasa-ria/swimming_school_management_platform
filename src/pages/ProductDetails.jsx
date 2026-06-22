import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { useCart } from '../context/CartContext';
import { showToast } from '../components/Toast';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
    } catch (err) {
      showToast('Product not found', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    await addToCart(product, quantity);
  };

  if (loading) return <LoadingSpinner />;
  if (!product) return (
    <div className="portal-container" style={{ padding: '8rem 0', textAlign: 'center' }}>
      <h2 style={{ fontWeight: 800, color: 'var(--navy)' }}>Product not found</h2>
      <Link to="/shop" className="btn-saas btn-saas-outline" style={{ marginTop: '2rem' }}>Back to Shop</Link>
    </div>
  );

  return (
    <div className="portal-container" style={{ paddingTop: '4rem', paddingBottom: '8rem' }}>
      <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '3rem', fontSize: '0.875rem' }}>
        ← Back to Equipment Catalog
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'start' }}>
        {/* Product Image */}
        <div className="card-saas" style={{ padding: '2rem', background: '#f8fafc', borderRadius: '24px', overflow: 'hidden' }}>
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} style={{ width: '100%', borderRadius: '16px', boxShadow: 'var(--shadow-lg)' }} />
          ) : (
            <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6rem', opacity: 0.1 }}>🏊‍♂️</div>
          )}
        </div>

        {/* Product Info */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
            <span className="badge-saas info" style={{ padding: '6px 12px', fontSize: '0.8125rem' }}>{product.category}</span>
            {product.stock > 0 ? (
              <span className="badge-saas success" style={{ padding: '6px 12px', fontSize: '0.8125rem' }}>In Stock ({product.stock})</span>
            ) : (
              <span className="badge-saas danger" style={{ padding: '6px 12px', fontSize: '0.8125rem' }}>Out of Stock</span>
            )}
          </div>

          <h1 style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--navy)', letterSpacing: '-0.04em', lineHeight: '1.1', marginBottom: '1.5rem' }}>
            {product.name}
          </h1>

          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '2.5rem' }}>
            ${product.price.toFixed(2)}
          </div>

          <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.05rem', marginBottom: '3rem' }}>
            {product.description || 'No description available for this premium piece of equipment.'}
          </div>

          <div style={{ padding: '2.5rem', background: 'white', border: '1px solid var(--border-light)', borderRadius: '20px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ marginBottom: '2rem' }}>
              <label className="form-label-saas">Select Quantity</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-page)', padding: '6px', borderRadius: '12px', width: 'fit-content' }}>
                <button 
                  style={{ width: '40px', height: '40px', background: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 800, color: 'var(--navy)', boxShadow: 'var(--shadow-sm)' }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >−</button>
                <span style={{ padding: '0 16px', fontSize: '1.1rem', fontWeight: 800, color: 'var(--navy)', minWidth: '40px', textAlign: 'center' }}>{quantity}</span>
                <button 
                  style={{ width: '40px', height: '40px', background: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 800, color: 'var(--navy)', boxShadow: 'var(--shadow-sm)' }}
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                >+</button>
              </div>
            </div>

            <button 
              className="btn-saas btn-saas-primary" 
              style={{ width: '100%', padding: '18px', fontSize: '1.1rem' }}
              disabled={product.stock === 0}
              onClick={handleAddToCart}
            >
              Add to Academy Cart 🛒
            </button>
          </div>

          <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🚚</span>
              <div>
                <div style={{ fontWeight: 800, color: 'var(--navy)', fontSize: '0.875rem' }}>Express Academy Delivery</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Get your gear delivered to the pool in 2-3 business days.</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🛡️</span>
              <div>
                <div style={{ fontWeight: 800, color: 'var(--navy)', fontSize: '0.875rem' }}>Quality Guaranteed</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>All AlraadSwim equipment is tested for performance.</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; gap: 3rem !important; }
        }
      `}</style>
    </div>
  );
}
