import { Outlet, useNavigate } from 'react-router';
import { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Sidebar } from '../components/Sidebar';

export function MainLayout() {
  const { isAuthenticated, toasts, removeToast } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const toastColors: Record<string, string> = {
    success: '#10B981',
    error: '#EF4444',
    info: '#3B82F6',
    warning: '#F59E0B',
  };

  return (
    <div dir="rtl" style={{ display: 'flex', minHeight: '100vh', background: '#F3F4F6', fontFamily: 'Cairo, sans-serif' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <main style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <Outlet />
        </main>
      </div>

      {/* Toast notifications */}
      <div style={{ position: 'fixed', bottom: 24, left: 24, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 9999 }}>
        {toasts.map(toast => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            style={{
              background: '#fff',
              borderRadius: 10,
              padding: '12px 16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              borderRight: `4px solid ${toastColors[toast.type]}`,
              minWidth: 280,
              cursor: 'pointer',
              fontFamily: 'Cairo, sans-serif',
              fontSize: 13,
              color: '#111827',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              animation: 'slideIn 0.3s ease',
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: toastColors[toast.type], flexShrink: 0 }} />
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}
