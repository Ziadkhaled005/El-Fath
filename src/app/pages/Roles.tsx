import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X, Copy, Shield, Power, PowerOff } from 'lucide-react';
import { Header } from '../components/Header';
import { ROLES } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { normalizeCollection, rolesApi } from '../services/api';

type Role = typeof ROLES[0];

const PERMISSIONS = [
  { module: 'sales', perms: ['view', 'create', 'edit', 'delete', 'print', 'export', 'approve'] },
  { module: 'purchases', perms: ['view', 'create', 'edit', 'delete', 'approve'] },
  { module: 'inventory', perms: ['view', 'create', 'edit', 'delete', 'adjust-stock'] },
  { module: 'customers', perms: ['view', 'create', 'edit', 'delete'] },
  { module: 'suppliers', perms: ['view', 'create', 'edit', 'delete'] },
  { module: 'reports', perms: ['view', 'export', 'print'] },
  { module: 'settings', perms: ['full-access'] },
  { module: 'users', perms: ['view', 'create', 'edit', 'delete'] },
];

export function Roles() {
  const { addToast } = useApp();
  const [roles, setRoles] = useState<Role[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showMatrix, setShowMatrix] = useState<Role | null>(null);
  const [editItem, setEditItem] = useState<Role | null>(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [rolePerms, setRolePerms] = useState<Record<string, string[]>>({});

  const loadRoles = async () => {
    try {
      const payload = await rolesApi.list();
      const items = normalizeCollection<Role>(payload);
      setRoles(items.length > 0 ? items : ROLES);
    } catch {
      setRoles(ROLES);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const openEdit = (role: Role) => {
    setEditItem(role);
    setForm({ name: role.name, description: role.description });
    setShowForm(true);
  };

  const openPermissions = async (role: Role) => {
    setShowMatrix(role);
    try {
      const payload = await rolesApi.permissions(role.id);
      const permissions = (payload as { permissions?: Record<string, string[]> }).permissions;
      setRolePerms(permissions || {});
    } catch {
      setRolePerms({});
    }
  };

  const save = async () => {
    if (!form.name) {
      addToast({ type: 'error', message: 'Role name is required' });
      return;
    }

    try {
      if (editItem) {
        await rolesApi.update(editItem.id, form);
        setRoles(prev => prev.map(role => role.id === editItem.id ? { ...role, ...form } : role));
        addToast({ type: 'success', message: 'Role updated' });
      } else {
        await rolesApi.create(form);
        setRoles(prev => [{ id: Date.now(), ...form, users: 0, status: 'active', isSystem: false }, ...prev]);
        addToast({ type: 'success', message: 'Role created' });
      }
      setShowForm(false);
      setEditItem(null);
    } catch {
      addToast({ type: 'error', message: 'Server could not save the role' });
    }
  };

  const cloneRole = async (role: Role) => {
    const payload = { name: `${role.name} copy`, description: role.description };
    try {
      await rolesApi.create(payload);
      setRoles(prev => [{ ...role, ...payload, id: Date.now(), users: 0, isSystem: false }, ...prev]);
      addToast({ type: 'success', message: 'Role copied' });
    } catch {
      addToast({ type: 'error', message: 'Server could not copy the role' });
    }
  };

  const toggleStatus = async (role: Role) => {
    const status = role.status === 'active' ? 'inactive' : 'active';
    setRoles(prev => prev.map(item => item.id === role.id ? { ...item, status } : item));
    try {
      await rolesApi.update(role.id, { ...role, status });
      addToast({ type: 'success', message: 'Role status updated' });
    } catch {
      addToast({ type: 'error', message: 'Server could not update role status' });
    }
  };

  const deleteRole = async (role: Role) => {
    if (!confirm('Delete role?')) return;
    setRoles(prev => prev.filter(item => item.id !== role.id));
    try {
      await rolesApi.remove(role.id);
      addToast({ type: 'success', message: 'Role deleted' });
    } catch {
      addToast({ type: 'error', message: 'Server could not delete role' });
    }
  };

  const togglePerm = (moduleKey: string, perm: string) => {
    setRolePerms(prev => {
      const current = prev[moduleKey] || [];
      return { ...prev, [moduleKey]: current.includes(perm) ? current.filter(item => item !== perm) : [...current, perm] };
    });
  };

  const savePermissions = async () => {
    if (!showMatrix) return;
    try {
      await rolesApi.updatePermissions(showMatrix.id, rolePerms);
      addToast({ type: 'success', message: 'Permissions saved' });
      setShowMatrix(null);
    } catch {
      addToast({ type: 'error', message: 'Server could not save permissions' });
    }
  };

  return (
    <div style={{ fontFamily: 'Cairo, sans-serif' }}>
      <Header title="Roles & Permissions" breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Roles' }]} />
      <div style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
          <button onClick={() => { setEditItem(null); setForm({ name: '', description: '' }); setShowForm(true); }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', border: 'none', borderRadius: 10, background: '#D4AF37', fontWeight: 700 }}>
            <Plus size={15} /> New Role
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {roles.map(role => (
            <div key={role.id} style={{ background: '#fff', borderRadius: 14, padding: 18, border: '1px solid #F3F4F6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <strong>{role.name}</strong>
                <span style={{ color: role.status === 'active' ? '#16A34A' : '#DC2626' }}>{role.status}</span>
              </div>
              <p style={{ minHeight: 38, margin: '0 0 12px', color: '#6B7280', fontSize: 13 }}>{role.description}</p>
              <div style={{ marginBottom: 12, color: '#9CA3AF', fontSize: 12 }}>{role.users} users</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button onClick={() => openPermissions(role)}><Shield size={14} /></button>
                {!role.isSystem && <button onClick={() => openEdit(role)}><Edit size={14} /></button>}
                {!role.isSystem && <button onClick={() => cloneRole(role)}><Copy size={14} /></button>}
                {!role.isSystem && <button onClick={() => toggleStatus(role)}>{role.status === 'active' ? <PowerOff size={14} /> : <Power size={14} />}</button>}
                {!role.isSystem && <button onClick={() => deleteRole(role)}><Trash2 size={14} /></button>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showMatrix && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, width: 700, maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ margin: 0 }}>Permissions: {showMatrix.name}</h3>
              <button onClick={() => setShowMatrix(null)}><X size={18} /></button>
            </div>
            {PERMISSIONS.map(({ module, perms }) => (
              <div key={module} style={{ border: '1px solid #E5E7EB', borderRadius: 8, marginBottom: 10, overflow: 'hidden' }}>
                <div style={{ background: '#F9FAFB', padding: 10, fontWeight: 700 }}>{module}</div>
                <div style={{ padding: 10, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {perms.map(perm => {
                    const checked = (rolePerms[module] || []).includes(perm);
                    return (
                      <label key={perm} style={{ padding: '4px 10px', border: `1px solid ${checked ? '#D4AF37' : '#E5E7EB'}`, borderRadius: 20, cursor: 'pointer' }}>
                        <input type="checkbox" checked={checked} onChange={() => togglePerm(module, perm)} style={{ marginInlineEnd: 6 }} />
                        {perm}
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
            <button onClick={savePermissions} style={{ width: '100%', padding: 12, background: '#D4AF37', border: 'none', borderRadius: 8, fontWeight: 700 }}>Save Permissions</button>
          </div>
        </div>
      )}

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, width: 440 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ margin: 0 }}>{editItem ? 'Edit Role' : 'New Role'}</h3>
              <button onClick={() => setShowForm(false)}><X size={18} /></button>
            </div>
            <input value={form.name} onChange={event => setForm(prev => ({ ...prev, name: event.target.value }))} placeholder="Role name" style={{ width: '100%', boxSizing: 'border-box', marginBottom: 10, padding: 10 }} />
            <textarea value={form.description} onChange={event => setForm(prev => ({ ...prev, description: event.target.value }))} placeholder="Description" rows={3} style={{ width: '100%', boxSizing: 'border-box', marginBottom: 16, padding: 10 }} />
            <button onClick={save} style={{ width: '100%', padding: 12, background: '#D4AF37', border: 'none', borderRadius: 8, fontWeight: 700 }}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
}
