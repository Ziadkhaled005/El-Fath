import { useState } from 'react';
import { Plus, Edit, Trash2, X, Lock, Power, PowerOff } from 'lucide-react';
import { Header } from '../components/Header';
import { USERS, ROLES, BRANCHES } from '../data/mockData';
import { useApp } from '../context/AppContext';

type User = typeof USERS[0];

export function Users() {
  const { addToast } = useApp();
  const [users, setUsers] = useState<User[]>(USERS);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<User | null>(null);
  const [form, setForm] = useState({ name: '', username: '', email: '', role: 'كاشير', branch: 'الرئيسي' });

  const openEdit = (u: User) => {
    setEditItem(u);
    setForm({ name: u.name, username: u.username, email: u.email, role: u.role, branch: u.branch });
    setShowForm(true);
  };

  const save = () => {
    if (!form.name || !form.username) { addToast({ type: 'error', message: 'الاسم واسم المستخدم مطلوبان' }); return; }
    if (editItem) {
      setUsers(prev => prev.map(u => u.id === editItem.id ? { ...u, ...form } : u));
      addToast({ type: 'success', message: 'تم تحديث بيانات المستخدم' });
    } else {
      setUsers(prev => [...prev, { id: Date.now(), ...form, status: 'active', lastLogin: 'لم يسجل دخوله بعد' }]);
      addToast({ type: 'success', message: 'تم إضافة المستخدم وإرسال بيانات الدخول' });
    }
    setShowForm(false); setEditItem(null);
  };

  const toggleStatus = (id: number) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
    addToast({ type: 'success', message: 'تم تحديث حالة المستخدم' });
  };

  const resetPassword = (name: string) => {
    addToast({ type: 'info', message: `تم إرسال رابط إعادة تعيين كلمة المرور إلى ${name}` });
  };

  return (
    <div style={{ fontFamily: 'Cairo, sans-serif' }}>
      <Header title="إدارة المستخدمين" breadcrumbs={[{ label: 'الرئيسية', path: '/dashboard' }, { label: 'المستخدمون' }]} />
      <div style={{ padding: 24 }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'إجمالي المستخدمين', value: users.length, color: '#3B82F6' },
            { label: 'نشطون', value: users.filter(u => u.status === 'active').length, color: '#10B981' },
            { label: 'معطلون', value: users.filter(u => u.status === 'inactive').length, color: '#EF4444' },
            { label: 'الأدوار', value: ROLES.length, color: '#D4AF37' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
              <p style={{ margin: '0 0 4px', fontSize: 12, color: '#9CA3AF' }}>{s.label}</p>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <button onClick={() => { setEditItem(null); setForm({ name: '', username: '', email: '', role: 'كاشير', branch: 'الرئيسي' }); setShowForm(true); }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', border: 'none', borderRadius: 10, background: 'linear-gradient(135deg, #D4AF37, #A07B20)', cursor: 'pointer', fontSize: 13, fontFamily: 'Cairo, sans-serif', fontWeight: 700, color: '#000' }}>
            <Plus size={15} /> مستخدم جديد
          </button>
        </div>

        <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                {['المستخدم', 'اسم الدخول', 'الدور', 'الفرع', 'آخر دخول', 'الحالة', 'الإجراءات'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'Cairo, sans-serif' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: u.status === 'active' ? 'linear-gradient(135deg, #D4AF37, #A07B20)' : '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: u.status === 'active' ? '#000' : '#9CA3AF', fontWeight: 700 }}>
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#111827' }}>{u.name}</p>
                        <p style={{ margin: 0, fontSize: 11, color: '#9CA3AF' }}>{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#6B7280', fontFamily: 'monospace' }}>{u.username}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ background: '#EDE9FE', color: '#7C3AED', padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{u.role}</span>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#374151' }}>{u.branch}</td>
                  <td style={{ padding: '12px 14px', fontSize: 12, color: '#9CA3AF' }}>{u.lastLogin}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ background: u.status === 'active' ? '#DCFCE7' : '#FEE2E2', color: u.status === 'active' ? '#16A34A' : '#DC2626', padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                      {u.status === 'active' ? 'نشط' : 'معطل'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button onClick={() => openEdit(u)} style={{ width: 30, height: 30, borderRadius: 6, border: '1px solid #E5E7EB', background: '#F9FAFB', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Edit size={13} color="#6B7280" />
                      </button>
                      <button onClick={() => resetPassword(u.name)} style={{ width: 30, height: 30, borderRadius: 6, border: '1px solid #DBEAFE', background: '#EFF6FF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="إعادة تعيين كلمة المرور">
                        <Lock size={13} color="#3B82F6" />
                      </button>
                      <button onClick={() => toggleStatus(u.id)} style={{ width: 30, height: 30, borderRadius: 6, border: `1px solid ${u.status === 'active' ? '#FEE2E2' : '#DCFCE7'}`, background: u.status === 'active' ? '#FFF5F5' : '#F0FDF4', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {u.status === 'active' ? <PowerOff size={13} color="#EF4444" /> : <Power size={13} color="#10B981" />}
                      </button>
                      <button onClick={() => { if (confirm('حذف المستخدم؟')) { setUsers(prev => prev.filter(x => x.id !== u.id)); addToast({ type: 'success', message: 'تم الحذف' }); } }} style={{ width: 30, height: 30, borderRadius: 6, border: '1px solid #FEE2E2', background: '#FFF5F5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Trash2 size={13} color="#EF4444" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 480, fontFamily: 'Cairo, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0 }}>{editItem ? 'تعديل المستخدم' : 'مستخدم جديد'}</h3>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[['name', 'الاسم الكامل *', 'text'], ['username', 'اسم الدخول *', 'text'], ['email', 'البريد الإلكتروني', 'email']].map(([k, label, type]) => (
                <div key={k}>
                  <label style={{ display: 'block', fontSize: 13, color: '#374151', marginBottom: 5 }}>{label}</label>
                  <input type={type} value={form[k as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, fontFamily: 'Cairo, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#374151', marginBottom: 5 }}>الدور</label>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, fontFamily: 'Cairo, sans-serif', outline: 'none' }}>
                  {ROLES.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#374151', marginBottom: 5 }}>الفرع</label>
                <select value={form.branch} onChange={e => setForm(f => ({ ...f, branch: e.target.value }))} style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, fontFamily: 'Cairo, sans-serif', outline: 'none' }}>
                  <option value="الكل">جميع الفروع</option>
                  {BRANCHES.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                </select>
              </div>
              {!editItem && (
                <div style={{ background: '#FFF9E6', border: '1px solid #FDE68A', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#92400E' }}>
                  ⚠️ سيتم إرسال كلمة مرور مؤقتة إلى البريد الإلكتروني للمستخدم
                </div>
              )}
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
