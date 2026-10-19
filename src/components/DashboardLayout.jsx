import { useState } from 'react';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-container">
      {/* Mobile Header Bar */}
      <div className="mobile-dashboard-header">
        <span className="sidebar-logo-saas" style={{ color: 'var(--navy)' }}>Alraad<span>Swim</span></span>
        <button
          className="mobile-dashboard-toggle"
          onClick={() => setSidebarOpen(true)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
      </div>
      <style>{`
        .mobile-dashboard-header {
          display: none;
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 64px;
          background: var(--bg-surface);
          border-bottom: 1px solid var(--border-light);
          padding: 0 1rem;
          align-items: center;
          justify-content: space-between;
          z-index: 30;
          box-shadow: var(--shadow-sm);
        }
        .mobile-dashboard-toggle {
          padding: 0.5rem;
          color: var(--navy);
          background: transparent;
          border: none;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: var(--transition);
        }
        .mobile-dashboard-toggle:hover { background: var(--bg-page); }
        @media (max-width: 1023px) {
          .mobile-dashboard-header { display: flex; }
        }
      `}</style>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="dashboard-main">
        <div className="dashboard-content">
          <div className="portal-container animate-fade-up">
            {children}
          </div>
        </div>
        {/* <Footer /> */}
      </main>
    </div>
  );
}
