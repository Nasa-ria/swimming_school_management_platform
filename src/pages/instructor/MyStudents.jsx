import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { showToast } from '../../components/Toast';

export default function MyStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data } = await api.get('/instructor/sessions');
      const sessionIds = data.map(s => s._id);
      
      const allStudents = [];
      const studentIds = new Set();

      for (const sid of sessionIds) {
        const { data: sessionStudents } = await api.get(`/instructor/sessions/${sid}/students`);
        sessionStudents.forEach(st => {
          if (!studentIds.has(st._id)) {
            studentIds.add(st._id);
            allStudents.push({ ...st, enrollment_date: st.createdAt });
          }
        });
      }
      setStudents(allStudents);
    } catch (err) {
      showToast('Failed to load students', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="page-title">Swimmer Roster</h1>
          <p className="page-subtitle">Track individual progress, attendance, and skill levels for your assigned students.</p>
        </div>
        <div style={{ position: 'relative', width: '320px' }}>
          <input 
            type="text" 
            className="input-saas" 
            placeholder="Search swimmers..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '40px', borderRadius: '12px' }}
          />
          <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {filteredStudents.map(s => (
          <div key={s._id} className="card-saas animate-fade-up" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
              <div style={{ 
                width: '60px', height: '60px', borderRadius: '14px', 
                background: 'var(--info-soft)', display: 'flex', 
                justifyContent: 'center', alignItems: 'center',
                fontSize: '1.5rem', color: 'var(--primary)', fontWeight: 800,
                border: '1px solid var(--border-light)', flexShrink: 0
              }}>
                {s.avatar ? <img src={s.avatar} alt={s.name} style={{ borderRadius: '14px', width: '100%', height: '100%', objectFit: 'cover' }} /> : s.name[0]}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</h3>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 500 }}>{s.email}</div>
                <span className="badge-saas info" style={{ fontSize: '0.65rem' }}>
                  {s.student_profile?.skill_level || 'BEGINNER'}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
              <div style={{ background: '#f8fafc', padding: '0.875rem', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--navy)' }}>12</div>
                <div style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Lessons</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.875rem', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--success)' }}>95%</div>
                <div style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Attendance</div>
              </div>
            </div>

            <div style={{ fontSize: '0.875rem', background: 'white', borderRadius: '12px', padding: '1rem', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Enrolled Since</span>
                <span style={{ fontWeight: 700, color: 'var(--navy)' }}>{new Date(s.enrollment_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn-saas btn-saas-outline" style={{ flex: 1, fontSize: '0.75rem', justifyContent: 'center' }}>View Profile</button>
              <button className="btn-saas btn-saas-outline" style={{ flex: 1, fontSize: '0.75rem', justifyContent: 'center' }}>History</button>
            </div>
          </div>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1.5rem', opacity: 0.5 }}>🏊‍♂️</div>
          <h3 style={{ color: 'var(--navy)', fontWeight: 800, fontSize: '1.5rem' }}>No swimmers found</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your search or wait for admin assignments.</p>
        </div>
      )}
    </div>
  );
}
