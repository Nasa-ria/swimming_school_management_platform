import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { showToast } from '../../components/Toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/dashboard');
        setStats(data);
      } catch (err) {
        showToast('Failed to load dashboard data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner />;

  const statCards = [
    { title: 'Total Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: '💰', color: 'var(--success)', bg: 'var(--success-soft)' },
    { title: 'Active Users', value: stats.total_users, icon: '👥', color: 'var(--primary)', bg: 'var(--info-soft)' },
    { title: 'Students', value: stats.total_students, icon: '🏊', color: 'var(--info)', bg: 'var(--info-soft)' },
    { title: 'Sessions', value: stats.total_sessions, icon: '📅', color: 'var(--warning)', bg: 'var(--warning-soft)' },
    { title: 'Bookings', value: stats.total_bookings, icon: '✅', color: 'var(--success)', bg: 'var(--success-soft)' },
    { title: 'Inventory', value: stats.total_products, icon: '🛍️', color: 'var(--primary)', bg: 'var(--info-soft)' },
    { title: 'Orders', value: stats.total_orders, icon: '📦', color: 'var(--navy)', bg: 'var(--border-light)' },
    { title: 'Articles', value: stats.total_posts, icon: '📝', color: 'var(--text-secondary)', bg: '#f8fafc' },
  ];

  return (
    <div>
      <header className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Welcome back. Here's a high-level overview of Alraad Swim School.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {statCards.map((stat, i) => (
          <div key={i} className="stat-card-v2">
            <div className="stat-icon-v2" style={{ backgroundColor: stat.bg, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content-v2">
              <div className="label">{stat.title}</div>
              <div className="value">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Recent Bookings */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy)' }}>Recent Bookings</h2>
            <Link to="/admin/sessions" style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary)' }}>View All</Link>
          </div>
          
          <div className="table-wrapper-saas">
            <table className="table-saas">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Session</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_bookings.map(b => (
                  <tr key={b.id}>
                    <td style={{ fontWeight: 600 }}>{b.student}</td>
                    <td>{b.session}</td>
                    <td>
                      <span className={`badge-saas ${b.status === 'confirmed' ? 'success' : 'warning'}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {stats.recent_bookings.length === 0 && (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', padding: '3rem' }}>
                      <div style={{ color: 'var(--text-muted)' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</div>
                        <div>No recent bookings found</div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Quick Management */}
        <section>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '1.25rem' }}>Quick Actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            {[
              { to: "/admin/sessions", icon: "📅", label: "Sessions" },
              { to: "/admin/orders", icon: "📦", label: "Orders" },
              { to: "/admin/assignments", icon: "🤝", label: "Assignments" },
              { to: "/admin/paid-sessions", icon: "💳", label: "Payments" },
              { to: "/admin/student-overview", icon: "📊", label: "Overview" },
              { to: "/admin/products", icon: "🛍️", label: "Shop" },
              { to: "/admin/users", icon: "👥", label: "Users" },
              { to: "/admin/blog", icon: "📝", label: "Blog" }
            ].map((item, idx) => (
              <Link 
                key={idx} 
                to={item.to} 
                className="card-saas" 
                style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', textAlign: 'center' }}
              >
                <div style={{ width: '40px', height: '40px', background: 'var(--info-soft)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                  {item.icon}
                </div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--navy)' }}>{item.label}</div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
