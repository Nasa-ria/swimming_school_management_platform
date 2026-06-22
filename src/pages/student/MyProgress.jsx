import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { showToast } from '../../components/Toast';

export default function MyProgress() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/student/progress');
        setData(data);
      } catch (err) {
        showToast('Failed to load progress data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!data) return <div className="container py-20 text-center"><h3>Failed to load progress data.</h3><p>Please try refreshing the page.</p></div>;

  const getScoreColor = (score) => {
    if (score >= 4.5) return 'var(--success)';
    if (score >= 3.5) return 'var(--primary)';
    if (score >= 2.5) return 'var(--warning)';
    return 'var(--danger)';
  };

  const getLevelInfo = (avgScore) => {
    if (avgScore >= 4.5) return { name: 'Advanced', color: 'var(--success)', icon: '🏆' };
    if (avgScore >= 3.0) return { name: 'Intermediate', color: 'var(--warning)', icon: '🥇' };
    return { name: 'Beginner', color: 'var(--primary)', icon: '🥈' };
  };

  const avgSkillScore = data.skillProgress.reduce((sum, s) => sum + s.rating, 0) / data.skillProgress.length;
  const levelInfo = getLevelInfo(avgSkillScore);

  return (
    <div>
      <header className="page-header">
        <h1 className="page-title">Performance Hub</h1>
        <p className="page-subtitle">Analyze your aquatic skill development and training milestones.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2rem', marginBottom: '3.5rem', alignItems: 'start' }}>
        {/* Skill Performance List */}
        <section className="card-saas" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '2.5rem' }}>Skill Proficiency</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {data.skillProgress.map(skill => (
              <div key={skill.area}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--navy)' }}>{skill.area}</span>
                  <span className="badge-saas info" style={{ fontWeight: 800, color: getScoreColor(skill.rating) }}>
                    {skill.rating.toFixed(1)} / 5.0
                  </span>
                </div>
                <div style={{ height: '10px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                  <div style={{
                    height: '100%',
                    width: `${(skill.rating / 5) * 100}%`,
                    backgroundColor: getScoreColor(skill.rating),
                    borderRadius: '10px',
                    transition: 'width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Achievement Summary Card */}
        <section className="card-saas" style={{ padding: '2.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ 
            width: '100px', 
            height: '100px', 
            background: 'var(--bg-page)', 
            borderRadius: '24px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            border: '1px solid var(--border-light)',
            marginBottom: '1.5rem'
          }}>
            <span style={{ fontSize: '3rem' }}>{levelInfo.icon}</span>
          </div>
          
          <span className="badge-saas info" style={{ marginBottom: '1rem', padding: '6px 16px' }}>
            {levelInfo.name.toUpperCase()} STATUS
          </span>

          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '0.75rem' }}>Great Work!</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem' }}>
            Your overall mastery score is <strong>{avgSkillScore.toFixed(1)}</strong>. You're consistently improving in your {data.skillProgress[0]?.area.toLowerCase() || 'swimming'} techniques!
          </p>
          
          <div style={{ width: '100%', padding: '1.25rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid var(--border-light)', marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Recommendation</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--navy)' }}>Focus on breathing rhythm in your next private session.</div>
          </div>
          
          <button className="btn-saas btn-saas-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Keep Training
          </button>
        </section>
      </div>

      {/* Evaluation Table */}
      <section>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '1.5rem' }}>Detailed Evaluation History</h2>
        <div className="table-wrapper-saas">
          <table className="table-saas">
            <thead>
              <tr>
                <th>Session Date</th>
                <th>Focus Area</th>
                <th>Grade</th>
                <th>Instructor Note</th>
              </tr>
            </thead>
            <tbody>
              {data.evaluations.map(e => (
                <tr key={e.id}>
                  <td>
                    <div style={{ fontWeight: 800, color: 'var(--navy)' }}>{new Date(e.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{e.skill || 'General Technique'}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className="badge-saas success" style={{ fontWeight: 800 }}>{e.grade}</span>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 700 }}>({e.score}%)</span>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6', maxWidth: '400px' }}>
                    {e.feedback}
                  </td>
                </tr>
              ))}
              {data.evaluations.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '5rem' }}>
                    <div style={{ color: 'var(--text-muted)' }}>
                      <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📈</div>
                      <h3 style={{ fontWeight: 800, color: 'var(--navy)' }}>No evaluations yet</h3>
                      <p>Attend your first lesson to receive detailed feedback from your coach.</p>
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
