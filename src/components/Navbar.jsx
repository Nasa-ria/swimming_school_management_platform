import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, isLoggedIn, isAdmin, isInstructor, isStudent, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const close = () => setMenuOpen(false);

  // If we are on a dashboard page, the DashboardLayout handles the header
  const isDashboardPage = location.pathname.startsWith('/admin') || 
                          location.pathname.startsWith('/instructor') || 
                          location.pathname.startsWith('/student');

  if (isDashboardPage && window.innerWidth >= 1024) return null;

  return (
    <header className={`navbar-saas ${scrolled ? 'scrolled' : ''}`}>
      <div className="portal-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
        {/* Logo */}
        <Link to="/" className="sidebar-logo-saas" style={{ color: 'var(--navy)', marginBottom: 0 }} onClick={close}>
          Alraad<span>Swim</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="desktop-nav-saas" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <NavLink to="/sessions" className={({isActive}) => `nav-link-saas ${isActive ? 'active' : ''}`}>Sessions</NavLink>
          <NavLink to="/blog"     className={({isActive}) => `nav-link-saas ${isActive ? 'active' : ''}`}>Journal</NavLink>
          <NavLink to="/shop"     className={({isActive}) => `nav-link-saas ${isActive ? 'active' : ''}`}>Shop</NavLink>

          <div style={{ width: '1px', height: '24px', background: 'var(--border-light)', margin: '0 0.5rem' }}></div>

          {isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              {(isStudent || isAdmin || isInstructor) && (
                <Link to={isAdmin ? '/admin' : (isInstructor ? '/instructor' : '/student/dashboard')} className="btn-saas btn-saas-outline" style={{ padding: '8px 20px', fontSize: '0.8125rem' }}>
                  Portal
                </Link>
              )}
              
              {isLoggedIn && (
                <Link to="/cart" style={{ position: 'relative', fontSize: '1.25rem' }}>
                  🛒
                  {itemCount > 0 && (
                    <span style={{ position: 'absolute', top: '-8px', right: '-10px', background: 'var(--primary)', color: 'white', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '10px', fontWeight: 800, border: '2px solid white' }}>
                      {itemCount}
                    </span>
                  )}
                </Link>
              )}

              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--info-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--primary)', fontSize: '0.875rem' }}>
                  {user?.name?.[0]?.toUpperCase()}
                </div>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link to="/login" className="btn-saas btn-saas-outline" style={{ border: 'none' }}>Sign In</Link>
              <Link to="/register" className="btn-saas btn-saas-primary" style={{ padding: '10px 24px' }}>Join Academy</Link>
            </div>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button className="mobile-toggle-saas lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu-saas lg:hidden">
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2rem' }}>
            <Link to="/sessions" onClick={close}>Sessions</Link>
            <Link to="/blog" onClick={close}>Journal</Link>
            <Link to="/shop" onClick={close}>Shop</Link>
            <div style={{ height: '1px', background: 'var(--border-light)' }}></div>
            {isLoggedIn ? (
              <>
                <Link to="/profile" onClick={close}>My Profile</Link>
                {(isStudent || isAdmin || isInstructor) && (
                  <Link to={isAdmin ? '/admin' : (isInstructor ? '/instructor' : '/student/dashboard')} onClick={close}>Open Portal</Link>
                )}
                <button className="btn-saas btn-saas-primary" onClick={handleLogout}>Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={close}>Sign In</Link>
                <Link to="/register" className="btn-saas btn-saas-primary" onClick={close}>Join Academy</Link>
              </>
            )}
          </nav>
        </div>
      )}

      <style>{`
        .navbar-saas {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 70px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          z-index: 1000;
          transition: all 0.3s ease;
          border-bottom: 1px solid transparent;
        }
        .navbar-saas.scrolled {
          height: 64px;
          background: white;
          border-bottom: 1px solid var(--border-light);
          box-shadow: var(--shadow-sm);
        }
        .nav-link-saas {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary);
          transition: color 0.2s;
        }
        .nav-link-saas:hover, .nav-link-saas.active {
          color: var(--primary);
        }
        .mobile-menu-saas {
          position: fixed;
          top: 70px;
          left: 0;
          width: 100%;
          background: white;
          border-bottom: 1px solid var(--border-light);
          box-shadow: var(--shadow-lg);
          z-index: 999;
        }
        .mobile-toggle-saas {
          font-size: 1.5rem;
          color: var(--navy);
        }
        @media (max-width: 1023px) {
          .desktop-nav-saas { display: none !important; }
        }
      `}</style>
    </header>
  );
}
