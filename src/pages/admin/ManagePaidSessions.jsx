import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { showToast } from '../../components/Toast';

export default function ManagePaidSessions() {
  const [bookings, setBookings] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, instructorsRes] = await Promise.all([
          api.get('/admin/paid-sessions'),
          api.get('/admin/instructors')
        ]);
        setBookings(bookingsRes.data);
        setInstructors(instructorsRes.data);
      } catch (err) {
        showToast('Failed to load sessions', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAssign = async (bookingId, sessionId, instructorId) => {
    try {
      setProcessing(bookingId);
      await api.post('/admin/assign-session-instructor', { session_id: sessionId, instructor_id: instructorId });
      showToast('Instructor assigned to session', 'success');
      
      // Update local state
      const instructor = instructors.find(i => i._id === instructorId);
      setBookings(bookings.map(b => 
        b.id === bookingId 
          ? { ...b, assigned_instructor: instructor?.name || 'Unassigned', instructor_id: instructorId }
          : b
      ));
    } catch (err) {
      showToast('Failed to assign instructor', 'error');
    } finally {
      setProcessing(null);
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (filter === 'unassigned') return b.assigned_instructor === 'Unassigned';
    if (filter === 'assigned') return b.assigned_instructor !== 'Unassigned';
    return true;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="page-title">Session Billing & Ops</h1>
          <p className="page-subtitle">Track paid swimming sessions and dispatch instructors to students.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Filter status:</span>
          <select 
            className="input-saas" 
            style={{ width: '180px', padding: '8px 12px', fontSize: '0.8125rem', fontWeight: 600 }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Transactions</option>
            <option value="unassigned">Pending Assignment</option>
            <option value="assigned">Assigned Sessions</option>
          </select>
        </div>
      </header>

      <section className="table-wrapper-saas">
        <table className="table-saas">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Class Details</th>
              <th>Scheduled Time</th>
              <th>Dispatch Status</th>
              <th style={{ textAlign: 'right' }}>Coach Assignment</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map(booking => (
              <tr key={booking.id}>
                <td style={{ fontWeight: 700, color: 'var(--navy)' }}>{booking.student_name}</td>
                <td>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{booking.session_title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--success-text)', fontWeight: 700 }}>Payment Confirmed</div>
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{new Date(booking.date).toLocaleDateString()}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {new Date(booking.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </td>
                <td>
                  <span className={`badge-saas ${booking.assigned_instructor === 'Unassigned' ? 'warning' : 'info'}`}>
                    {booking.assigned_instructor === 'Unassigned' ? 'Awaiting Coach' : 'Coach Assigned'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <select 
                    className="input-saas"
                    style={{ width: '200px', padding: '6px 12px', fontSize: '0.8125rem', fontWeight: 600 }}
                    value={booking.instructor_id || ''}
                    onChange={(e) => handleAssign(booking.id, booking.session_id, e.target.value)}
                    disabled={processing === booking.id}
                  >
                    <option value="">Select Instructor...</option>
                    {instructors.map(inst => (
                      <option key={inst._id} value={inst._id}>{inst.name}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {filteredBookings.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '5rem' }}>
                  <div style={{ color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💸</div>
                    <h3 style={{ fontWeight: 800, color: 'var(--navy)' }}>No sessions to display</h3>
                    <p>When students pay for private or special sessions, they will appear here for instructor dispatching.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
