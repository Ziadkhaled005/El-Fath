import { createBrowserRouter } from 'react-router';
import { MainLayout } from './layouts/MainLayout';
import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { Dashboard } from './pages/Dashboard';
import { POS } from './pages/POS';
import { Sales } from './pages/Sales';
import { Purchases } from './pages/Purchases';
import { Inventory } from './pages/Inventory';
import { Customers } from './pages/Customers';
import { Suppliers } from './pages/Suppliers';
import { Expenses } from './pages/Expenses';
import { Accounting } from './pages/Accounting';
import { HR } from './pages/HR';
import { Reports } from './pages/Reports';
import { Branches } from './pages/Branches';
import { Users } from './pages/Users';
import { Roles } from './pages/Roles';
import { Settings } from './pages/Settings';
import { Notifications } from './pages/Notifications';
import { Profile } from './pages/Profile';
import { RedirectToDashboard } from './pages/RedirectToDashboard';

export const router = createBrowserRouter([
  { path: '/login', Component: Login },
  { path: '/forgot-password', Component: ForgotPassword },
  {
    path: '/',
    Component: MainLayout,
    children: [
      { index: true, Component: RedirectToDashboard },
      { path: 'dashboard', Component: Dashboard },
      { path: 'pos', Component: POS },
      { path: 'sales', Component: Sales },
      { path: 'purchases', Component: Purchases },
      { path: 'inventory', Component: Inventory },
      { path: 'customers', Component: Customers },
      { path: 'suppliers', Component: Suppliers },
      { path: 'expenses', Component: Expenses },
      { path: 'accounting', Component: Accounting },
      { path: 'hr', Component: HR },
      { path: 'reports', Component: Reports },
      { path: 'branches', Component: Branches },
      { path: 'users', Component: Users },
      { path: 'roles', Component: Roles },
      { path: 'settings', Component: Settings },
      { path: 'notifications', Component: Notifications },
      { path: 'profile', Component: Profile },
    ],
  },
]);
