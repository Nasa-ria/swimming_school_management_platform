import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { showToast } from '../../components/Toast';

export default function StudentProfile() {
  const { studentId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const tab = searchParams.get('tab') === 'history' ? 'history' : 'profile';
  const setTab = (next) => setSearchParams(next === 'profile' ? {} : { tab: next });

  useEffect(() => {
    let active = true;
    setLoading(true);
    api.get(`/instructor/students/${studentId}`)
      .then(({ data }) => { if (active) setData(data); })
      .catch(() => showToast('Failed to load student profile', 'error'))
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [studentId]);

  if (loading) return <LoadingSpinner />;
  if (!data) return (
    <div style={{ textAlign: 'center', padding: '5rem 0' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1.5rem', opacity: 0.5 }}>🏊‍♂️</div>
      <h3 style={{ color: 'var(--navy)', fontWeight: 700, fontSize: '1.5rem' }}>Student not found</h3>
      <Link to="/instructor/students" className="btn-saas btn-saas-outline" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
        Back to Swimmer Roster
      </Link>
    </div>
  );

  const { student, stats, evaluations, history } = data;
  const skill = student.student_profile?.skill_level || 'beginner';

  return (
    <div>
      <Link to="/instructor/students" className="page-subtitle" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem', color: 'var(--primary)', fontWeight: 600 }}>
        ← Back to Swimmer Roster
      </Link>

      {/* Identity header */}
      <div className="card-saas" style={{ padding: '2rem', display: 'flex', gap: '1.75rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <div style={{
          width: '84px', height: '84px', borderRadius: '18px',
          background: 'var(--info-soft)', display: 'flex',
          justifyContent: 'center', alignItems: 'center',
          fontSize: '2rem', color: 'var(--primary)', fontWeight: 700,
          border: '1px solid var(--border-light)', flexShrink: 0
        }}>
          {student.avatar ? <img src={student.avatar} alt={student.name} style={{ borderRadius: '18px', width: '100%', height: '100%', objectFit: 'cover' }} /> : student.name[0]}
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <h1 className="page-title" style={{ marginBottom: '0.35rem' }}>{student.name}</h1>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.6rem' }}>{student.email}{student.phone ? ` · ${student.phone}` : ''}</div>
          <span className={`badge-saas ${skill === 'beginner' ? 'info' : skill === 'intermediate' ? 'warning' : 'success'}`}>
            {skill.toUpperCase()}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <Stat label="Sessions" value={stats.total_sessions} />
          <Stat label="Attendance" value={stats.attendance_rate != null ? `${stats.attendance_rate}%` : '—'} color="var(--success)" />
          <Stat label="Avg. Score" value={stats.average_score != null ? stats.average_score : '—'} color="var(--primary)" />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem', borderBottom: '1px solid var(--border-light)' }}>
        <TabButton active={tab === 'profile'} onClick={() => setTab('profile')}>Profile</TabButton>
        <TabButton active={tab === 'history'} onClick={() => setTab('history')}>History{history.length ? ` (${history.length})` : ''}</TabButton>
      </div>

      {tab === 'profile' ? (
        <ProfileTab student={student} evaluations={evaluations} />
      ) : (
        <HistoryTab history={history} evaluations={evaluations} />
      )}
    </div>
  );
}

function Stat({ label, value, color = 'var(--navy)' }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        padding: '0.75rem 0.25rem', marginRight: '1.75rem',
        fontSize: '0.9rem', fontWeight: 600,
        color: active ? 'var(--primary)' : 'var(--text-secondary)',
        borderBottom: active ? '2px solid var(--primary)' : '2px solid transparent',
        marginBottom: '-1px'
      }}
    >
      {children}
    </button>
  );
}

function ProfileTab({ student, evaluations }) {
  const p = student.student_profile || {};
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
      <div className="card-saas" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '1.25rem' }}>Swimmer Details</h3>
        <DetailRow label="Age" value={p.age ?? '—'} />
        <DetailRow label="Skill Level" value={p.skill_level || 'beginner'} />
        <DetailRow label="Emergency Contact" value={p.emergency_contact || '—'} />
        <DetailRow label="Medical Info" value={p.medical_info || 'None on file'} last />
      </div>
      <div className="card-saas" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '1.25rem' }}>Latest Feedback</h3>
        {evaluations.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No evaluations submitted yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {evaluations.slice(0, 3).map(e => (
              <div key={e._id} style={{ borderLeft: '3px solid var(--primary-light)', paddingLeft: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  <span>{e.session?.title || 'Session'}</span>
                  <span style={{ fontWeight: 700, color: 'var(--navy)' }}>Grade {e.grade}</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{e.feedback || 'No comments left.'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value, last }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: last ? 'none' : '1px solid var(--border-light)' }}>
      <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>{label}</span>
      <span style={{ color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'capitalize', textAlign: 'right', maxWidth: '60%' }}>{value}</span>
    </div>
  );
}

function HistoryTab({ history, evaluations }) {
  if (history.length === 0 && evaluations.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem', opacity: 0.5 }}>📅</div>
        <p style={{ color: 'var(--text-secondary)' }}>No session or evaluation history yet.</p>
      </div>
    );
  }

  const attendanceBadge = {
    present: 'success',
    absent: 'danger',
    pending: 'warning'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '1rem' }}>Session Attendance</h3>
        <div className="table-wrapper-saas">
          <table className="table-saas">
            <thead>
              <tr><th>Session</th><th>Date</th><th>Location</th><th>Attendance</th></tr>
            </thead>
            <tbody>
              {history.map(b => (
                <tr key={b._id}>
                  <td>{b.session.title}</td>
                  <td>{new Date(b.session.start_time).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td>{b.session.location || '—'}</td>
                  <td><span className={`badge-saas ${attendanceBadge[b.attendance] || 'info'}`}>{b.attendance}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '1rem' }}>Evaluations</h3>
        {evaluations.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No evaluations submitted yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {evaluations.map(e => (
              <div key={e._id} className="card-saas" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--navy)' }}>{e.session?.title || 'Session'}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{new Date(e.createdAt).toLocaleDateString()}</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                  <span className="badge-saas success">Grade {e.grade}</span>
                  {e.performance_score != null && <span className="badge-saas info">{e.performance_score}/100</span>}
                </div>
                {e.feedback && <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{e.feedback}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
