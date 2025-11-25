import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
  const [stats, setStats] = useState({
    members: 0,
    instructors: 0,
    sessions: 0,
    activeBookings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock fetching stats
    // In a real app, this would be fetch('/api/admin/stats')
    setTimeout(() => {
      setStats({
        members: 150,
        instructors: 12,
        sessions: 45,
        activeBookings: 320
      });
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, Administrator</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Members</h3>
          <p className="stat-value">{stats.members}</p>
        </div>
        <div className="stat-card">
          <h3>Instructors</h3>
          <p className="stat-value">{stats.instructors}</p>
        </div>
        <div className="stat-card">
          <h3>Active Sessions</h3>
          <p className="stat-value">{stats.sessions}</p>
        </div>
        <div className="stat-card">
          <h3>Total Bookings</h3>
          <p className="stat-value">{stats.activeBookings}</p>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section-card">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <Link to="/admin/members" className="btn btn-primary">Manage Members</Link>
            <Link to="/admin/sessions" className="btn btn-primary">Manage Sessions</Link>
            <Link to="/admin/instructors" className="btn btn-primary">Manage Instructors</Link>
          </div>
        </div>

        <div className="section-card">
          <h2>Recent Activity</h2>
          <ul className="activity-list">
            <li>New member registration: John Doe</li>
            <li>Session "Advanced Swimming" created</li>
            <li>Booking #1234 confirmed</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
