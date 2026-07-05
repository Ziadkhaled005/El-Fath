import { useState } from 'react';
import { Plus, Edit, Trash2, X, Copy, Power, PowerOff, Shield } from 'lucide-react';
import { Header } from '../components/Header';
import { ROLES } from '../data/mockData';
import { useApp } from '../context/AppContext';

type Role = typeof ROLES[0];

const PERMISSIONS = [
  { module: 'المبيعات', key: 'sales', perms: ['عرض', 'إنشاء', 'تعديل', 'حذف', 'طباعة', 'تصدير', 'موافقة'] },
  { module: 'المشتريات', key: 'purchases', perms: ['عرض', 'إنشاء', 'تعديل', 'حذف', 'موافقة'] },
  { module: 'المخزون', key: 'inventory', perms: ['عرض', 'إضافة', 'تعديل', 'حذف', 'تعديل مخزون'] },
  { module: 'العملاء', key: 'customers', perms: ['عرض', 'إنشاء', 'تعديل', 'حذف'] },
  { module: 'الموردون', key: 'suppliers', perms: ['عرض', 'إنشاء', 'تعديل', 'حذف'] },
  { module: 'المصروفات', key: 'expenses', perms: ['عرض', 'إنشاء', 'موافقة', 'رفض'] },
  { module: 'المحاسبة', key: 'accounting', perms: ['عرض', 'إنشاء', 'تعديل'] },
  { module: 'التقارير', key: 'reports', perms: ['عرض', 'تصدير', 'طباعة'] },
  { module: 'الإعدادات', key: 'settings', perms: ['وصول كامل'] },
  { module: 'المستخدمون', key: 'users', perms: ['عرض', 'إنشاء', 'تعديل', 'حذف'] },
];

export function Roles() {
  const { addToast } = useApp();
  const [roles, setRoles] = useState<Role[]>(ROLES);
  const [showForm, setShowForm] = useState(false);
  const [showMatrix, setShowMatrix] = useState<Role | null>(null);
  const [editItem, setEditItem] = useState<Role | null>(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [rolePerms, setRolePerms] = useState<Record<string, string[]>>({});

  const openEdit = (r: Role) => {
    setEditItem(r);
    setForm({ name: r.name, description: r.description });
    setShowForm(true);
  };

  const cloneRole = (r: Role) => {
    const newRole = { ...r, id: Date.now(), name: r.name + ' (نسخة)', users: 0, isSystem: false };
    setRoles(prev => [...prev, newRole]);
    addToast({ type: 'success', message: 'تم نسخ الدور بنجاح' });
  };

  const save = () => {
    if (!form.name) { addToast({ type: 'error', message: 'اسم الدور مطلوب' }); return; }
    if (editItem) {
      setRoles(prev => prev.map(r => r.id === editItem.id ? { ...r, ...form } : r));
      addToast({ type: 'success', message: 'تم تحديث الدور' });
    } else {
      setRoles(prev => [...prev, { id: Date.now(), ...form, users: 0, status: 'active', isSystem: false }]);
      addToast({ type: 'success', message: 'تم إنشاء الدور الجديد' });
    }
    setShowForm(false); setEditItem(null);
  };

  const togglePerm = (moduleKey: string, perm: string) => {
    setRolePerms(prev => {
      const current = prev[moduleKey] || [];
      return {
        ...prev,
        [moduleKey]: current.includes(perm)
          ? current.filter(p => p !== perm)
          : [...current, perm],
      };
    });
  };

  return (
    <div style={{ fontFamily: 'Cairo, sans-serif' }}>
      <Header title="الأدوار والصلاحيات" breadcrumbs={[{ label: 'الرئيسية', path: '/dashboard' }, { label: 'الأدوار والصلاحيات' }]} />
      <div style={{ padding: 24 }}>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
          <button onClick={() => { setEditItem(null); setForm({ name: '', description: '' }); setShowForm(true); }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', border: 'none', borderRadius: 10, background: 'linear-gradient(135deg, #D4AF37, #A07B20)', cursor: 'pointer', fontSize: 13, fontFamily: 'Cairo, sans-serif', fontWeight: 700, color: '#000' }}>
            <Plus size={15} /> إنشاء دور جديد
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {roles.map(r => (
            <div key={r.id} style={{ background: '#fff', borderRadius: 16, padding: '20px 22px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: r.isSystem ? 'linear-gradient(135deg, #D4AF37, #A07B20)' : '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Shield size={18} color={r.isSystem ? '#000' : '#7C3AED'} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#111827' }}>{r.name}</p>
                    {r.isSystem && <span style={{ fontSize: 10, color: '#D4AF37', fontWeight: 600 }}>دور النظام</span>}
                  </div>
                </div>
                <span style={{ background: r.status === 'active' ? '#DCFCE7' : '#FEE2E2', color: r.status === 'active' ? '#16A34A' : '#DC2626', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                  {r.status === 'active' ? 'مفعل' : 'معطل'}
                </span>
              </div>

              <p style={{ margin: '0 0 12px', fontSize: 13, color: '#6B7280' }}>{r.description}</p>

              <div style={{ display: 'flex', justifyContent: 'space-between', background: '#F9FAFB', borderRadius: 8, padding: '8px 12px', marginBottom: 14 }}>
                <span style={{ fontSize: 12, color: '#9CA3AF' }}>عدد المستخدمين</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{r.users} مستخدم</span>
              </div>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button onClick={() => { setShowMatrix(r); setRolePerms({}); }} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '7px 10px', border: '1px solid #DBEAFE', borderRadius: 8, background: '#EFF6FF', cursor: 'pointer', fontSize: 11, fontFamily: 'Cairo, sans-serif', color: '#3B82F6' }}>
                  <Shield size={12} /> الصلاحيات
                </button>
                {!r.isSystem && (
                  <>
                    <button onClick={() => openEdit(r)} style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid #E5E7EB', background: '#F9FAFB', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Edit size={13} color="#6B7280" />
                    </button>
                    <button onClick={() => cloneRole(r)} style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid #E5E7EB', background: '#F9FAFB', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="نسخ الدور">
                      <Copy size={13} color="#6B7280" />
                    </button>
                    <button onClick={() => { setRoles(prev => prev.map(x => x.id === r.id ? { ...x, status: x.status === 'active' ? 'inactive' : 'active' } : x)); addToast({ type: 'success', message: 'تم تحديث حالة الدور' }); }} style={{ width: 32, height: 32, borderRadius: 6, border: `1px solid ${r.status === 'active' ? '#FEE2E2' : '#DCFCE7'}`, background: r.status === 'active' ? '#FFF5F5' : '#F0FDF4', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {r.status === 'active' ? <PowerOff size={13} color="#EF4444" /> : <Power size={13} color="#10B981" />}
                    </button>
                    <button onClick={() => { if (confirm('حذف الدور؟')) { setRoles(prev => prev.filter(x => x.id !== r.id)); addToast({ type: 'success', message: 'تم الحذف' }); } }} style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid #FEE2E2', background: '#FFF5F5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Trash2 size={13} color="#EF4444" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Permission Matrix Modal */}
      {showMatrix && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 700, maxHeight: '85vh', overflowY: 'auto', fontFamily: 'Cairo, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0 }}>صلاحيات: {showMatrix.name}</h3>
              <button onClick={() => setShowMatrix(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <p style={{ margin: '0 0 16px', fontSize: 13, color: '#9CA3AF' }}>قم بتحديد الصلاحيات التي يملكها هذا الدور في كل وحدة من وحدات النظام</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {PERMISSIONS.map(({ module, key, perms }) => (
                <div key={key} style={{ border: '1px solid #E5E7EB', borderRadius: 10, overflow: 'hidden' }}>
                  <div style={{ background: '#F9FAFB', padding: '10px 14px', fontSize: 13, fontWeight: 700, color: '#374151' }}>{module}</div>
                  <div style={{ padding: '12px 14px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {perms.map(p => {
                      const checked = (rolePerms[key] || []).includes(p);
                      return (
                        <label key={p} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', padding: '4px 10px', border: `1px solid ${checked ? '#D4AF37' : '#E5E7EB'}`, borderRadius: 20, background: checked ? '#FFF9E6' : '#F9FAFB', fontSize: 12, color: checked ? '#92400E' : '#6B7280', transition: 'all 0.15s' }}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => togglePerm(key, p)}
                            style={{ display: 'none' }}
                          />
                          {checked && <span style={{ color: '#D4AF37' }}>✓</span>}
                          {p}
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={() => { addToast({ type: 'success', message: 'تم حفظ الصلاحيات بنجاح' }); setShowMatrix(null); }} style={{ flex: 1, padding: 12, background: 'linear-gradient(135deg, #D4AF37, #A07B20)', border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'Cairo, sans-serif', fontWeight: 700, color: '#000' }}>حفظ الصلاحيات</button>
              <button onClick={() => setShowMatrix(null)} style={{ flex: 1, padding: 12, background: '#F3F4F6', border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'Cairo, sans-serif', color: '#374151' }}>إغلاق</button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 440, fontFamily: 'Cairo, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0 }}>{editItem ? 'تعديل الدور' : 'دور جديد'}</h3>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#374151', marginBottom: 5 }}>اسم الدور *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, fontFamily: 'Cairo, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#374151', marginBottom: 5 }}>الوصف</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, fontFamily: 'Cairo, sans-serif', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={save} style={{ flex: 1, padding: 12, background: 'linear-gradient(135deg, #D4AF37, #A07B20)', border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'Cairo, sans-serif', fontWeight: 700, color: '#000' }}>حفظ</button>
              <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: 12, background: '#F3F4F6', border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'Cairo, sans-serif', color: '#374151' }}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
