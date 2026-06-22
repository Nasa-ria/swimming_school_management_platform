import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminLinks = [
    { to: '/admin', label: 'Dashboard', icon: '📊' },
    { to: '/admin/sessions', label: 'Manage Sessions', icon: '📅' },
    { to: '/admin/orders', label: 'Customer Orders', icon: '📦' },
    { to: '/admin/assignments', label: 'Assign Students', icon: '🤝' },
    { to: '/admin/paid-sessions', label: 'Paid Sessions', icon: '💳' },
    { to: '/admin/student-overview', label: 'Student Progress', icon: '📈' },
    { to: '/admin/users', label: 'Manage Users', icon: '👥' },
    { to: '/admin/products', label: 'Manage Shop', icon: '🛍️' },
    { to: '/admin/blog', label: 'Manage Blog', icon: '📝' },
  ];

  const instructorLinks = [
    { to: '/instructor', label: 'Dashboard', icon: '📊' },
    { to: '/instructor/sessions', label: 'My Schedule', icon: '📅' },
    { to: '/instructor/students', label: 'My Students', icon: '🏊‍♂️' },
    { to: '/instructor/performance', label: 'Grading Hub', icon: '⭐' },
  ];

  const studentLinks = [
    { to: '/student/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/student/classes', label: 'My Classes', icon: '📅' },
    { to: '/student/progress', label: 'My Progress', icon: '📈' },
  ];

  let links = [];
  const userRole = user.role?.toLowerCase();
  
  if (userRole === 'admin') links = adminLinks;
  else if (userRole === 'instructor') links = instructorLinks;
  else if (userRole === 'student') links = studentLinks;

  if (links.length === 0) return null;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[40] lg:hidden transition-all duration-300"
          onClick={onClose}
        />
      )}

      <aside className={`sidebar-saas ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header-saas">
          <Link to="/" className="sidebar-logo-saas">
            Alraad<span>Swim</span>
          </Link>
          <button className="lg:hidden ml-auto text-white/60 hover:text-white" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <nav className="sidebar-nav-saas">
          {links.map((link) => (
            <Link 
              key={link.to}
              to={link.to} 
              className={`nav-item-saas ${location.pathname === link.to ? 'active' : ''}`}
              onClick={() => { if (window.innerWidth < 1024) onClose(); }}
            >
              <span className="nav-icon-saas">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer-saas">
          <div className="user-pill-saas">
            <div className="user-avatar-saas">
              {user.name[0]}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ color: 'white', fontSize: '0.8125rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{user.role}</div>
            </div>
          </div>
          <button 
            className="btn-saas btn-saas-outline" 
            style={{ width: '100%', marginTop: '1rem', background: 'rgba(255,255,255,0.05)', color: 'white', borderColor: 'rgba(255,255,255,0.1)', fontSize: '0.75rem' }}
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
