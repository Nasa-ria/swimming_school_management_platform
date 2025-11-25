import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './StudentDashboard.css';

function StudentDashboard() {
    const [bookings, setBookings] = useState([]);
    const [availableSessions, setAvailableSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock fetching data
        setTimeout(() => {
            setBookings([
                { id: 1, title: 'Beginner Swimming', date: '2024-11-20', time: '10:00 AM', status: 'Confirmed' },
                { id: 2, title: 'Intermediate Techniques', date: '2024-11-22', time: '02:00 PM', status: 'Pending' }
            ]);
            setAvailableSessions([
                { id: 101, title: 'Advanced Diving', date: '2024-11-25', spots: 5 },
                { id: 102, title: 'Water Polo Basics', date: '2024-11-26', spots: 8 }
            ]);
            setLoading(false);
        }, 800);
    }, []);

    if (loading) {
        return <div className="dashboard-loading">Loading your dashboard...</div>;
    }

    return (
        <div className="student-dashboard">
            <header className="dashboard-header">
                <h1>Student Dashboard</h1>
                <p>Manage your classes and progress</p>
            </header>

            <div className="dashboard-grid">
                <div className="dashboard-column">
                    <div className="section-card">
                        <div className="card-header">
                            <h2>My Upcoming Classes</h2>
                            <Link to="/bookings" className="view-all">View All</Link>
                        </div>
                        {bookings.length > 0 ? (
                            <ul className="booking-list">
                                {bookings.map(booking => (
                                    <li key={booking.id} className="booking-item">
                                        <div className="booking-info">
                                            <h4>{booking.title}</h4>
                                            <p>{booking.date} at {booking.time}</p>
                                        </div>
                                        <span className={`status-badge ${booking.status.toLowerCase()}`}>
                                            {booking.status}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="empty-state">No upcoming bookings.</p>
                        )}
                    </div>
                </div>

                <div className="dashboard-column">
                    <div className="section-card">
                        <div className="card-header">
                            <h2>Available Sessions</h2>
                            <Link to="/sessions" className="view-all">Browse All</Link>
                        </div>
                        <ul className="session-list">
                            {availableSessions.map(session => (
                                <li key={session.id} className="session-item">
                                    <div className="session-info">
                                        <h4>{session.title}</h4>
                                        <p>{session.date}</p>
                                    </div>
                                    <div className="session-action">
                                        <span className="spots-left">{session.spots} spots left</span>
                                        <button className="btn btn-sm btn-outline">Book</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="section-card mt-4">
                        <h2>My Progress</h2>
                        <div className="progress-summary">
                            <div className="progress-item">
                                <span>Level</span>
                                <strong>Intermediate</strong>
                            </div>
                            <div className="progress-item">
                                <span>Classes Attended</span>
                                <strong>12</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentDashboard;
