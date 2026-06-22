import { Link } from 'react-router-dom';

export default function OrderSuccess() {
  return (
    <div className="portal-container" style={{ textAlign: 'center', padding: '8rem 0' }}>
      <div style={{ 
        width: '100px', 
        height: '100px', 
        background: 'var(--success-soft)', 
        color: 'var(--success)', 
        borderRadius: '50%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        fontSize: '3rem', 
        margin: '0 auto 2.5rem auto',
        animation: 'scaleUp 0.5s ease-out'
      }}>
        ✓
      </div>
      
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '1.25rem' }}>Order Confirmed!</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', maxWidth: '500px', margin: '0 auto 3rem auto', lineHeight: '1.6' }}>
        Thank you for your purchase. Your order has been placed successfully and is being processed by our team.
      </p>
      
      <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center' }}>
        <Link to="/orders" className="btn-saas btn-saas-primary" style={{ padding: '14px 40px' }}>
          View My Orders
        </Link>
        <Link to="/shop" className="btn-saas btn-saas-outline" style={{ padding: '14px 40px' }}>
          Continue Shopping
        </Link>
      </div>

      <style>{`
        @keyframes scaleUp {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
