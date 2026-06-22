import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { showToast } from '../../components/Toast';
import { useAuth } from '../../context/AuthContext';

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/instructor/dashboard');
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
    { title: 'My Students', value: stats.total_students, icon: '👥', color: 'var(--primary)', bg: 'var(--info-soft)' },
    { title: 'Today\'s Schedule', value: stats.upcoming_today, icon: '📅', color: 'var(--warning)', bg: 'var(--warning-soft)' },
    { title: 'New Requests', value: stats.pending_assignments, icon: '📩', color: 'var(--danger)', bg: 'var(--danger-soft)' },
    { title: 'Reports Sent', value: stats.recent_feedback_count, icon: '⭐', color: 'var(--success)', bg: 'var(--success-soft)' },
  ];

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div>
      <header className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-title">Coach's Dashboard</h1>
            <p className="page-subtitle">Welcome back, {user.name.split(' ')[0]}. Here's your agenda for {todayStr}.</p>
          </div>
          {stats.upcoming_today > 0 && (
            <div className="badge-saas info" style={{ padding: '8px 16px', borderRadius: '12px' }}>
              {stats.upcoming_today} Sessions Today
            </div>
          )}
        </div>
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
        {/* Recent Evaluations */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy)' }}>Recent Performance</h2>
            <Link to="/instructor/performance" style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary)' }}>Grading Hub</Link>
          </div>
          
          <div className="table-wrapper-saas">
            <table className="table-saas">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Skill Rating</th>
                  <th>Evaluation Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_evaluations.map(e => (
                  <tr key={e.id}>
                    <td style={{ fontWeight: 700, color: 'var(--navy)' }}>{e.student}</td>
                    <td>
                      <span className="badge-saas success" style={{ fontWeight: 800 }}>
                        ★ {e.grade}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>{new Date(e.date).toLocaleDateString()}</td>
                  </tr>
                ))}
                {stats.recent_evaluations.length === 0 && (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', padding: '4rem' }}>
                      <div style={{ color: 'var(--text-muted)' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏆</div>
                        <h3 style={{ fontWeight: 800, color: 'var(--navy)' }}>No recent grading</h3>
                        <p>Complete your first evaluation in the Grading Hub to see results here.</p>
                        <Link to="/instructor/performance" className="btn-saas btn-saas-primary" style={{ marginTop: '1.5rem' }}>Open Grading Hub</Link>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Coach Tools */}
        <section>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '1.25rem' }}>Coach Toolkit</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            {[
              { to: "/instructor/sessions", icon: "📅", label: "Schedule" },
              { to: "/instructor/students", icon: "🏊‍♂️", label: "My Swimmers" },
              { to: "/instructor/performance", icon: "⭐", label: "Grading Hub" },
              { to: "/profile", icon: "👤", label: "My Settings" }
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
