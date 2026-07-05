import { NavLink, useNavigate } from 'react-router';
import {
  LayoutDashboard, ShoppingCart, Receipt, Package, Users, Truck,
  CreditCard, BookOpen, UserSquare, BarChart3, GitBranch, Shield,
  Settings, Bell, LogOut, ChevronRight, Warehouse, DollarSign
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
  { path: '/pos', label: 'نقطة البيع', icon: ShoppingCart },
  { path: '/sales', label: 'المبيعات', icon: Receipt },
  { path: '/purchases', label: 'المشتريات', icon: Truck },
  { path: '/inventory', label: 'المخزون', icon: Package },
  { path: '/customers', label: 'العملاء', icon: Users },
  { path: '/suppliers', label: 'الموردون', icon: Warehouse },
  { path: '/expenses', label: 'المصروفات', icon: DollarSign },
  { path: '/accounting', label: 'المحاسبة', icon: BookOpen },
  { path: '/hr', label: 'الموارد البشرية', icon: UserSquare },
  { path: '/reports', label: 'التقارير', icon: BarChart3 },
  { path: '/branches', label: 'الفروع', icon: GitBranch },
  { path: '/users', label: 'المستخدمون', icon: Users },
  { path: '/roles', label: 'الأدوار والصلاحيات', icon: Shield },
  { path: '/settings', label: 'الإعدادات', icon: Settings },
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, user, logout, unreadCount } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      style={{
        width: sidebarCollapsed ? 70 : 240,
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0d0d0d 0%, #1a1a1a 100%)',
        borderLeft: '1px solid #2a2a2a',
        transition: 'width 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Cairo, sans-serif',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ padding: '20px 14px 16px', borderBottom: '1px solid #2a2a2a' }}>
        <Logo size="sm" showText={true} collapsed={sidebarCollapsed} />
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: sidebarCollapsed ? '10px 0' : '10px 14px',
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              textDecoration: 'none',
              color: isActive ? '#D4AF37' : '#9CA3AF',
              background: isActive ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
              borderRight: isActive ? '3px solid #D4AF37' : '3px solid transparent',
              margin: '1px 0',
              transition: 'all 0.2s',
              fontSize: 13,
              fontWeight: isActive ? 600 : 400,
            })}
          >
            {({ isActive }) => (
              <>
                <Icon size={18} color={isActive ? '#D4AF37' : '#6B7280'} style={{ flexShrink: 0 }} />
                {!sidebarCollapsed && <span>{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
      <div style={{ borderTop: '1px solid #2a2a2a', padding: '8px 0' }}>
        <NavLink
          to="/notifications"
          style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 10,
            padding: sidebarCollapsed ? '10px 0' : '10px 14px',
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
            textDecoration: 'none',
            color: isActive ? '#D4AF37' : '#9CA3AF',
            position: 'relative',
            fontSize: 13,
          })}
        >
          <div style={{ position: 'relative' }}>
            <Bell size={18} color="#6B7280" />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: -6, right: -6,
                background: '#EF4444', color: 'white', borderRadius: '50%',
                width: 16, height: 16, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Cairo, sans-serif',
              }}>
                {unreadCount}
              </span>
            )}
          </div>
          {!sidebarCollapsed && <span>الإشعارات</span>}
        </NavLink>

        <NavLink
          to="/profile"
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: sidebarCollapsed ? '10px 0' : '10px 14px', justifyContent: sidebarCollapsed ? 'center' : 'flex-start', textDecoration: 'none', color: '#9CA3AF', fontSize: 13 }}
        >
          <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#000', fontWeight: 700, flexShrink: 0 }}>
            {user?.name?.charAt(0)}
          </div>
          {!sidebarCollapsed && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</span>}
        </NavLink>

        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: sidebarCollapsed ? '10px 0' : '10px 14px',
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
            width: '100%', background: 'none', border: 'none', cursor: 'pointer',
            color: '#EF4444', fontSize: 13, fontFamily: 'Cairo, sans-serif',
          }}
        >
          <LogOut size={18} />
          {!sidebarCollapsed && <span>تسجيل الخروج</span>}
        </button>

        <button
          onClick={toggleSidebar}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '100%', padding: '8px', background: 'none', border: 'none',
            cursor: 'pointer', color: '#4B5563',
          }}
        >
          <ChevronRight
            size={16}
            style={{ transform: sidebarCollapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}
          />
        </button>
      </div>
    </aside>
  );
}
