import { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { showToast } from '../components/Toast';

export default function InstructorDashboard() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [evaluation, setEvaluation] = useState({
    grade: 'A',
    performance_score: 85,
    feedback: ''
  });
  const [emailModal, setEmailModal] = useState({ show: false, student: null, subject: '', message: '' });

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const { data } = await api.get('/instructor/sessions');
      setSessions(data);
    } catch (err) {
      showToast('Failed to load your sessions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSessionClick = async (session) => {
    setSelectedSession(session);
    setLoadingStudents(true);
    try {
      const { data } = await api.get(`/instructor/sessions/${session._id}/students`);
      setStudents(data);
    } catch (err) {
      showToast('Failed to load students', 'error');
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleEvaluate = async (studentId) => {
    try {
      await api.post('/instructor/evaluate', {
        student_id: studentId,
        session_id: selectedSession._id,
        ...evaluation
      });
      showToast('Evaluation submitted', 'success');
      setEvaluation({ grade: 'A', performance_score: 85, feedback: '' });
    } catch (err) {
      showToast('Failed to submit evaluation', 'error');
    }
  };

  const handleLevelUpgrade = async (studentId, currentLevel) => {
    const levels = ['beginner', 'intermediate', 'advanced'];
    const currentIndex = levels.indexOf(currentLevel);
    if (currentIndex === levels.length - 1) {
      showToast('Student is already at the highest level', 'info');
      return;
    }
    const nextLevel = levels[currentIndex + 1];
    if (!window.confirm(`Upgrade student to ${nextLevel}?`)) return;

    try {
      await api.put(`/instructor/students/${studentId}/level`, { skill_level: nextLevel });
      showToast(`Student upgraded to ${nextLevel}`, 'success');
      handleSessionClick(selectedSession); // Refresh list
    } catch (err) {
      showToast('Failed to upgrade student', 'error');
    }
  };

  const handleSendEmail = async () => {
    try {
      await api.post('/instructor/email-student', {
        student_email: emailModal.student.email,
        subject: emailModal.subject,
        message: emailModal.message
      });
      showToast('Email sent successfully', 'success');
      setEmailModal({ show: false, student: null, subject: '', message: '' });
    } catch (err) {
      showToast('Failed to send email', 'error');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-wrapper container animate-fade-in">
      <h1 className="section-title">Instructor Dashboard</h1>
      <p className="section-subtitle">Manage your classes, grade students, and track performance</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        {/* Sessions List */}
        <div className="md:col-span-1">
          <h3 className="mb-4 font-bold">My Sessions</h3>
          <div className="flex flex-col gap-3">
            {sessions.map(s => (
              <div 
                key={s._id} 
                onClick={() => handleSessionClick(s)}
                className={`card p-4 cursor-pointer transition-all hover:translate-x-2 ${selectedSession?._id === s._id ? 'border-primary' : ''}`}
                style={{ borderLeft: selectedSession?._id === s._id ? '4px solid var(--primary)' : '1px solid var(--border)' }}
              >
                <div className="font-bold">{s.title}</div>
                <div className="text-sm text-muted">{new Date(s.start_time).toLocaleDateString()}</div>
              </div>
            ))}
            {sessions.length === 0 && <p className="text-muted">No sessions assigned to you yet.</p>}
          </div>
        </div>

        {/* Student List & Grading */}
        <div className="md:col-span-2">
          {selectedSession ? (
            <div className="card p-6">
              <h3 className="mb-4">Students in "{selectedSession.title}"</h3>
              {loadingStudents ? <LoadingSpinner /> : (
                <div className="flex flex-col gap-6">
                  {students.map(st => (
                    <div key={st._id} className="border-b pb-6 last:border-0">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="avatar-small">{st.name[0]}</div>
                          <div>
                            <div className="font-bold">{st.name}</div>
                            <div className="text-xs text-muted">{st.email}</div>
                            <div className="badge mt-1">{st.student_profile?.skill_level || 'beginner'}</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="btn btn-ghost btn-sm" onClick={() => setEmailModal({ ...emailModal, show: true, student: st })}>📧 Email</button>
                          <button className="btn btn-secondary btn-sm" onClick={() => handleLevelUpgrade(st._id, st.student_profile?.skill_level || 'beginner')}>⭐ Upgrade</button>
                        </div>
                      </div>

                      {/* Grading Form */}
                      <div className="bg-alt p-4 rounded-xl flex flex-wrap gap-4 items-end">
                        <div className="form-group mb-0 flex-1 min-w-[100px]">
                          <label className="text-xs">Grade</label>
                          <select 
                            className="form-input text-sm p-2" 
                            onChange={(e) => setEvaluation({...evaluation, grade: e.target.value})}
                          >
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                            <option value="F">F</option>
                          </select>
                        </div>
                        <div className="form-group mb-0 flex-1 min-w-[100px]">
                          <label className="text-xs">Score (0-100)</label>
                          <input 
                            type="number" 
                            className="form-input text-sm p-2" 
                            value={evaluation.performance_score}
                            onChange={(e) => setEvaluation({...evaluation, performance_score: e.target.value})}
                          />
                        </div>
                        <div className="form-group mb-0 flex-[2] min-w-[200px]">
                          <label className="text-xs">Feedback</label>
                          <input 
                            className="form-input text-sm p-2" 
                            placeholder="Add comment..."
                            value={evaluation.feedback}
                            onChange={(e) => setEvaluation({...evaluation, feedback: e.target.value})}
                          />
                        </div>
                        <button className="btn btn-primary btn-sm" onClick={() => handleEvaluate(st._id)}>Submit Grade</button>
                      </div>
                    </div>
                  ))}
                  {students.length === 0 && <p className="text-muted text-center py-8">No students enrolled in this session.</p>}
                </div>
              )}
            </div>
          ) : (
            <div className="card p-12 text-center text-muted">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏊‍♂️</div>
              Select a session from the list to view and grade students.
            </div>
          )}
        </div>
      </div>

      {/* Email Modal */}
      {emailModal.show && (
        <div className="modal-overlay">
          <div className="card p-8 w-full max-w-md">
            <h3>Email Student: {emailModal.student.name}</h3>
            <div className="form-group mt-4">
              <label>Subject</label>
              <input 
                className="form-input" 
                value={emailModal.subject}
                onChange={(e) => setEmailModal({...emailModal, subject: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea 
                className="form-input min-h-[150px]" 
                value={emailModal.message}
                onChange={(e) => setEmailModal({...emailModal, message: e.target.value})}
              ></textarea>
            </div>
            <div className="flex gap-3 justify-end mt-4">
              <button className="btn btn-ghost" onClick={() => setEmailModal({...emailModal, show: false})}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSendEmail}>Send Email</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
