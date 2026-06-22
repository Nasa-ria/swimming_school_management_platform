import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { showToast } from '../../components/Toast';
import { Link } from 'react-router-dom';

export default function MyClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const { data } = await api.get('/student/classes');
        setClasses(data);
      } catch (err) {
        showToast('Failed to load classes', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!classes) return <div className="container py-20 text-center"><h3>Failed to load class data.</h3><p>Please try refreshing the page.</p></div>;

  const upcoming = classes.filter(c => c.status === 'Upcoming');
  const past = classes.filter(c => c.status === 'Past');

  return (
    <div>
      <header className="page-header">
        <h1 className="page-title">Lesson Timetable</h1>
        <p className="page-subtitle">View your confirmed swimming schedule and track your training history.</p>
      </header>

      {/* Upcoming Sessions */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy)' }}>Upcoming Sessions</h2>
          {upcoming.length > 0 && (
            <span className="badge-saas success" style={{ fontSize: '0.7rem' }}>{upcoming.length} Confirmed</span>
          )}
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {upcoming.map(c => (
            <div key={c.id} className="card-saas animate-fade-up" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ width: '40px', height: '40px', background: 'var(--info-soft)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>🏊‍♂️</div>
                <span className="badge-saas info">Upcoming</span>
              </div>
              
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '0.25rem' }}>{c.title}</h4>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 500 }}>📍 {c.location}</div>
              </div>

              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-light)', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Date</span>
                  <span style={{ fontWeight: 700, color: 'var(--navy)' }}>{new Date(c.start_time).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Time</span>
                  <span style={{ fontWeight: 700, color: 'var(--navy)' }}>
                    {new Date(c.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Coach</span>
                  <span style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>{c.instructor}</span>
                </div>
              </div>

              <button className="btn-saas btn-saas-outline" style={{ width: '100%', justifyContent: 'center' }}>
                View Details
              </button>
            </div>
          ))}
          
          {upcoming.length === 0 && (
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ padding: '3rem', border: '2px dashed var(--border-light)', borderRadius: '14px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <p style={{ fontWeight: 600, marginBottom: '1.25rem' }}>No upcoming sessions scheduled.</p>
                <Link to="/sessions" className="btn-saas btn-saas-primary">Book Next Lesson</Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* History Table */}
      <section>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '1.5rem' }}>Training History</h2>
        <div className="table-wrapper-saas">
          <table className="table-saas">
            <thead>
              <tr>
                <th>Session</th>
                <th>Completion Date</th>
                <th>Assigned Coach</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {past.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 700, color: 'var(--navy)' }}>{c.title}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{new Date(c.start_time).toLocaleDateString()}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Session Completed</div>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--primary-dark)' }}>Coach {c.instructor}</td>
                  <td>
                    <span className="badge-saas info" style={{ backgroundColor: '#f1f5f9', color: '#64748b' }}>
                      {c.attendance || 'ATTENDED'}
                    </span>
                  </td>
                </tr>
              ))}
              {past.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '5rem' }}>
                    <div style={{ color: 'var(--text-muted)' }}>
                      <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🌊</div>
                      <h3 style={{ fontWeight: 800, color: 'var(--navy)' }}>Your journey starts here</h3>
                      <p>Complete your first lesson to see your history grow!</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
