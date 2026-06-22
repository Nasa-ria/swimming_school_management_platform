import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="page-wrapper container text-center" style={{ padding: '5rem 2rem' }}>
      <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🚫</div>
      <h1 className="section-title">Access Denied</h1>
      <p className="section-subtitle" style={{ maxWidth: '500px', margin: '0 auto 2rem' }}>
        You do not have permission to view this page. If you believe this is an error, please contact the administration.
      </p>
      <div className="flex gap-4 justify-center">
        <Link to="/" className="btn btn-primary">Go to Home</Link>
        <Link to="/profile" className="btn btn-ghost">My Profile</Link>
      </div>
    </div>
  );
}
