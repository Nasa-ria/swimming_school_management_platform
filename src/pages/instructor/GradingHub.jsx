import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { showToast } from '../../components/Toast';

export default function GradingHub() {
  const [students, setStudents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [evaluation, setEvaluation] = useState({
    student_id: '',
    session_id: '',
    grade: 'B',
    performance_score: 70,
    feedback: ''
  });

  useEffect(() => {
    Promise.all([
      api.get('/instructor/my-students'),
      api.get('/instructor/sessions')
    ]).then(([{ data: studentData }, { data: sessionData }]) => {
      setStudents(studentData);
      setSessions(sessionData.filter(s => s.assignment_status === 'accepted'));
      setLoading(false);
    }).catch(() => {
      showToast('Failed to load instructor data', 'error');
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!evaluation.student_id || !evaluation.session_id) {
      return showToast('Please select both a student and a session', 'warning');
    }
    
    setSubmitting(true);
    try {
      await api.post('/instructor/evaluate', evaluation);
      showToast('Evaluation submitted successfully!', 'success');
      setEvaluation({ ...evaluation, feedback: '', performance_score: 70 });
    } catch (err) {
      showToast('Failed to submit evaluation', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="portal-container" style={{ paddingBottom: '5rem' }}>
      <header className="page-header">
        <h1 className="page-title">Performance Grading Hub</h1>
        <p className="page-subtitle">Evaluate student progress and provide professional technical feedback.</p>
      </header>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Grading Form */}
        <section className="card-saas" style={{ padding: '3rem' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
              <div>
                <label className="form-label-saas">Target Student</label>
                <select 
                  className="input-saas" 
                  value={evaluation.student_id}
                  onChange={(e) => setEvaluation({...evaluation, student_id: e.target.value})}
                  required
                >
                  <option value="">Search and select a student...</option>
                  {students.map(s => (
                    <option key={s._id} value={s._id}>{s.name} ({s.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label-saas">Target Session</label>
                <select 
                  className="input-saas" 
                  value={evaluation.session_id}
                  onChange={(e) => setEvaluation({...evaluation, session_id: e.target.value})}
                  required
                >
                  <option value="">Select a session to evaluate...</option>
                  {sessions.map(s => (
                    <option key={s._id} value={s._id}>{s.title} ({new Date(s.start_time).toLocaleDateString()})</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
              <div>
                <label className="form-label-saas">Overall Grade</label>
                <select 
                  className="input-saas"
                  value={evaluation.grade}
                  onChange={(e) => setEvaluation({...evaluation, grade: e.target.value})}
                >
                  <option value="A+">A+ (Exceptional)</option>
                  <option value="A">A (Mastery)</option>
                  <option value="B+">B+ (Advanced)</option>
                  <option value="B">B (Proficient)</option>
                  <option value="C">C (Developing)</option>
                </select>
              </div>
              <div>
                <label className="form-label-saas">Performance Score ({evaluation.performance_score}%)</label>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={evaluation.performance_score}
                  onChange={(e) => setEvaluation({...evaluation, performance_score: parseInt(e.target.value)})}
                  style={{ width: '100%', marginTop: '12px' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
              <label className="form-label-saas">Technical Feedback</label>
              <textarea 
                className="input-saas" 
                placeholder="Detail the student's strengths and areas for improvement..."
                style={{ minHeight: '150px' }}
                value={evaluation.feedback}
                onChange={(e) => setEvaluation({...evaluation, feedback: e.target.value})}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn-saas btn-saas-primary" 
              style={{ width: '100%', padding: '16px', fontSize: '1rem' }}
              disabled={submitting || !evaluation.student_id}
            >
              {submitting ? 'Submitting Evaluation...' : 'Publish Performance Review'}
            </button>
            {!evaluation.student_id && (
              <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--danger)', fontSize: '0.75rem', fontWeight: 700 }}>
                * Select a student and a session to publish the review
              </p>
            )}
          </form>
        </section>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
