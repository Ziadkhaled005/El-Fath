import { useState } from 'react';
import { Plus, Edit, Trash2, X, Power, PowerOff, MapPin, Phone, Users } from 'lucide-react';
import { Header } from '../components/Header';
import { BRANCHES } from '../data/mockData';
import { useApp } from '../context/AppContext';

type Branch = typeof BRANCHES[0];

export function Branches() {
  const { addToast } = useApp();
  const [branches, setBranches] = useState<Branch[]>(BRANCHES);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Branch | null>(null);
  const [form, setForm] = useState({ name: '', city: '', phone: '', manager: '' });

  const openEdit = (b: Branch) => {
    setEditItem(b);
    setForm({ name: b.name, city: b.city, phone: b.phone, manager: b.manager });
    setShowForm(true);
  };

  const save = () => {
    if (!form.name) { addToast({ type: 'error', message: 'اسم الفرع مطلوب' }); return; }
    if (editItem) {
      setBranches(prev => prev.map(b => b.id === editItem.id ? { ...b, ...form } : b));
      addToast({ type: 'success', message: 'تم تحديث بيانات الفرع' });
    } else {
      setBranches(prev => [...prev, { id: Date.now(), ...form, status: 'active', employees: 0, sales: 0 }]);
      addToast({ type: 'success', message: 'تم إضافة الفرع الجديد' });
    }
    setShowForm(false); setEditItem(null);
  };

  const toggleStatus = (id: number) => {
    setBranches(prev => prev.map(b => b.id === id ? { ...b, status: b.status === 'active' ? 'inactive' : 'active' } : b));
    addToast({ type: 'success', message: 'تم تحديث حالة الفرع' });
  };

  const deleteBranch = (id: number) => {
    if (!confirm('هل تريد حذف هذا الفرع؟ سيتم حذف جميع البيانات المرتبطة به.')) return;
    setBranches(prev => prev.filter(b => b.id !== id));
    addToast({ type: 'success', message: 'تم حذف الفرع' });
  };

  return (
    <div style={{ fontFamily: 'Cairo, sans-serif' }}>
      <Header title="إدارة الفروع" breadcrumbs={[{ label: 'الرئيسية', path: '/dashboard' }, { label: 'الفروع' }]} />
      <div style={{ padding: 24 }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'إجمالي الفروع', value: branches.length, color: '#3B82F6' },
            { label: 'فروع نشطة', value: branches.filter(b => b.status === 'active').length, color: '#10B981' },
            { label: 'فروع غير نشطة', value: branches.filter(b => b.status === 'inactive').length, color: '#EF4444' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
              <p style={{ margin: '0 0 4px', fontSize: 12, color: '#9CA3AF' }}>{s.label}</p>
              <p style={{ margin: 0, fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <button onClick={() => { setEditItem(null); setForm({ name: '', city: '', phone: '', manager: '' }); setShowForm(true); }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', border: 'none', borderRadius: 10, background: 'linear-gradient(135deg, #D4AF37, #A07B20)', cursor: 'pointer', fontSize: 13, fontFamily: 'Cairo, sans-serif', fontWeight: 700, color: '#000' }}>
            <Plus size={15} /> إضافة فرع جديد
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {branches.map(b => (
            <div key={b.id} style={{ background: '#fff', borderRadius: 16, padding: '20px 22px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6', position: 'relative', overflow: 'hidden' }}>
              {/* Status indicator */}
              <div style={{ position: 'absolute', top: 0, right: 0, width: 4, height: '100%', background: b.status === 'active' ? '#10B981' : '#9CA3AF', borderRadius: '0 16px 16px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700, color: '#111827' }}>{b.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={12} color="#9CA3AF" />
                    <span style={{ fontSize: 12, color: '#9CA3AF' }}>{b.city}</span>
                  </div>
                </div>
                <span style={{ background: b.status === 'active' ? '#DCFCE7' : '#F3F4F6', color: b.status === 'active' ? '#16A34A' : '#9CA3AF', padding: '3px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                  {b.status === 'active' ? 'نشط' : 'غير نشط'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                <div style={{ background: '#F9FAFB', borderRadius: 10, padding: '10px 12px' }}>
                  <p style={{ margin: '0 0 2px', fontSize: 11, color: '#9CA3AF' }}>المدير</p>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#111827' }}>{b.manager}</p>
                </div>
                <div style={{ background: '#F9FAFB', borderRadius: 10, padding: '10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                    <Phone size={11} color="#9CA3AF" />
                    <p style={{ margin: 0, fontSize: 11, color: '#9CA3AF' }}>الهاتف</p>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#111827' }}>{b.phone}</p>
                </div>
                <div style={{ background: '#FFF9E6', borderRadius: 10, padding: '10px 12px' }}>
                  <p style={{ margin: '0 0 2px', fontSize: 11, color: '#9CA3AF' }}>المبيعات</p>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#D4AF37' }}>{(b.sales / 1000).toFixed(0)}ك ج.م</p>
                </div>
                <div style={{ background: '#F0F7FF', borderRadius: 10, padding: '10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                    <Users size={11} color="#9CA3AF" />
                    <p style={{ margin: 0, fontSize: 11, color: '#9CA3AF' }}>الموظفون</p>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#3B82F6' }}>{b.employees} موظف</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => toggleStatus(b.id)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '8px', border: `1px solid ${b.status === 'active' ? '#FEE2E2' : '#DCFCE7'}`, borderRadius: 8, background: b.status === 'active' ? '#FFF5F5' : '#F0FDF4', cursor: 'pointer', fontSize: 12, fontFamily: 'Cairo, sans-serif', color: b.status === 'active' ? '#EF4444' : '#16A34A' }}>
                  {b.status === 'active' ? <><PowerOff size={13} /> تعطيل</> : <><Power size={13} /> تفعيل</>}
                </button>
                <button onClick={() => openEdit(b)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '8px', border: '1px solid #E5E7EB', borderRadius: 8, background: '#F9FAFB', cursor: 'pointer', fontSize: 12, fontFamily: 'Cairo, sans-serif', color: '#6B7280' }}>
                  <Edit size={13} /> تعديل
                </button>
                <button onClick={() => deleteBranch(b.id)} style={{ padding: '8px 12px', border: '1px solid #FEE2E2', borderRadius: 8, background: '#FFF5F5', cursor: 'pointer', color: '#EF4444' }}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 460, fontFamily: 'Cairo, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0 }}>{editItem ? 'تعديل بيانات الفرع' : 'فرع جديد'}</h3>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[['name', 'اسم الفرع *', 'text'], ['city', 'المدينة', 'text'], ['phone', 'الهاتف', 'tel'], ['manager', 'اسم المدير', 'text']].map(([k, label, type]) => (
                <div key={k}>
                  <label style={{ display: 'block', fontSize: 13, color: '#374151', marginBottom: 5 }}>{label}</label>
                  <input type={type} value={form[k as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, fontFamily: 'Cairo, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
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
