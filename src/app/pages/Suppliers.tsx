import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, X, Download } from 'lucide-react';
import { Header } from '../components/Header';
import { SUPPLIERS } from '../data/mockData';
import { useApp } from '../context/AppContext';

type Supplier = typeof SUPPLIERS[0];

export function Suppliers() {
  const { addToast } = useApp();
  const [search, setSearch] = useState('');
  const [suppliers, setSuppliers] = useState<Supplier[]>(SUPPLIERS);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Supplier | null>(null);
  const [viewItem, setViewItem] = useState<Supplier | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '' });

  const filtered = suppliers.filter(s => s.name.includes(search) || s.phone.includes(search));

  const openEdit = (s: Supplier) => {
    setEditItem(s);
    setForm({ name: s.name, phone: s.phone, email: s.email, address: s.address });
    setShowForm(true);
  };

  const save = () => {
    if (!form.name) { addToast({ type: 'error', message: 'الاسم مطلوب' }); return; }
    if (editItem) {
      setSuppliers(prev => prev.map(s => s.id === editItem.id ? { ...s, ...form } : s));
      addToast({ type: 'success', message: 'تم التحديث' });
    } else {
      setSuppliers(prev => [...prev, { id: Date.now(), ...form, balance: 0, purchases: 0 }]);
      addToast({ type: 'success', message: 'تم الإضافة' });
    }
    setShowForm(false); setEditItem(null);
  };

  return (
    <div style={{ fontFamily: 'Cairo, sans-serif' }}>
      <Header title="الموردون" breadcrumbs={[{ label: 'الرئيسية', path: '/dashboard' }, { label: 'الموردون' }]} />
      <div style={{ padding: 24 }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'إجمالي الموردين', value: suppliers.length, color: '#3B82F6' },
            { label: 'إجمالي المشتريات', value: (suppliers.reduce((s, v) => s + v.purchases, 0) / 1000).toFixed(0) + 'ك ج.م', color: '#D4AF37' },
            { label: 'أرصدة مستحقة', value: suppliers.filter(s => s.balance > 0).length, color: '#EF4444' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
              <p style={{ margin: '0 0 4px', fontSize: 12, color: '#9CA3AF' }}>{s.label}</p>
              <p style={{ margin: 0, fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div style={{ background: '#fff', borderRadius: 14, padding: '16px 20px', marginBottom: 16, boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={15} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث..." style={{ width: '100%', padding: '9px 38px 9px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, fontFamily: 'Cairo, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <button onClick={() => addToast({ type: 'info', message: 'جارٍ التصدير...' })} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', border: '1px solid #E5E7EB', borderRadius: 8, background: '#F9FAFB', cursor: 'pointer', fontSize: 13, fontFamily: 'Cairo, sans-serif', color: '#6B7280' }}>
            <Download size={14} /> تصدير
          </button>
          <button onClick={() => { setEditItem(null); setForm({ name: '', phone: '', email: '', address: '' }); setShowForm(true); }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', border: 'none', borderRadius: 8, background: 'linear-gradient(135deg, #D4AF37, #A07B20)', cursor: 'pointer', fontSize: 13, fontFamily: 'Cairo, sans-serif', fontWeight: 700, color: '#000' }}>
            <Plus size={14} /> مورد جديد
          </button>
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {filtered.map(s => (
            <div key={s.id} style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🏭</div>
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#111827' }}>{s.name}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: '#9CA3AF' }}>{s.phone}</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                <div style={{ background: '#F9FAFB', borderRadius: 8, padding: '8px 12px' }}>
                  <p style={{ margin: '0 0 2px', fontSize: 11, color: '#9CA3AF' }}>إجمالي المشتريات</p>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#D4AF37' }}>{s.purchases.toLocaleString('ar-EG')} ج.م</p>
                </div>
                <div style={{ background: s.balance > 0 ? '#FFF5F5' : '#F9FAFB', borderRadius: 8, padding: '8px 12px' }}>
                  <p style={{ margin: '0 0 2px', fontSize: 11, color: '#9CA3AF' }}>الرصيد المستحق</p>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: s.balance > 0 ? '#DC2626' : '#16A34A' }}>{s.balance.toLocaleString('ar-EG')} ج.م</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setViewItem(s)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '7px', border: '1px solid #E5E7EB', borderRadius: 8, background: '#F9FAFB', cursor: 'pointer', fontSize: 12, fontFamily: 'Cairo, sans-serif', color: '#6B7280' }}>
                  <Eye size={13} /> عرض
                </button>
                <button onClick={() => openEdit(s)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '7px', border: '1px solid #E5E7EB', borderRadius: 8, background: '#F9FAFB', cursor: 'pointer', fontSize: 12, fontFamily: 'Cairo, sans-serif', color: '#6B7280' }}>
                  <Edit size={13} /> تعديل
                </button>
                <button onClick={() => { if (confirm('حذف المورد؟')) { setSuppliers(p => p.filter(x => x.id !== s.id)); addToast({ type: 'success', message: 'تم الحذف' }); } }} style={{ padding: '7px 12px', border: '1px solid #FEE2E2', borderRadius: 8, background: '#FFF5F5', cursor: 'pointer', color: '#EF4444' }}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {viewItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 440, fontFamily: 'Cairo, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ margin: 0 }}>بيانات المورد</h3>
              <button onClick={() => setViewItem(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            {[['الاسم', viewItem.name], ['الهاتف', viewItem.phone], ['البريد', viewItem.email], ['العنوان', viewItem.address], ['رصيد مستحق', viewItem.balance.toLocaleString('ar-EG') + ' ج.م'], ['إجمالي المشتريات', viewItem.purchases.toLocaleString('ar-EG') + ' ج.م']].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#F9FAFB', borderRadius: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: '#9CA3AF' }}>{k}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{v}</span>
              </div>
            ))}
            <button onClick={() => setViewItem(null)} style={{ marginTop: 12, width: '100%', padding: 12, background: '#F3F4F6', border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'Cairo, sans-serif' }}>إغلاق</button>
          </div>
        </div>
      )}

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 440, fontFamily: 'Cairo, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ margin: 0 }}>{editItem ? 'تعديل المورد' : 'مورد جديد'}</h3>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            {[['name', 'الاسم *', 'text'], ['phone', 'الهاتف', 'tel'], ['email', 'البريد', 'email'], ['address', 'العنوان', 'text']].map(([k, label, type]) => (
              <div key={k} style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 13, color: '#374151', marginBottom: 5 }}>{label}</label>
                <input type={type} value={form[k as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, fontFamily: 'Cairo, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button onClick={save} style={{ flex: 1, padding: 12, background: 'linear-gradient(135deg, #D4AF37, #A07B20)', border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'Cairo, sans-serif', fontWeight: 700, color: '#000' }}>حفظ</button>
              <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: 12, background: '#F3F4F6', border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'Cairo, sans-serif', color: '#374151' }}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
