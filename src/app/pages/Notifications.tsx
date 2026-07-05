import { useNavigate } from 'react-router';
import { Bell, AlertTriangle, Info, CheckCircle, Check, CheckCheck } from 'lucide-react';
import { Header } from '../components/Header';
import { useApp } from '../context/AppContext';

const ICONS = {
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle,
};

const COLORS = {
  warning: '#F59E0B',
  info: '#3B82F6',
  success: '#10B981',
};

export function Notifications() {
  const { notifications, markNotificationRead, markAllRead, unreadCount } = useApp();
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: 'Cairo, sans-serif' }}>
      <Header title="الإشعارات" breadcrumbs={[{ label: 'الرئيسية', path: '/dashboard' }, { label: 'الإشعارات' }]} />
      <div style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Bell size={20} color="#D4AF37" />
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111827' }}>
              الإشعارات
              {unreadCount > 0 && (
                <span style={{ marginRight: 8, background: '#EF4444', color: '#fff', borderRadius: '50%', width: 22, height: 22, fontSize: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  {unreadCount}
                </span>
              )}
            </h2>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', border: '1px solid #E5E7EB', borderRadius: 8, background: '#F9FAFB', cursor: 'pointer', fontSize: 13, fontFamily: 'Cairo, sans-serif', color: '#6B7280' }}>
              <CheckCheck size={14} /> تحديد الكل كمقروء
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 700 }}>
          {notifications.map(n => {
            const Icon = ICONS[n.type as keyof typeof ICONS] || Info;
            const color = COLORS[n.type as keyof typeof COLORS] || '#6B7280';
            return (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                  padding: '16px 18px',
                  background: n.read ? '#fff' : '#FAFBFF',
                  borderRadius: 12,
                  border: `1px solid ${n.read ? '#F3F4F6' : '#E0E7FF'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: n.read ? '0 1px 4px rgba(0,0,0,0.04)' : '0 2px 10px rgba(0,0,0,0.08)',
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = n.read ? '0 1px 4px rgba(0,0,0,0.04)' : '0 2px 10px rgba(0,0,0,0.08)')}
              >
                <div style={{ width: 40, height: 40, borderRadius: 10, background: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} color={color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: n.read ? 500 : 700, color: '#111827' }}>{n.title}</p>
                    <span style={{ fontSize: 11, color: '#9CA3AF', flexShrink: 0 }}>{n.time}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: '#6B7280' }}>{n.message}</p>
                </div>
                {!n.read && (
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3B82F6', flexShrink: 0, marginTop: 6 }} />
                )}
              </div>
            );
          })}

          {notifications.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9CA3AF' }}>
              <Bell size={48} color="#E5E7EB" style={{ margin: '0 auto 16px' }} />
              <p style={{ margin: 0, fontSize: 16 }}>لا توجد إشعارات</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
