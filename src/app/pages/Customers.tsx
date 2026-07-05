import { useState } from 'react';
import { Plus, Search, Download, Edit, Trash2, Eye, X, TrendingUp, TrendingDown } from 'lucide-react';
import { Header } from '../components/Header';
import { CUSTOMERS } from '../data/mockData';
import { useApp } from '../context/AppContext';

type Customer = typeof CUSTOMERS[0];

export function Customers() {
  const { addToast } = useApp();
  const [search, setSearch] = useState('');
  const [customers, setCustomers] = useState<Customer[]>(CUSTOMERS);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Customer | null>(null);
  const [viewItem, setViewItem] = useState<Customer | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', group: 'تجزئة', credit: '10000' });

  const filtered = customers.filter(c => c.name.includes(search) || c.phone.includes(search) || c.email.includes(search));

  const openEdit = (c: Customer) => {
    setEditItem(c);
    setForm({ name: c.name, phone: c.phone, email: c.email, address: c.address, group: c.group, credit: String(c.credit) });
    setShowForm(true);
  };

  const save = () => {
    if (!form.name || !form.phone) { addToast({ type: 'error', message: 'الاسم والهاتف مطلوبان' }); return; }
    if (editItem) {
      setCustomers(prev => prev.map(c => c.id === editItem.id ? { ...c, ...form, credit: Number(form.credit) } : c));
      addToast({ type: 'success', message: 'تم تحديث العميل' });
    } else {
      setCustomers(prev => [...prev, { id: Date.now(), ...form, credit: Number(form.credit), balance: 0, purchases: 0, branch: 1 }]);
      addToast({ type: 'success', message: 'تم إضافة العميل' });
    }
    setShowForm(false); setEditItem(null);
  };

  const deleteItem = (id: number) => {
    if (!confirm('حذف العميل؟')) return;
    setCustomers(prev => prev.filter(c => c.id !== id));
    addToast({ type: 'success', message: 'تم الحذف' });
  };

  const totalBalance = customers.reduce((s, c) => s + c.balance, 0);
  const totalPurchases = customers.reduce((s, c) => s + c.purchases, 0);

  return (
    <div style={{ fontFamily: 'Cairo, sans-serif' }}>
      <Header title="العملاء" breadcrumbs={[{ label: 'الرئيسية', path: '/dashboard' }, { label: 'العملاء' }]} />
      <div style={{ padding: 24 }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'إجمالي العملاء', value: customers.length, color: '#3B82F6' },
            { label: 'إجمالي المشتريات', value: (totalPurchases / 1000).toFixed(0) + 'ك ج.م', color: '#D4AF37' },
            { label: 'أرصدة مدينة', value: customers.filter(c => c.balance > 0).length, color: '#EF4444' },
            { label: 'عملاء جملة', value: customers.filter(c => c.group === 'جملة').length, color: '#8B5CF6' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
              <p style={{ margin: '0 0 4px', fontSize: 12, color: '#9CA3AF' }}>{s.label}</p>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div style={{ background: '#fff', borderRadius: 14, padding: '16px 20px', marginBottom: 16, boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={15} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث بالاسم أو الهاتف..." style={{ width: '100%', padding: '9px 38px 9px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, fontFamily: 'Cairo, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <button onClick={() => addToast({ type: 'info', message: 'جارٍ التصدير...' })} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', border: '1px solid #E5E7EB', borderRadius: 8, background: '#F9FAFB', cursor: 'pointer', fontSize: 13, fontFamily: 'Cairo, sans-serif', color: '#6B7280' }}>
            <Download size={14} /> تصدير
          </button>
          <button onClick={() => { setEditItem(null); setForm({ name: '', phone: '', email: '', address: '', group: 'تجزئة', credit: '10000' }); setShowForm(true); }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', border: 'none', borderRadius: 8, background: 'linear-gradient(135deg, #D4AF37, #A07B20)', cursor: 'pointer', fontSize: 13, fontFamily: 'Cairo, sans-serif', fontWeight: 700, color: '#000' }}>
            <Plus size={14} /> عميل جديد
          </button>
        </div>

        {/* Customer Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {filtered.map(c => (
            <div key={c.id} style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, #D4AF37, #A07B20)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#000', fontWeight: 700 }}>
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#111827' }}>{c.name}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 12, color: '#9CA3AF' }}>{c.phone}</p>
                  </div>
                </div>
                <span style={{ background: c.group === 'جملة' ? '#EDE9FE' : '#F3F4F6', color: c.group === 'جملة' ? '#7C3AED' : '#6B7280', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{c.group}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                <div style={{ background: '#F9FAFB', borderRadius: 8, padding: '8px 12px' }}>
                  <p style={{ margin: '0 0 2px', fontSize: 11, color: '#9CA3AF' }}>إجمالي المشتريات</p>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#D4AF37' }}>{c.purchases.toLocaleString('ar-EG')} ج.م</p>
                </div>
                <div style={{ background: c.balance > 0 ? '#FFF5F5' : c.balance < 0 ? '#F0FDF4' : '#F9FAFB', borderRadius: 8, padding: '8px 12px' }}>
                  <p style={{ margin: '0 0 2px', fontSize: 11, color: '#9CA3AF' }}>الرصيد</p>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: c.balance > 0 ? '#DC2626' : c.balance < 0 ? '#16A34A' : '#6B7280' }}>
                    {c.balance > 0 ? '+' : ''}{c.balance.toLocaleString('ar-EG')} ج.م
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setViewItem(c)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '7px', border: '1px solid #E5E7EB', borderRadius: 8, background: '#F9FAFB', cursor: 'pointer', fontSize: 12, fontFamily: 'Cairo, sans-serif', color: '#6B7280' }}>
                  <Eye size={13} /> عرض
                </button>
                <button onClick={() => openEdit(c)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '7px', border: '1px solid #E5E7EB', borderRadius: 8, background: '#F9FAFB', cursor: 'pointer', fontSize: 12, fontFamily: 'Cairo, sans-serif', color: '#6B7280' }}>
                  <Edit size={13} /> تعديل
                </button>
                <button onClick={() => deleteItem(c.id)} style={{ padding: '7px 12px', border: '1px solid #FEE2E2', borderRadius: 8, background: '#FFF5F5', cursor: 'pointer', color: '#EF4444' }}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Detail Modal */}
      {viewItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 480, fontFamily: 'Cairo, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0 }}>بيانات العميل</h3>
              <button onClick={() => setViewItem(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                ['الاسم', viewItem.name],
                ['الهاتف', viewItem.phone],
                ['البريد', viewItem.email],
                ['العنوان', viewItem.address],
                ['المجموعة', viewItem.group],
                ['حد الائتمان', viewItem.credit.toLocaleString('ar-EG') + ' ج.م'],
                ['الرصيد الحالي', (viewItem.balance > 0 ? 'مدين ' : 'دائن ') + Math.abs(viewItem.balance).toLocaleString('ar-EG') + ' ج.م'],
                ['إجمالي المشتريات', viewItem.purchases.toLocaleString('ar-EG') + ' ج.م'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#F9FAFB', borderRadius: 8 }}>
                  <span style={{ fontSize: 13, color: '#9CA3AF' }}>{k}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{v}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setViewItem(null)} style={{ marginTop: 20, width: '100%', padding: 12, background: '#F3F4F6', border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'Cairo, sans-serif' }}>إغلاق</button>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 480, fontFamily: 'Cairo, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0 }}>{editItem ? 'تعديل العميل' : 'عميل جديد'}</h3>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[['name', 'الاسم *', 'text'], ['phone', 'الهاتف *', 'tel'], ['email', 'البريد الإلكتروني', 'email'], ['address', 'العنوان', 'text'], ['credit', 'حد الائتمان (ج.م)', 'number']].map(([k, label, type]) => (
                <div key={k}>
                  <label style={{ display: 'block', fontSize: 13, color: '#374151', marginBottom: 5 }}>{label}</label>
                  <input type={type} value={form[k as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, fontFamily: 'Cairo, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#374151', marginBottom: 5 }}>المجموعة</label>
                <select value={form.group} onChange={e => setForm(f => ({ ...f, group: e.target.value }))} style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, fontFamily: 'Cairo, sans-serif', outline: 'none' }}>
                  <option value="تجزئة">تجزئة</option>
                  <option value="جملة">جملة</option>
                </select>
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
