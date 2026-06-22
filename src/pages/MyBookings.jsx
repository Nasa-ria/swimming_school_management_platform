import { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { showToast } from '../components/Toast';

export default function MyBookings() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('sessions'); // 'sessions' or 'orders'

  useEffect(() => {
    fetchData();
  }, [view]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = view === 'sessions' ? '/bookings' : '/orders';
      const { data } = await api.get(endpoint);
      setItems(data);
    } catch (err) {
      showToast(`Failed to load ${view}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel?')) return;
    try {
      const endpoint = view === 'sessions' ? `/bookings/${id}/cancel` : `/orders/${id}/cancel`;
      await api.put(endpoint);
      showToast('Cancelled successfully', 'success');
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.error || 'Cancellation failed', 'error');
    }
  };

  const getStatusBadge = (status) => {
    const s = status.toLowerCase();
    if (['confirmed', 'shipped', 'completed'].includes(s)) return 'success';
    if (['processing', 'pending'].includes(s)) return 'warning';
    if (['delivered'].includes(s)) return 'info';
    return 'danger';
  };

  const OrderTracker = ({ status }) => {
    const steps = ['confirmed', 'processing', 'shipped', 'delivered'];
    const currentIndex = steps.indexOf(status.toLowerCase());
    
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '1rem' }}>
        {steps.map((step, idx) => (
          <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '12px', height: '12px', borderRadius: '50%', 
              background: idx <= currentIndex ? 'var(--primary)' : 'var(--border-light)',
              boxShadow: idx === currentIndex ? '0 0 0 4px var(--primary-light)' : 'none'
            }}></div>
            {idx < steps.length - 1 && (
              <div style={{ width: '20px', height: '2px', background: idx < currentIndex ? 'var(--primary)' : 'var(--border-light)' }}></div>
            )}
          </div>
        ))}
        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginLeft: '8px' }}>
          {status}
        </span>
      </div>
    );
  };

  return (
    <div className="portal-container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="page-title">Purchase History</h1>
          <p className="page-subtitle">Track your training sessions and equipment orders.</p>
        </div>
        
        <div style={{ display: 'flex', background: 'var(--border-light)', padding: '4px', borderRadius: '12px' }}>
          <button 
            className={`btn-saas ${view === 'sessions' ? 'btn-saas-primary' : ''}`} 
            style={{ border: 'none', boxShadow: view === 'sessions' ? 'var(--shadow-sm)' : 'none', borderRadius: '10px' }}
            onClick={() => setView('sessions')}
          >
            Sessions
          </button>
          <button 
            className={`btn-saas ${view === 'orders' ? 'btn-saas-primary' : ''}`} 
            style={{ border: 'none', boxShadow: view === 'orders' ? 'var(--shadow-sm)' : 'none', borderRadius: '10px' }}
            onClick={() => setView('orders')}
          >
            Shop Orders
          </button>
        </div>
      </header>

      {loading ? (
        <LoadingSpinner />
      ) : items.length === 0 ? (
        <div className="card-saas" style={{ textAlign: 'center', padding: '6rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1.5rem', opacity: 0.2 }}>{view === 'sessions' ? '📅' : '📦'}</div>
          <h3 style={{ fontWeight: 800, color: 'var(--navy)', marginBottom: '1rem' }}>No {view} found</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>You haven't made any {view === 'sessions' ? 'bookings' : 'purchases'} yet.</p>
          <a href={view === 'sessions' ? '/sessions' : '/shop'} className="btn-saas btn-saas-primary">Start Exploring</a>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          {items.map(item => (
            <div key={item.id} className="card-saas animate-fade-up" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <div style={{ width: '60px', height: '60px', background: 'var(--info-soft)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: 'var(--primary)' }}>
                    {view === 'sessions' ? '🏊' : '🛍️'}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '4px' }}>
                      {view === 'sessions' ? item.title : `Order #${item.id.slice(-6).toUpperCase()}`}
                    </h3>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      {view === 'sessions' ? (
                        <>
                          {new Date(item.start_time).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(item.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </>
                      ) : (
                        <>Placed on {new Date(item.created_at).toLocaleDateString()}</>
                      )}
                    </div>
                    {view === 'orders' && <OrderTracker status={item.status} />}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--navy)', marginBottom: '12px' }}>
                    ${parseFloat(item.price || item.total_amount || 0).toFixed(2)}
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <span className={`badge-saas ${getStatusBadge(item.status)}`}>
                      {item.status.toUpperCase()}
                    </span>
                    {item.status.toLowerCase() === 'confirmed' && view === 'sessions' && (
                      <button className="btn-saas btn-saas-outline" style={{ padding: '4px 12px', fontSize: '0.75rem', color: 'var(--danger)', borderColor: 'transparent' }} onClick={() => handleCancel(item.id)}>Cancel</button>
                    )}
                  </div>
                </div>
              </div>

              {view === 'orders' && item.items && (
                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {item.items.map((prod, idx) => (
                    <div key={idx} style={{ padding: '6px 12px', background: '#f8fafc', border: '1px solid var(--border-light)', borderRadius: '8px', fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      {prod.quantity}x {prod.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
