import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { showToast } from '../components/Toast';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return showToast('Passwords do not match', 'error');
    }
    if (!token) {
      return showToast('Invalid or expired token', 'error');
    }

    setIsLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      showToast('Password reset successful!', 'success');
      navigate('/login');
    } catch (err) {
      showToast(err.response?.data?.error || 'Reset failed', 'error');
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
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '0.5rem' }}>Update Password</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Enter your new secure password below.</p>
          </header>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label className="form-label-saas">New Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>🔒</span>
                <input
                  type="password"
                  className="input-saas"
                  style={{ paddingLeft: '42px' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="form-label-saas">Confirm New Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>🛡️</span>
                <input
                  type="password"
                  className="input-saas"
                  style={{ paddingLeft: '42px' }}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
              {isLoading ? 'Updating Password...' : 'Save New Password'}
            </button>
          </form>

          <footer style={{ textAlign: 'center', marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border-light)' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Changed your mind? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 800 }}>Sign In</Link>
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
