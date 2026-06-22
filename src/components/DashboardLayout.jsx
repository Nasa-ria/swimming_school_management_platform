import { useState } from 'react';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-container">
      {/* Mobile Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-bottom border-light px-4 flex items-center justify-between z-[30] shadow-sm">
        <span className="font-extrabold text-navy">Alraad<span className="text-primary">Swim</span></span>
        <button
          className="p-2 text-navy hover:bg-slate-100 rounded-lg transition-colors"
          onClick={() => setSidebarOpen(true)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
      </div>

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
