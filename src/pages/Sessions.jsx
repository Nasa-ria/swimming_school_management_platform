import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { showToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ level: 'all', search: '' });
  const { isLoggedIn } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchSessions();
  }, [filter.level]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/sessions', { params: filter });
      setSessions(data);
    } catch (err) {
      showToast('Failed to load sessions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const handleBooking = async (session) => {
    if (!isLoggedIn) {
      showToast('Please login or register to continue booking', 'info');
      navigate('/login?redirect=/sessions');
      return;
    }
    
    // Add to cart and proceed to secure checkout
    await addToCart(session);
    navigate('/cart');
  };

  return (
    <div className="portal-container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--border-light)', paddingBottom: '2rem', marginBottom: '3rem' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '2.25rem' }}>Class Catalog</h1>
          <p className="page-subtitle">Premium swimming sessions tailored for every skill level, from beginners to competitive athletes.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Level:</span>
            <select 
              className="input-saas" 
              style={{ width: '180px', paddingLeft: '65px', borderRadius: '12px', fontWeight: 700 }}
              value={filter.level}
              onChange={(e) => setFilter({...filter, level: e.target.value})}
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
      </header>

      {loading ? (
        <LoadingSpinner />
      ) : sessions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '8rem 0' }}>
          <div style={{ fontSize: '4rem', marginBottom: '2rem', opacity: 0.2 }}>🌊</div>
          <h3 style={{ fontWeight: 800, color: 'var(--navy)', fontSize: '1.75rem', marginBottom: '1rem' }}>No sessions available</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>Try adjusting your level filters or check back later for new seasonal sessions.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '2rem' }}>
          {sessions.map(session => (
            <div key={session._id} className="card-saas animate-fade-up" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <span className={`badge-saas ${session.level === 'beginner' ? 'info' : (session.level === 'intermediate' ? 'warning' : 'success')}`} style={{ fontWeight: 800 }}>
                    {session.level.toUpperCase()}
                  </span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy)' }}>${session.price}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Per Session</div>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '0.75rem' }}>{session.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {session.description}
                </p>
                
                <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-light)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.8125rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1rem' }}>📅</span> <span style={{ fontWeight: 600, color: 'var(--navy)' }}>{new Date(session.start_time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1rem' }}>🕒</span> <span style={{ fontWeight: 600, color: 'var(--navy)' }}>{new Date(session.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1rem' }}>📍</span> <span style={{ fontWeight: 600, color: 'var(--navy)' }}>{session.location}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1rem' }}>👤</span> <span style={{ fontWeight: 600, color: 'var(--navy)' }}>{session.instructor_name || 'TBA'}</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 'auto', padding: '1.5rem 2rem 2rem 2rem', borderTop: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.8125rem' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Availability</span>
                  <span style={{ fontWeight: 800, color: session.enrolled >= session.capacity ? 'var(--danger)' : 'var(--success)' }}>
                    {session.enrolled} / {session.capacity} spots taken
                  </span>
                </div>
                <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden', marginBottom: '2rem' }}>
                  <div style={{ 
                    width: `${(session.enrolled / session.capacity) * 100}%`, 
                    height: '100%', 
                    backgroundColor: session.enrolled >= session.capacity ? 'var(--danger)' : 'var(--primary)',
                    transition: 'width 1s ease-out'
                  }}></div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    className="btn-saas btn-saas-primary"
                    disabled={session.status !== 'available'}
                    onClick={() => handleBooking(session._id)}
                    style={{ flex: 4, justifyContent: 'center', padding: '12px' }}
                  >
                    {session.status === 'available' ? 'Confirm Booking' : 'Fully Booked'}
                  </button>
                  <button 
                    className="btn-saas btn-saas-outline"
                    onClick={() => addToCart(session)}
                    disabled={session.status !== 'available'}
                    style={{ flex: 1, justifyContent: 'center', padding: '12px', fontSize: '1.25rem' }}
                  >
                    🛒
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
