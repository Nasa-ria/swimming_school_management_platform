import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { showToast } from '../../components/Toast';

export default function StudentOverview() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const { data } = await api.get('/admin/student-overview');
        setStudents(data);
      } catch (err) {
        showToast('Failed to load overview', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <header className="page-header" style={{ marginBottom: '2.5rem' }}>
        <h1 className="page-title">Student Insights & Analytics</h1>
        <p className="page-subtitle">Track comprehensive performance metrics, attendance trends, and financial standing across the academy.</p>
      </header>

      {/* Aggregate Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="card-saas" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, var(--navy), var(--primary-dark))', color: 'white' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, opacity: 0.9, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Total Active Students</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{students.length}</div>
        </div>
        <div className="card-saas" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Avg. Attendance</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--success)' }}>
            {students.length ? Math.round(students.reduce((acc, s) => acc + parseInt(s.attendance_rate || 0), 0) / students.length) : 0}%
          </div>
        </div>
        <div className="card-saas" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Avg. Sessions Completed</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>
            {students.length ? Math.round(students.reduce((acc, s) => acc + (s.sessions_completed || 0), 0) / students.length) : 0}
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '1.5rem' }}>Individual Swimmer Analytics</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {students.map(student => (
          <div key={student.id} className="card-saas animate-fade-up" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'center' }}>
            
            {/* Identity Column */}
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--info-soft)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 800 }}>
                {student.name[0]}
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '0.25rem' }}>{student.name}</h3>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Enrolled: {new Date(student.joined_date).toLocaleDateString()}</div>
                <span className={`badge-saas ${student.level === 'beginner' ? 'info' : (student.level === 'intermediate' ? 'warning' : 'success')}`} style={{ fontSize: '0.7rem' }}>
                  {student.level.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Metrics Column */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Attendance Rate</span>
                <span style={{ fontWeight: 800, color: parseInt(student.attendance_rate) >= 80 ? 'var(--success)' : 'var(--warning)' }}>{student.attendance_rate}</span>
              </div>
              <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                <div style={{ height: '100%', width: student.attendance_rate || '0%', background: parseInt(student.attendance_rate) >= 80 ? 'var(--success)' : 'var(--warning)', borderRadius: '4px' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Session Progress</span>
                <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{student.sessions_completed} / {student.sessions_completed + student.sessions_remaining}</span>
              </div>
              <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(student.sessions_completed / Math.max(1, (student.sessions_completed + student.sessions_remaining))) * 100}%`, background: 'var(--primary)', borderRadius: '4px' }} />
              </div>
            </div>

            {/* Financials & Status */}
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Lead Instructor</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--navy)' }}>{student.instructor}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Payment Status</span>
                <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: 'var(--success-soft)', color: 'var(--success)', fontWeight: 800 }}>UP TO DATE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Performance Grade</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--primary-dark)' }}>{student.grade || 'N/A'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
