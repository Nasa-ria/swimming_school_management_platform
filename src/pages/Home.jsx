import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>🏊‍♂️ Swimming School Management</h1>
          <p>Your comprehensive platform for swimming lessons, booking sessions, shopping for equipment, and staying updated with the latest swimming tips and news.</p>
          <div className="hero-buttons">
            <Link to="/sessions" className="btn btn-primary">Browse Sessions</Link>
            <Link to="/shop" className="btn btn-secondary">Shop Equipment</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Browse Sessions</h3>
            <p>Find and book swimming lessons</p>
            <Link to="/sessions">View Sessions →</Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>My Bookings</h3>
            <p>View your scheduled sessions</p>
            <Link to="/bookings">My Bookings →</Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🛍️</div>
            <h3>Shop</h3>
            <p>Browse swimming equipment</p>
            <Link to="/shop">Browse Shop →</Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📰</div>
            <h3>Blog</h3>
            <p>Tips, news, and updates</p>
            <Link to="/blog">Read Blog →</Link>
          </div>
        </div>
      </section>

      {/* Session Booking Section */}
      <section className="info-section">
        <div className="info-content">
          <h2>Session Booking</h2>
          <p>Book swimming sessions based on your skill level. Track your progress and manage your schedule with ease.</p>
          <ul>
            <li>✅ Beginner to Advanced levels</li>
            <li>✅ Professional instructors</li>
            <li>✅ Flexible scheduling</li>
            <li>✅ Progress tracking</li>
          </ul>
          <Link to="/sessions" className="btn btn-primary">View Sessions</Link>
        </div>
      </section>

      {/* E-Commerce Section */}
      <section className="info-section alt">
        <div className="info-content">
          <h2>E-Commerce</h2>
          <p>Shop for swimming wear, equipment, and accessories. Get everything you need for your swimming journey.</p>
          <ul>
            <li>🏊 Swimwear & Apparel</li>
            <li>🥽 Goggles & Accessories</li>
            <li>🏋️ Training Equipment</li>
            <li>🚚 Fast Delivery</li>
          </ul>
          <Link to="/shop" className="btn btn-primary">Browse Shop</Link>
        </div>
      </section>

      {/* Learning Resources Section */}
      <section className="info-section">
        <div className="info-content">
          <h2>Learning Resources</h2>
          <p>Read articles, tips, and news about swimming. Stay informed and improve your skills.</p>
          <ul>
            <li>📚 Swimming Techniques</li>
            <li>💪 Training Tips</li>
            <li>🏆 Competition News</li>
            <li>🎯 Skill Development</li>
          </ul>
          <Link to="/blog" className="btn btn-primary">Read Blog</Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Start Your Swimming Journey?</h2>
        <p>Join our swimming school today and experience professional training with state-of-the-art facilities.</p>
        <div className="cta-buttons">
          <Link to="/sessions" className="btn btn-large btn-primary">Book a Session</Link>
          <Link to="/profile" className="btn btn-large btn-secondary">View Profile</Link>
        </div>
      </section>
    </div>
  );
}

export default Home;

