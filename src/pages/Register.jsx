import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../components/Toast';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirectUrl = searchParams.get('redirect');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return showToast('Passwords do not match', 'error');
    }

    setIsLoading(true);
    try {
      await register(formData.name, formData.email, formData.password, formData.phone);
      showToast('Account created successfully!', 'success');
      
      if (redirectUrl) {
        navigate(redirectUrl);
      } else {
        navigate('/');
      }
    } catch (err) {
      showToast(err.response?.data?.error || 'Registration failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-saas">
      <div className="auth-container-saas" style={{ maxWidth: '540px' }}>
        <div className="card-saas auth-card animate-fade-up">
          <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <Link to="/" className="sidebar-logo-saas" style={{ color: 'var(--navy)', justifyContent: 'center', marginBottom: '1rem' }}>
              Alraad<span>Swim</span>
            </Link>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '0.5rem' }}>Join the Academy</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Begin your journey towards aquatic mastery.</p>
          </header>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="form-label-saas">Full Name</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>👤</span>
                <input
                  type="text"
                  name="name"
                  className="input-saas"
                  style={{ paddingLeft: '42px' }}
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label className="form-label-saas">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="input-saas"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="form-label-saas">Phone (Optional)</label>
                <input
                  type="tel"
                  name="phone"
                  className="input-saas"
                  placeholder="+1 234..."
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label className="form-label-saas">Password</label>
                <input
                  type="password"
                  name="password"
                  className="input-saas"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="form-label-saas">Confirm</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="input-saas"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={{ padding: '1rem', background: 'var(--bg-page)', borderRadius: '12px', fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              By creating an account, you agree to our <a href="#" style={{ color: 'var(--primary)', fontWeight: 700 }}>Terms of Service</a> and our <a href="#" style={{ color: 'var(--primary)', fontWeight: 700 }}>Privacy Policy</a>.
            </div>

            <button
              type="submit"
              className="btn-saas btn-saas-primary"
              style={{ width: '100%', padding: '14px', marginTop: '0.5rem', fontSize: '1rem' }}
              disabled={isLoading}
            >
              {isLoading ? 'Creating Profile...' : 'Complete Enrollment'}
            </button>
          </form>

          <footer style={{ textAlign: 'center', marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border-light)' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Already a member? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 800 }}>Sign In</Link>
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
        }
        .auth-card {
          padding: 3.5rem;
          border: none;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
        }
        @media (max-width: 640px) {
          .auth-card { padding: 2rem; }
          .auth-card form > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
