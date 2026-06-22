import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { showToast } from '../../components/Toast';

export default function InstructorSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionNote, setActionNote] = useState('');
  const [activeSession, setActiveSession] = useState(null);

  // Edit State
  const [editingSession, setEditingSession] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    start_time: '',
    location: '',
    description: ''
  });

  // Attendance State
  const [attendanceSession, setAttendanceSession] = useState(null);
  const [roster, setRoster] = useState([]);
  const [rosterLoading, setRosterLoading] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const { data } = await api.get('/instructor/sessions');
      setSessions(data);
    } catch (err) {
      showToast('Failed to load sessions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (sessionId, status) => {
    try {
      await api.put(`/instructor/sessions/${sessionId}/status`, { status, note: actionNote });
      showToast(`Session ${status} successfully`, 'success');
      setActionNote('');
      setActiveSession(null);
      fetchSessions();
    } catch (err) {
      showToast('Failed to update session status', 'error');
    }
  };

  const startEditing = (session) => {
    setEditingSession(session._id);
    setEditForm({
      title: session.title,
      start_time: new Date(session.start_time).toISOString().slice(0, 16),
      location: session.location,
      description: session.description || ''
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/instructor/sessions/${editingSession}`, editForm);
      showToast('Session updated successfully', 'success');
      setEditingSession(null);
      fetchSessions();
    } catch (err) {
      showToast('Failed to update session', 'error');
    }
  };

  const openAttendance = async (session) => {
    setAttendanceSession(session._id);
    setRosterLoading(true);
    try {
      const { data } = await api.get(`/instructor/sessions/${session._id}/bookings`);
      setRoster(data);
    } catch (err) {
      showToast('Failed to load roster', 'error');
    } finally {
      setRosterLoading(false);
    }
  };

  const markAttendance = async (bookingId, status) => {
    try {
      await api.put(`/instructor/bookings/${bookingId}/attendance`, { attendance: status });
      // Update local state to reflect change immediately
      setRoster(roster.map(b => b._id === bookingId ? { ...b, attendance: status } : b));
      showToast(`Marked as ${status}`, 'success');
    } catch (err) {
      showToast('Failed to mark attendance', 'error');
    }
  };

  if (loading) return <LoadingSpinner />;

  const pendingSessions = sessions.filter(s => s.assignment_status === 'pending');
  const confirmedSessions = sessions.filter(s => s.assignment_status === 'accepted');

  return (
    <div className="portal-container" style={{ paddingBottom: '5rem' }}>
      <header className="page-header">
        <h1 className="page-title">Coaching Schedule</h1>
        <p className="page-subtitle">Manage your session assignments and maintain your class timetable.</p>
      </header>

      {/* Pending Requests Section */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy)' }}>Pending Requests</h2>
          {pendingSessions.length > 0 && (
            <span className="badge-saas warning" style={{ fontSize: '0.7rem' }}>{pendingSessions.length} Action Required</span>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {pendingSessions.map(s => (
            <div key={s._id} className="card-saas animate-fade-up" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', borderLeft: '4px solid var(--warning)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ width: '40px', height: '40px', background: 'var(--warning-soft)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>📩</div>
                <span className="badge-saas info" style={{ fontSize: '0.65rem' }}>{s.level.toUpperCase()}</span>
              </div>

              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '0.25rem' }}>{s.title}</h4>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 500 }}>📍 {s.location}</div>
              </div>

              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-light)', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Date</span>
                  <span style={{ fontWeight: 700, color: 'var(--navy)' }}>{new Date(s.start_time).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Time Window</span>
                  <span style={{ fontWeight: 700, color: 'var(--navy)' }}>
                    {new Date(s.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {activeSession === s._id ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <textarea
                    className="input-saas"
                    placeholder="Add an optional note to the admin..."
                    value={actionNote}
                    onChange={(e) => setActionNote(e.target.value)}
                    style={{ fontSize: '0.8125rem', minHeight: '70px' }}
                  />
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="btn-saas btn-saas-primary" style={{ flex: 1 }} onClick={() => handleStatusUpdate(s._id, 'accepted')}>Accept</button>
                    <button className="btn-saas btn-saas-outline" style={{ flex: 1, color: 'var(--danger)', borderColor: 'var(--danger-soft)' }} onClick={() => handleStatusUpdate(s._id, 'declined')}>Decline</button>
                  </div>
                </div>
              ) : (
                <button className="btn-saas btn-saas-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setActiveSession(s._id)}>
                  Respond to Request
                </button>
              )}
            </div>
          ))}

          {pendingSessions.length === 0 && (
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ padding: '3rem', border: '2px dashed var(--border-light)', borderRadius: '14px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <p style={{ fontWeight: 600 }}>Your inbox is clear. No pending requests.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Confirmed Schedule Table */}
      <section>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '1.5rem' }}>Confirmed Timetable</h2>

        {editingSession && (
          <div className="card-saas animate-fade-in" style={{ marginBottom: '2rem', padding: '2rem', border: '2px solid var(--primary)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '1.5rem' }}>Edit Session Details</h3>
            <form onSubmit={handleEditSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label className="form-label-saas">Session Title</label>
                <input type="text" className="input-saas" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} required />
              </div>
              <div>
                <label className="form-label-saas">Start Time</label>
                <input type="datetime-local" className="input-saas" value={editForm.start_time} onChange={(e) => setEditForm({ ...editForm, start_time: e.target.value })} required />
              </div>
              <div>
                <label className="form-label-saas">Location</label>
                <input type="text" className="input-saas" value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} required />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label className="form-label-saas">Notes / Description</label>
                <textarea className="input-saas" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} style={{ minHeight: '80px' }} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', gridColumn: '1 / -1' }}>
                <button type="submit" className="btn-saas btn-saas-primary">Save Changes</button>
                <button type="button" className="btn-saas btn-saas-outline" onClick={() => setEditingSession(null)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {attendanceSession && (
          <div className="card-saas animate-fade-in" style={{ marginBottom: '2rem', padding: '2rem', border: '2px solid var(--success)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--navy)' }}>Session Roster & Attendance</h3>
              <button className="btn-saas btn-saas-outline" onClick={() => setAttendanceSession(null)} style={{ padding: '6px 12px', fontSize: '0.75rem' }}>Close</button>
            </div>
            
            {rosterLoading ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>Loading roster...</div>
            ) : roster.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No students are enrolled in this session yet.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {roster.map(booking => (
                  <div key={booking._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                        {booking.user?.name?.[0] || '?'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--navy)' }}>{booking.user?.name || 'Unknown Student'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{booking.user?.email}</div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className={`btn-saas ${booking.attendance === 'present' ? 'btn-saas-primary' : 'btn-saas-outline'}`}
                        style={{ padding: '6px 12px', fontSize: '0.75rem', background: booking.attendance === 'present' ? 'var(--success)' : '' }}
                        onClick={() => markAttendance(booking._id, 'present')}
                      >
                        Present
                      </button>
                      <button 
                        className={`btn-saas ${booking.attendance === 'absent' ? 'btn-saas-primary' : 'btn-saas-outline'}`}
                        style={{ padding: '6px 12px', fontSize: '0.75rem', background: booking.attendance === 'absent' ? 'var(--danger)' : '', borderColor: booking.attendance === 'absent' ? 'var(--danger)' : '' }}
                        onClick={() => markAttendance(booking._id, 'absent')}
                      >
                        Absent
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="table-wrapper-saas card-saas">
          <table className="table-saas">
            <thead>
              <tr>
                <th>Session Details</th>
                <th>Schedule</th>
                <th>Location</th>
                <th>Enrolled</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {confirmedSessions.map(s => {
                const isUpcoming = new Date(s.start_time) > new Date();
                return (
                  <tr key={s._id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--navy)' }}>{s.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{s.level.toUpperCase()} LEVEL</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{new Date(s.start_time).toLocaleDateString()}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {new Date(s.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{s.location}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 800, color: 'var(--primary-dark)' }}>{s.enrolled}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ {s.capacity}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn-saas btn-saas-outline"
                        style={{ padding: '6px 12px', fontSize: '0.75rem', fontWeight: 700, marginRight: '8px' }}
                        onClick={() => openAttendance(s)}
                      >
                        Roster
                      </button>
                      <button
                        className="btn-saas btn-saas-outline"
                        style={{ padding: '6px 12px', fontSize: '0.75rem', fontWeight: 700 }}
                        onClick={() => startEditing(s)}
                      >
                        Edit Details
                      </button>
                    </td>
                  </tr>
                );
              })}
              {confirmedSessions.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '5rem' }}>
                    <div style={{ color: 'var(--text-muted)' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
                      <h3 style={{ fontWeight: 800, color: 'var(--navy)' }}>No sessions confirmed</h3>
                      <p>Accepted requests will appear in your confirmed schedule.</p>
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
