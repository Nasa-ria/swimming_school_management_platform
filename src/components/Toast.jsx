import { useEffect, useState } from 'react';

/**
 * Global toast notification system.
 * Usage: window.dispatchEvent(new CustomEvent('toast', { detail: { message, type } }))
 * type: 'success' | 'error' | 'info'
 */
export default function Toast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (e) => {
      const { message, type = 'info' } = e.detail;
      const id = Date.now();
      setToasts(prev => [...prev, { id, message, type }]);
      // Auto-remove after 3.5 seconds
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
    };
    window.addEventListener('toast', handler);
    return () => window.removeEventListener('toast', handler);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}

/** Helper function to fire a toast from anywhere */
export function showToast(message, type = 'info') {
  window.dispatchEvent(new CustomEvent('toast', { detail: { message, type } }));
}
