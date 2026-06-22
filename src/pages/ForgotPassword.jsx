import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { showToast } from '../components/Toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setIsSent(true);
      showToast('Reset link sent to your email', 'success');
    } catch (err) {
      showToast(err.response?.data?.error || 'Request failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-saas">
      <div className="auth-container-saas">
        <div className="card-saas auth-card animate-fade-up">
          <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <Link to="/" className="sidebar-logo-saas" style={{ color: 'var(--navy)', justifyContent: 'center', marginBottom: '1rem' }}>
              Alraad<span>Swim</span>
            </Link>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '0.5rem' }}>Reset Password</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              {isSent ? 'Check your inbox for instructions.' : 'Enter your email to receive a recovery link.'}
            </p>
          </header>

          {!isSent ? (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label className="form-label-saas">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>✉️</span>
                  <input
                    type="email"
                    className="input-saas"
                    style={{ paddingLeft: '42px' }}
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-saas btn-saas-primary"
                style={{ width: '100%', padding: '14px', marginTop: '1rem', fontSize: '1rem' }}
                disabled={isLoading}
              >
                {isLoading ? 'Sending Link...' : 'Send Recovery Link'}
              </button>
            </form>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>📩</div>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '2rem' }}>
                We've sent a password reset link to <strong>{email}</strong>. Please check your spam folder if you don't see it within a few minutes.
              </p>
              <button className="btn-saas btn-saas-outline" onClick={() => setIsSent(false)} style={{ width: '100%' }}>
                Try another email
              </button>
            </div>
          )}

          <footer style={{ textAlign: 'center', marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border-light)' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Remembered your password? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 800 }}>Sign In</Link>
            </p>
          </footer>
        </div>
      </div>

      <style>{`
        .auth-page-saas {
          min-height: 100vh;
          background: radial-gradient(circle at top right, var(--info-soft) 0%, transparent 40%),
                      radial-gradient(circle at bottom left, var(--primary-light) 0%, transparent 40%);
          background-color: var(--bg-page);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .auth-container-saas {
          width: 100%;
          max-width: 480px;
        }
        .auth-card {
          padding: 3.5rem;
          border: none;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
        }
        @media (max-width: 480px) {
          .auth-card { padding: 2rem; }
        }
      `}</style>
    </div>
  );
}
