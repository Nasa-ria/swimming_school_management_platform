import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { showToast } from '../../components/Toast';

export default function ManageSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'group',
    description: '',
    capacity: 10,
    start_time: '',
    end_time: '',
    price: 0,
    location: '',
    level: 'all',
    status: 'available'
  });

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const { data } = await api.get('/sessions');
      setSessions(data);
    } catch (err) {
      showToast('Failed to load sessions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (session) => {
    setEditingSession(session);
    const start = new Date(session.start_time).toISOString().slice(0, 16);
    const end = new Date(session.end_time).toISOString().slice(0, 16);
    setFormData({
      ...session,
      start_time: start,
      end_time: end
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this session?')) return;
    try {
      await api.delete(`/sessions/${id}`);
      showToast('Session deleted', 'success');
      fetchSessions();
    } catch (err) {
      showToast('Failed to delete session', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSession) {
        await api.put(`/sessions/${editingSession.id}`, formData);
        showToast('Session updated', 'success');
      } else {
        await api.post('/sessions', formData);
        showToast('Session created', 'success');
      }
      setIsModalOpen(false);
      fetchSessions();
    } catch (err) {
      showToast('Action failed', 'error');
    }
  };

  const resetForm = () => {
    setEditingSession(null);
    setFormData({
      title: '',
      type: 'group',
      description: '',
      capacity: 10,
      start_time: '',
      end_time: '',
      price: 0,
      location: '',
      level: 'all',
      status: 'available'
    });
    setIsModalOpen(true);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="page-title">Manage Sessions</h1>
          <p className="page-subtitle">Configure and schedule swimming classes for your students.</p>
        </div>
        <button className="btn-saas btn-saas-primary" onClick={resetForm}>
          <span>+</span> New Session
        </button>
      </header>

      <section className="table-wrapper-saas">
        <table className="table-saas">
          <thead>
            <tr>
              <th>Title</th>
              <th>Level</th>
              <th>Schedule</th>
              <th>Capacity</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map(s => (
              <tr key={s.id}>
                <td style={{ fontWeight: 700, color: 'var(--navy)' }}>{s.title}</td>
                <td>
                  <span className="badge-saas info">
                    {s.level.toUpperCase()}
                  </span>
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{new Date(s.start_time).toLocaleDateString()}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {new Date(s.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700 }}>{s.enrolled}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>/ {s.capacity}</span>
                  </div>
                </td>
                <td>
                  <span className={`badge-saas ${s.status === 'available' ? 'success' : 'warning'}`}>
                    {s.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button className="btn-saas btn-saas-outline" style={{ padding: '4px 12px', fontSize: '0.75rem' }} onClick={() => handleEdit(s)}>Edit</button>
                    <button className="btn-saas btn-saas-outline" style={{ padding: '4px 12px', fontSize: '0.75rem', color: 'var(--danger)', borderColor: 'var(--danger-soft)' }} onClick={() => handleDelete(s.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* SaaS Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1.5rem' }}>
          <div className="card-saas animate-fade-up" style={{ width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', padding: '2.5rem', border: 'none', boxShadow: 'var(--shadow-xl)' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy)' }}>{editingSession ? 'Edit Session' : 'Create New Session'}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Fill in the details below to schedule a new swimming class.</p>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="form-label-saas">Session Title</label>
                <input type="text" className="input-saas" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Morning Freestyle Mastery" required />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div>
                  <label className="form-label-saas">Type</label>
                  <select className="input-saas" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option value="group">Group Session</option>
                    <option value="private">Private Coaching</option>
                  </select>
                </div>
                <div>
                  <label className="form-label-saas">Skill Level</label>
                  <select className="input-saas" value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})}>
                    <option value="all">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div>
                  <label className="form-label-saas">Price ($)</label>
                  <input type="number" className="input-saas" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                </div>
                <div>
                  <label className="form-label-saas">Max Capacity</label>
                  <input type="number" className="input-saas" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div>
                  <label className="form-label-saas">Start Time</label>
                  <input type="datetime-local" className="input-saas" value={formData.start_time} onChange={e => setFormData({...formData, start_time: e.target.value})} required />
                </div>
                <div>
                  <label className="form-label-saas">End Time</label>
                  <input type="datetime-local" className="input-saas" value={formData.end_time} onChange={e => setFormData({...formData, end_time: e.target.value})} required />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label className="form-label-saas">Pool Location</label>
                <input type="text" className="input-saas" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. Olympic North Pool" required />
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label className="form-label-saas">Notes / Description</label>
                <textarea className="input-saas" style={{ minHeight: '80px' }} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe the session goals..." />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-saas btn-saas-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-saas btn-saas-primary">
                  {editingSession ? 'Update Session' : 'Create Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
