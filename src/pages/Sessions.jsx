import { useState, useEffect } from 'react';
import axios from 'axios';
import './Sessions.css';

function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/sessions');
      setSessions(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setLoading(false);
    }
  };

  const filteredSessions = filter === 'all' 
    ? sessions 
    : sessions.filter(session => session.skill_level === filter);

  if (loading) {
    return <div className="loading">Loading sessions...</div>;
  }

  return (
    <div className="sessions-page">
      <div className="page-header">
        <h1>Swimming Sessions</h1>
        <p>Find and book swimming lessons based on your skill level</p>
      </div>

      <div className="filter-section">
        <button 
          className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setFilter('all')}
        >
          All Levels
        </button>
        <button 
          className={filter === 'beginner' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setFilter('beginner')}
        >
          Beginner
        </button>
        <button 
          className={filter === 'intermediate' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setFilter('intermediate')}
        >
          Intermediate
        </button>
        <button 
          className={filter === 'advanced' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setFilter('advanced')}
        >
          Advanced
        </button>
      </div>

      <div className="sessions-grid">
        {filteredSessions.length === 0 ? (
          <div className="no-sessions">
            <p>No sessions available at the moment.</p>
            <p>Check back later or contact us for more information.</p>
          </div>
        ) : (
          filteredSessions.map(session => (
            <div key={session.id} className="session-card">
              <div className="session-header">
                <h3>{session.title}</h3>
                <span className={`skill-badge ${session.skill_level}`}>
                  {session.skill_level}
                </span>
              </div>
              <p className="session-description">{session.description}</p>
              <div className="session-details">
                <div className="detail-item">
                  <span className="label">Instructor:</span>
                  <span className="value">{session.instructor_name}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Date:</span>
                  <span className="value">{new Date(session.session_date).toLocaleDateString()}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Duration:</span>
                  <span className="value">{session.duration} minutes</span>
                </div>
                <div className="detail-item">
                  <span className="label">Location:</span>
                  <span className="value">{session.location}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Participants:</span>
                  <span className="value">{session.current_participants}/{session.max_participants}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Price:</span>
                  <span className="value price">${session.price}</span>
                </div>
              </div>
              <button className="book-btn">Book Session</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Sessions;

