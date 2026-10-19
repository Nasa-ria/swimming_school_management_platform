export default function Footer() {
  return (
    <footer className="site-footer-saas">
      <div className="portal-container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.75rem', fontWeight: 700, color: 'white' }}>Alraad<span style={{ color: 'var(--primary-light)' }}>Swim</span></h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: '1.7', maxWidth: '400px' }}>
              The premier destination for aquatic excellence. Our academy combines elite coaching with high-performance digital tools to transform your swimming potential.
            </p>
          </div>
          <div>
            <h4 className="footer-label">Academy</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li><a href="/sessions" className="footer-link">All Programs</a></li>
              <li><a href="/shop" className="footer-link">Equipment Shop</a></li>
              <li><a href="/blog" className="footer-link">Research & Insights</a></li>
              <li><a href="/register" className="footer-link">Join Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-label">Support</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: 500 }}>
              <li>📍 123 Aquatic Avenue</li>
              <li>📞 (555) 000-SWIM</li>
              <li>📧 hello@alraadswim.com</li>
              <li>🕒 06:00 — 21:00 Daily</li>
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '5rem', paddingTop: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8125rem' }}>
            &copy; {new Date().getFullYear()} Alraad Swimming Academy. Digital experience designed for performance.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#" aria-label="X (Twitter)" className="footer-social">𝕏</a>
            <a href="#" aria-label="Instagram" className="footer-social">📸</a>
            <a href="#" aria-label="LinkedIn" className="footer-social">💼</a>
          </div>
        </div>
      </div>

      <style>{`
        .site-footer-saas {
          background: var(--navy);
          color: white;
          padding: 6rem 0 3rem;
          margin-top: auto;
        }
        .footer-label {
          font-family: var(--font-body);
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: rgba(255,255,255,0.4);
        }
        .footer-link {
          color: white;
          opacity: 0.7;
          font-size: 0.9rem;
          font-weight: 500;
          transition: var(--transition);
        }
        .footer-link:hover {
          opacity: 1;
          color: var(--primary-light);
        }
        .footer-social {
          font-size: 1.25rem;
          opacity: 0.4;
          cursor: pointer;
          transition: var(--transition);
          line-height: 1;
        }
        .footer-social:hover {
          opacity: 1;
          transform: translateY(-2px);
        }
      `}</style>
    </footer>
  );
}
