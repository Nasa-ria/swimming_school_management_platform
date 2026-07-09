import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../components/Toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await login(email, password);

      showToast(`Welcome back, ${user.name}!`, 'success');
      
      const searchParams = new URLSearchParams(location.search);
      const redirectUrl = searchParams.get('redirect');
      
      if (redirectUrl) {
        navigate(redirectUrl);
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'instructor') {
        navigate('/instructor');
      } else if (user.role === 'student') {
        navigate('/student/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
       const message = err.response?.data?.error?.message || 'Login failed';
       showToast(message, 'error');
      // showToast(err.response?.data?.error || 'Login failed', 'error');
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
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '0.5rem' }}>Welcome Back</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Enter your credentials to access your portal.</p>
          </header>

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

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="form-label-saas" style={{ marginBottom: 0 }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary)' }}>Forgot password?</Link>
              </div>
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

            <button
              type="submit"
              className="btn-saas btn-saas-primary"
              style={{ width: '100%', padding: '14px', marginTop: '1rem', fontSize: '1rem' }}
              disabled={isLoading}
            >
              {isLoading ? 'Authenticating...' : 'Sign In to Portal'}
            </button>
          </form>

          <footer style={{ textAlign: 'center', marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border-light)' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              New to the academy? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 800 }}>Create an account</Link>
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
