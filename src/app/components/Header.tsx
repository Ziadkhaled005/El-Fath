import { useNavigate } from 'react-router';
import { Bell, Search, Menu } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BRANCHES } from '../data/mockData';

interface HeaderProps {
  title: string;
  breadcrumbs?: { label: string; path?: string }[];
}

export function Header({ title, breadcrumbs }: HeaderProps) {
  const { toggleSidebar, unreadCount, user, currentBranch, setCurrentBranch } = useApp();
  const navigate = useNavigate();

  return (
    <header style={{
      background: '#fff',
      borderBottom: '1px solid #E5E7EB',
      padding: '0 24px',
      height: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontFamily: 'Cairo, sans-serif',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={toggleSidebar} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <Menu size={20} color="#6B7280" />
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111827', fontFamily: 'Cairo, sans-serif' }}>
            {title}
          </h1>
          {breadcrumbs && (
            <div style={{ display: 'flex', gap: 6, fontSize: 12, color: '#9CA3AF', alignItems: 'center' }}>
              {breadcrumbs.map((b, i) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {i > 0 && <span>/</span>}
                  <span
                    style={{ cursor: b.path ? 'pointer' : 'default', color: b.path ? '#D4AF37' : '#9CA3AF' }}
                    onClick={() => b.path && navigate(b.path)}
                  >
                    {b.label}
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Branch selector */}
        <select
          value={currentBranch}
          onChange={e => setCurrentBranch(Number(e.target.value))}
          style={{
            border: '1px solid #E5E7EB', borderRadius: 8, padding: '6px 10px',
            fontSize: 13, fontFamily: 'Cairo, sans-serif', color: '#374151',
            background: '#F9FAFB', cursor: 'pointer', outline: 'none',
          }}
        >
          <option value={0}>جميع الفروع</option>
          {BRANCHES.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>

        {/* Date */}
        <div style={{ fontSize: 13, color: '#9CA3AF' }}>
          {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>

        {/* Notifications */}
        <button
          onClick={() => navigate('/notifications')}
          style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}
        >
          <Bell size={20} color="#6B7280" />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute', top: 0, right: 0,
              background: '#EF4444', color: '#fff', borderRadius: '50%',
              width: 18, height: 18, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Cairo, sans-serif',
            }}>
              {unreadCount}
            </span>
          )}
        </button>

        {/* User avatar */}
        <button
          onClick={() => navigate('/profile')}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'linear-gradient(135deg, #D4AF37, #A07B20)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, color: '#000', fontWeight: 700,
          }}>
            {user?.name?.charAt(0)}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', fontFamily: 'Cairo, sans-serif' }}>{user?.name}</div>
            <div style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'Cairo, sans-serif' }}>{user?.role}</div>
          </div>
        </button>
      </div>
    </header>
  );
}
