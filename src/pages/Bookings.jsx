import { useState, useEffect } from 'react';
import './Bookings.css';

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching bookings
    setTimeout(() => {
      setBookings([]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      // Implement cancel logic here
      console.log('Cancelling booking:', bookingId);
    }
  };

  if (loading) {
    return <div className="loading">Loading your bookings...</div>;
  }

  return (
    <div className="bookings-page">
      <div className="page-header">
        <h1>My Bookings</h1>
        <p>View and manage your scheduled swimming sessions</p>
      </div>

      {bookings.length === 0 ? (
        <div className="no-bookings">
          <div className="no-bookings-icon">📅</div>
          <h2>No Bookings Yet</h2>
          <p>You haven't booked any swimming sessions yet.</p>
          <a href="/sessions" className="btn btn-primary">Browse Sessions</a>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map(booking => (
            <div key={booking.id} className="booking-card">
              <div className="booking-header">
                <h3>{booking.session_title}</h3>
                <span className={`status-badge ${booking.status}`}>
                  {booking.status}
                </span>
              </div>
              <div className="booking-details">
                <div className="detail-row">
                  <span className="label">Instructor:</span>
                  <span className="value">{booking.instructor}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Date:</span>
                  <span className="value">{booking.date}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Time:</span>
                  <span className="value">{booking.time}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Location:</span>
                  <span className="value">{booking.location}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Payment:</span>
                  <span className={`value payment-${booking.payment_status}`}>
                    {booking.payment_status}
                  </span>
                </div>
              </div>
              <div className="booking-actions">
                <button className="btn-view">View Details</button>
                <button 
                  className="btn-cancel"
                  onClick={() => handleCancelBooking(booking.id)}
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Bookings;

