import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X, Lock, Power, PowerOff } from 'lucide-react';
import { Header } from '../components/Header';
import { BRANCHES, ROLES, USERS } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { normalizeCollection, usersApi } from '../services/api';

type User = typeof USERS[0];

const emptyForm = { name: '', username: '', email: '', role: 'Cashier', branch: 'Main' };

export function Users() {
  const { addToast } = useApp();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<User | null>(null);
  const [form, setForm] = useState(emptyForm);

  const loadUsers = async () => {
    try {
      const payload = await usersApi.list({ page: 1, pageSize: 100 });
      const items = normalizeCollection<User>(payload);
      setUsers(items.length > 0 ? items : USERS);
    } catch {
      setUsers(USERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openEdit = (user: User) => {
    setEditItem(user);
    setForm({
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      branch: user.branch,
    });
    setShowForm(true);
  };

  const save = async () => {
    if (!form.name || !form.username) {
      addToast({ type: 'error', message: 'Name and username are required' });
      return;
    }

    try {
      if (editItem) {
        await usersApi.update(editItem.id, form);
        setUsers(prev => prev.map(user => user.id === editItem.id ? { ...user, ...form } : user));
        addToast({ type: 'success', message: 'User updated' });
      } else {
        await usersApi.create(form);
        setUsers(prev => [{ id: Date.now(), ...form, status: 'active', lastLogin: 'Never' }, ...prev]);
        addToast({ type: 'success', message: 'User created' });
      }
      setShowForm(false);
      setEditItem(null);
      setForm(emptyForm);
    } catch {
      addToast({ type: 'error', message: 'Server could not save the user' });
    }
  };

  const toggleStatus = async (user: User) => {
    const status = user.status === 'active' ? 'inactive' : 'active';
    setUsers(prev => prev.map(item => item.id === user.id ? { ...item, status } : item));
    try {
      await usersApi.update(user.id, { ...user, status });
      addToast({ type: 'success', message: 'User status updated' });
    } catch {
      addToast({ type: 'error', message: 'Server could not update user status' });
    }
  };

  const resetPassword = async (user: User) => {
    try {
      await usersApi.resetPassword(user.id);
      addToast({ type: 'info', message: `Password reset sent to ${user.name}` });
    } catch {
      addToast({ type: 'error', message: 'Server could not send password reset' });
    }
  };

  const deleteUser = async (user: User) => {
    if (!confirm('Delete user?')) return;
    setUsers(prev => prev.filter(item => item.id !== user.id));
    try {
      await usersApi.remove(user.id);
      addToast({ type: 'success', message: 'User deleted' });
    } catch {
      addToast({ type: 'error', message: 'Server could not delete the user' });
    }
  };

  return (
    <div style={{ fontFamily: 'Cairo, sans-serif' }}>
      <Header title="Users" breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Users' }]} />
      <div style={{ padding: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            ['Total users', users.length, '#3B82F6'],
            ['Active', users.filter(user => user.status === 'active').length, '#10B981'],
            ['Inactive', users.filter(user => user.status === 'inactive').length, '#EF4444'],
            ['Roles', ROLES.length, '#D4AF37'],
          ].map(([label, value, color]) => (
            <div key={label as string} style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #F3F4F6' }}>
              <p style={{ margin: '0 0 4px', fontSize: 12, color: '#9CA3AF' }}>{label}</p>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: color as string }}>{value}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <button onClick={() => { setEditItem(null); setForm(emptyForm); setShowForm(true); }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', border: 'none', borderRadius: 10, background: '#D4AF37', cursor: 'pointer', fontWeight: 700 }}>
            <Plus size={15} /> New User
          </button>
        </div>

        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #F3F4F6', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9FAFB' }}>
                {['User', 'Username', 'Role', 'Branch', 'Last login', 'Status', 'Actions'].map(header => (
                  <th key={header} style={{ padding: 12, textAlign: 'right', fontSize: 12, color: '#374151' }}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ padding: 32, textAlign: 'center', color: '#9CA3AF' }}>Loading...</td></tr>
              ) : users.map(user => (
                <tr key={user.id} style={{ borderTop: '1px solid #F3F4F6' }}>
                  <td style={{ padding: 12, fontWeight: 700 }}>{user.name}<div style={{ fontSize: 11, color: '#9CA3AF' }}>{user.email}</div></td>
                  <td style={{ padding: 12, color: '#6B7280' }}>{user.username}</td>
                  <td style={{ padding: 12 }}>{user.role}</td>
                  <td style={{ padding: 12 }}>{user.branch}</td>
                  <td style={{ padding: 12, color: '#9CA3AF' }}>{user.lastLogin}</td>
                  <td style={{ padding: 12, color: user.status === 'active' ? '#16A34A' : '#DC2626' }}>{user.status}</td>
                  <td style={{ padding: 12 }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => openEdit(user)}><Edit size={14} /></button>
                      <button onClick={() => resetPassword(user)}><Lock size={14} /></button>
                      <button onClick={() => toggleStatus(user)}>{user.status === 'active' ? <PowerOff size={14} /> : <Power size={14} />}</button>
                      <button onClick={() => deleteUser(user)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, width: 460 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ margin: 0 }}>{editItem ? 'Edit User' : 'New User'}</h3>
              <button onClick={() => setShowForm(false)}><X size={18} /></button>
            </div>
            {(['name', 'username', 'email'] as const).map(key => (
              <input key={key} value={form[key]} onChange={event => setForm(prev => ({ ...prev, [key]: event.target.value }))} placeholder={key} style={{ width: '100%', boxSizing: 'border-box', marginBottom: 10, padding: 10, border: '1px solid #E5E7EB', borderRadius: 8 }} />
            ))}
            <select value={form.role} onChange={event => setForm(prev => ({ ...prev, role: event.target.value }))} style={{ width: '100%', marginBottom: 10, padding: 10 }}>
              {ROLES.map(role => <option key={role.id} value={role.name}>{role.name}</option>)}
            </select>
            <select value={form.branch} onChange={event => setForm(prev => ({ ...prev, branch: event.target.value }))} style={{ width: '100%', marginBottom: 16, padding: 10 }}>
              <option value="All">All branches</option>
              {BRANCHES.map(branch => <option key={branch.id} value={branch.name}>{branch.name}</option>)}
            </select>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={save} style={{ flex: 1, padding: 12, background: '#D4AF37', border: 'none', borderRadius: 8, fontWeight: 700 }}>Save</button>
              <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: 12, border: 'none', borderRadius: 8 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
