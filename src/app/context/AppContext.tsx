import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authApi, notificationsApi, normalizeCollection } from '../services/api';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  branch: string;
  avatar?: string;
}

interface BackendUser {
  id?: number;
  fullName?: string;
  username?: string;
  email?: string;
  role?: string;
  branchName?: string;
  branchId?: number | null;
}

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  notifications: Notification[];
  markNotificationRead: (id: number) => void;
  markAllRead: () => void;
  unreadCount: number;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  currentBranch: number;
  setCurrentBranch: (id: number) => void;
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: number) => void;
}

interface Toast {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

const AppContext = createContext<AppContextType | null>(null);

const DEMO_USER: User = {
  id: 1,
  name: 'أحمد محمد السيد',
  username: 'ahmed.admin',
  email: 'ahmed@alfath.com',
  role: 'مدير النظام',
  branch: 'الكل',
};

function mapUser(user: BackendUser | undefined | null): User | null {
  if (!user) return null;
  return {
    id: user.id ?? 0,
    name: user.fullName ?? user.username ?? 'User',
    username: user.username ?? 'user',
    email: user.email ?? '',
    role: user.role ?? 'User',
    branch: user.branchName ?? 'الكل',
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = sessionStorage.getItem('erp_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentBranch, setCurrentBranch] = useState(1);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [toastId, setToastId] = useState(0);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const data = await authApi.login(username, password);
      const mappedUser = mapUser((data as { user?: BackendUser }).user);
      const resolvedUser = mappedUser ?? DEMO_USER;
      setUser(resolvedUser);
      sessionStorage.setItem('erp_user', JSON.stringify(resolvedUser));
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      sessionStorage.removeItem('erp_user');
    }
  }, []);

  const markNotificationRead = useCallback((id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = toastId + 1;
    setToastId(id);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, [toastId]);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const payload = await notificationsApi.list(false);
        const items = normalizeCollection<Notification>(payload);
        setNotifications(items.map((item, index) => ({
          id: item.id ?? index + 1,
          type: item.type ?? 'info',
          title: item.title ?? 'Notification',
          message: item.message ?? '',
          time: item.time ?? 'just now',
          read: Boolean(item.read),
        })));
      } catch {
        setNotifications([]);
      }
    };

    if (authApi.isAuthenticated()) {
      loadNotifications();
    }
  }, []);

  useEffect(() => {
    if (!user && authApi.isAuthenticated()) {
      authApi.me().then((me: unknown) => {
        const mapped = mapUser((me as { user?: BackendUser } | undefined)?.user ?? (me as BackendUser | undefined));
        if (mapped) {
          setUser(mapped);
          sessionStorage.setItem('erp_user', JSON.stringify(mapped));
        }
      }).catch(() => {
        sessionStorage.removeItem('erp_user');
      });
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      notifications,
      markNotificationRead,
      markAllRead,
      unreadCount,
      sidebarCollapsed,
      toggleSidebar,
      currentBranch,
      setCurrentBranch,
      toasts,
      addToast,
      removeToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
