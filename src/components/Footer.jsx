export default function Footer() {
  return (
    <footer style={{ background: 'var(--navy)', color: 'white', padding: '6rem 0 3rem', marginTop: 'auto' }}>
      <div className="portal-container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.75rem', fontWeight: 800, color: 'white' }}>Alraad<span style={{ color: 'var(--primary)' }}>Swim</span></h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: '1.7', maxWidth: '400px' }}>
              The premier destination for aquatic excellence. Our academy combines elite coaching with high-performance digital tools to transform your swimming potential.
            </p>
          </div>
          <div>
            <h4 style={{ marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.4)' }}>Academy</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li><a href="/sessions" style={{ color: 'white', opacity: 0.7, fontSize: '0.9rem', fontWeight: 500 }}>All Programs</a></li>
              <li><a href="/shop" style={{ color: 'white', opacity: 0.7, fontSize: '0.9rem', fontWeight: 500 }}>Equipment Shop</a></li>
              <li><a href="/blog" style={{ color: 'white', opacity: 0.7, fontSize: '0.9rem', fontWeight: 500 }}>Research & Insights</a></li>
              <li><a href="/register" style={{ color: 'white', opacity: 0.7, fontSize: '0.9rem', fontWeight: 500 }}>Join Us</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.4)' }}>Support</h4>
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
            <span style={{ fontSize: '1.25rem', opacity: 0.4, cursor: 'pointer' }}>𝕏</span>
            <span style={{ fontSize: '1.25rem', opacity: 0.4, cursor: 'pointer' }}>📸</span>
            <span style={{ fontSize: '1.25rem', opacity: 0.4, cursor: 'pointer' }}>💼</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
