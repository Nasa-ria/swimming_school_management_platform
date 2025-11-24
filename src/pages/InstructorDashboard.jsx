// InstructorDashboard.jsx
import React, { useEffect, useState } from "react";

 function InstructorDashboard({ instructorId }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    if (!instructorId) return;
    setLoading(true);
    fetch(`/api/instructor/${instructorId}/sessions/upcoming`)
      .then(r => r.json())
      .then(data => setSessions(data))
      .catch(err => console.error(err))
      .finally(()=> setLoading(false));
  }, [instructorId]);

  if (!instructorId) return <div>Please provide instructorId</div>;
  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Upcoming Sessions</h2>
      <div>
        {sessions.length === 0 && <div>No upcoming sessions</div>}
        {sessions.map(s => (
          <div key={s._id || s.session_id} style={{ border: "1px solid #eee", padding: 12, marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong>{s.title}</strong>
                <div>{new Date(s.start_time).toLocaleString()} - {new Date(s.end_time).toLocaleTimeString()}</div>
                <div>Location: {s.location}</div>
                <div>Capacity: {s.capacity}, Reserved: {s.reserved || 0}, Remaining: {s.remaining}</div>
              </div>
              <div>
                <button onClick={() => setSelectedSession(s._id || s.session_id)}>View</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedSession && (
        <div style={{ marginTop: 20 }}>
          <SessionDetail sessionId={selectedSession} onClose={() => setSelectedSession(null)} />
        </div>
      )}
    </div>
  );
}

function SessionDetail({ sessionId, onClose }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = () => {
    setLoading(true);
    fetch(`/api/instructor/sessions/${sessionId}/bookings`)
      .then(r => r.json())
      .then(data => setBookings(data))
      .catch(err => console.error(err))
      .finally(()=> setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, [sessionId]);

  const updateStatus = async (id, action) => {
    setLoading(true);
    const res = await fetch(`/api/bookings/${id}/${action}`, { method: "PATCH" });
    if (res.ok) {
      fetchBookings();
    } else {
      console.error("Failed to update");
      setLoading(false);
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3>Session Bookings</h3>
        <button onClick={onClose}>Close</button>
      </div>

      {loading && <div>Loading bookings...</div>}
      {!loading && bookings.length === 0 && <div>No bookings</div>}

      <ul>
        {bookings.map(b => (
          <li key={b.booking_id} style={{ marginBottom: 8 }}>
            <div>
              <strong>{b.member ? `${b.member.first_name} ${b.member.last_name}` : "Guest"}</strong>
              <div>{b.member?.email}</div>
              <div>Spots: {b.num_spots} — Status: {b.booking_status}</div>
            </div>
            <div style={{ marginTop: 6 }}>
              <button onClick={() => updateStatus(b.booking_id, "checkin")} disabled={b.booking_status === "checked_in"}>Check In</button>
              <button onClick={() => updateStatus(b.booking_id, "noshow")} style={{ marginLeft: 6 }} disabled={b.booking_status === "no_show"}>No Show</button>
              <button onClick={() => updateStatus(b.booking_id, "cancel")} style={{ marginLeft: 6 }} disabled={b.booking_status === "cancelled"}>Cancel</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}


export default InstructorDashboard;