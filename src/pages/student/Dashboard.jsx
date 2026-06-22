import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { showToast } from '../../components/Toast';

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/student/dashboard');
        setData(data);
      } catch (err) {
        showToast('Failed to load dashboard', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!data) return <div className="container py-20 text-center"><h3>Dashboard data not available. Please restart your server.</h3></div>;

  const getLevelBadgeClass = (level) => {
    const l = level.toLowerCase();
    if (l.includes('beginner')) return 'info';
    if (l.includes('intermediate')) return 'warning';
    return 'success';
  };

  const progressPercent = (data.lessons_completed / data.total_lessons) * 100;

  return (
    <div>
      <header className="page-header">
        <h1 className="page-title">Swimmer Hub</h1>
        <p className="page-subtitle">Welcome back, {data.student_name.split(' ')[0]}. Here's your training progress at a glance.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {/* Level Card */}
        <div className="stat-card-v2">
          <div className="stat-icon-v2" style={{ backgroundColor: 'var(--info-soft)', color: 'var(--info)' }}>🏊</div>
          <div className="stat-content-v2">
            <div className="label">Skill Level</div>
            <div className={`badge-saas ${getLevelBadgeClass(data.student_level)}`} style={{ marginTop: '4px' }}>
              {data.student_level}
            </div>
          </div>
        </div>

        {/* Lessons Progress Card */}
        <div className="stat-card-v2" style={{ flexGrow: 1.5 }}>
          <div className="stat-icon-v2" style={{ backgroundColor: 'var(--success-soft)', color: 'var(--success)' }}>🎯</div>
          <div className="stat-content-v2" style={{ flex: 1 }}>
            <div className="label">Lesson Progress</div>
            <div className="value" style={{ marginBottom: '8px' }}>
              {data.lessons_completed}<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/{data.total_lessons}</span>
            </div>
            <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--success)', transition: 'width 1s ease-out' }}></div>
            </div>
          </div>
        </div>

        {/* Remaining Card */}
        <div className="stat-card-v2">
          <div className="stat-icon-v2" style={{ backgroundColor: 'var(--warning-soft)', color: 'var(--warning)' }}>⏳</div>
          <div className="stat-content-v2">
            <div className="label">Days Left</div>
            <div className="value">{data.days_remaining}</div>
          </div>
        </div>

        {/* Next Session Card */}
        <div className="stat-card-v2">
          <div className="stat-icon-v2" style={{ backgroundColor: 'var(--info-soft)', color: 'var(--primary)' }}>📅</div>
          <div className="stat-content-v2">
            <div className="label">Next Session</div>
            {data.next_class ? (
              <div style={{ fontWeight: 800, color: 'var(--navy)', fontSize: '1rem' }}>
                {new Date(data.next_class.start_time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </div>
            ) : (
              <div style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Not Scheduled</div>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Latest Feedback */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy)' }}>Coach's Insights</h2>
            <Link to="/student/progress" style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary)' }}>Full Report</Link>
          </div>
          
          <div className="card-saas" style={{ padding: '2rem' }}>
            {data.latest_feedback ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--info-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>💬</div>
                  <div>
                    <div style={{ fontWeight: 800, color: 'var(--navy)', fontSize: '0.95rem' }}>Coach {data.latest_feedback.instructor}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Received on {new Date(data.latest_feedback.date).toLocaleDateString()}</div>
                  </div>
                </div>
                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '14px', borderLeft: '4px solid var(--primary)', fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: '1.7' }}>
                  "{data.latest_feedback.message}"
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                <h3 style={{ fontWeight: 800, color: 'var(--navy)' }}>Waiting for feedback</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Once you complete your next lesson, your coach's insights will appear here.</p>
              </div>
            )}
          </div>
        </section>

        {/* Quick Resources */}
        <section>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '1.25rem' }}>Resources</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            {[
              { to: "/student/classes", icon: "📅", label: "My Classes" },
              { to: "/student/progress", icon: "📈", label: "Progress" },
              { to: "/sessions", icon: "🏊‍♂️", label: "Book Lesson" },
              { to: "/profile", icon: "👤", label: "My Profile" }
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
