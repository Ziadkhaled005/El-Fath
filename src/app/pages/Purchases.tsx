import { useState } from 'react';
import { Plus, Search, Download, Printer, Eye, CheckCircle, XCircle, Clock, X } from 'lucide-react';
import { Header } from '../components/Header';
import { PURCHASES, SUPPLIERS } from '../data/mockData';
import { useApp } from '../context/AppContext';

const STATUS = {
  approved: { bg: '#DCFCE7', color: '#16A34A', label: 'معتمد', icon: CheckCircle },
  pending: { bg: '#FEF3C7', color: '#D97706', label: 'معلق', icon: Clock },
  rejected: { bg: '#FEE2E2', color: '#DC2626', label: 'مرفوض', icon: XCircle },
};

export function Purchases() {
  const { addToast } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [purchases, setPurchases] = useState(PURCHASES);
  const [showNew, setShowNew] = useState(false);
  const [viewItem, setViewItem] = useState<typeof PURCHASES[0] | null>(null);
  const [newForm, setNewForm] = useState({ supplier: '', items: '1', total: '', notes: '' });
  const [page, setPage] = useState(1);

  const filtered = purchases.filter(p =>
    (p.id.includes(search) || p.supplier.includes(search)) &&
    (!statusFilter || p.status === statusFilter)
  );

  const approve = (id: string) => {
    setPurchases(prev => prev.map(p => p.id === id ? { ...p, status: 'approved' } : p));
    addToast({ type: 'success', message: 'تمت الموافقة على طلب الشراء' });
  };

  const reject = (id: string) => {
    setPurchases(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected' } : p));
    addToast({ type: 'error', message: 'تم رفض طلب الشراء' });
  };

  const addPurchase = () => {
    if (!newForm.supplier || !newForm.total) { addToast({ type: 'error', message: 'يرجى ملء الحقول المطلوبة' }); return; }
    const newP = {
      id: `PO-2024-00${purchases.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      supplier: newForm.supplier,
      branch: 'الرئيسي',
      total: parseFloat(newForm.total),
      status: 'pending' as const,
      items: parseInt(newForm.items),
    };
    setPurchases(prev => [newP, ...prev]);
    setShowNew(false);
    setNewForm({ supplier: '', items: '1', total: '', notes: '' });
    addToast({ type: 'success', message: 'تم إضافة طلب الشراء بنجاح' });
  };

  return (
    <div style={{ fontFamily: 'Cairo, sans-serif' }}>
      <Header title="المشتريات" breadcrumbs={[{ label: 'الرئيسية', path: '/dashboard' }, { label: 'المشتريات' }]} />
      <div style={{ padding: 24 }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'معلقة - بانتظار الموافقة', value: purchases.filter(p => p.status === 'pending').length, color: '#F59E0B' },
            { label: 'معتمدة', value: purchases.filter(p => p.status === 'approved').length, color: '#10B981' },
            { label: 'مرفوضة', value: purchases.filter(p => p.status === 'rejected').length, color: '#EF4444' },
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
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '9px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, fontFamily: 'Cairo, sans-serif', outline: 'none' }}>
            <option value="">جميع الحالات</option>
            <option value="pending">معلق</option>
            <option value="approved">معتمد</option>
            <option value="rejected">مرفوض</option>
          </select>
          <button onClick={() => addToast({ type: 'info', message: 'جارٍ التصدير...' })} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', border: '1px solid #E5E7EB', borderRadius: 8, background: '#F9FAFB', cursor: 'pointer', fontSize: 13, fontFamily: 'Cairo, sans-serif', color: '#6B7280' }}>
            <Download size={14} /> تصدير
          </button>
          <button onClick={() => setShowNew(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', border: 'none', borderRadius: 8, background: 'linear-gradient(135deg, #D4AF37, #A07B20)', cursor: 'pointer', fontSize: 13, fontFamily: 'Cairo, sans-serif', fontWeight: 700, color: '#000' }}>
            <Plus size={14} /> طلب شراء جديد
          </button>
        </div>

        {/* Table */}
        <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                {['رقم الطلب', 'التاريخ', 'المورد', 'الفرع', 'الإجمالي', 'الحالة', 'الإجراءات'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'right', fontSize: 13, fontWeight: 600, color: '#374151', fontFamily: 'Cairo, sans-serif' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const s = STATUS[p.status as keyof typeof STATUS];
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#D4AF37', fontWeight: 600 }}>{p.id}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#374151' }}>{p.date}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#111827', fontWeight: 500 }}>{p.supplier}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#6B7280' }}>{p.branch}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700 }}>{p.total.toLocaleString('ar-EG')} ج.م</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{s.label}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => setViewItem(p)} style={{ width: 30, height: 30, borderRadius: 6, border: '1px solid #E5E7EB', background: '#F9FAFB', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Eye size={13} color="#6B7280" /></button>
                        {p.status === 'pending' && (
                          <>
                            <button onClick={() => approve(p.id)} style={{ width: 30, height: 30, borderRadius: 6, border: '1px solid #DCFCE7', background: '#F0FDF4', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircle size={13} color="#16A34A" /></button>
                            <button onClick={() => reject(p.id)} style={{ width: 30, height: 30, borderRadius: 6, border: '1px solid #FEE2E2', background: '#FFF5F5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><XCircle size={13} color="#EF4444" /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New purchase modal */}
      {showNew && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 480, fontFamily: 'Cairo, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0 }}>طلب شراء جديد</h3>
              <button onClick={() => setShowNew(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#374151', marginBottom: 6 }}>المورد *</label>
                <select value={newForm.supplier} onChange={e => setNewForm(f => ({ ...f, supplier: e.target.value }))} style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, fontFamily: 'Cairo, sans-serif', outline: 'none' }}>
                  <option value="">-- اختر المورد --</option>
                  {SUPPLIERS.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#374151', marginBottom: 6 }}>عدد الأصناف</label>
                <input type="number" value={newForm.items} onChange={e => setNewForm(f => ({ ...f, items: e.target.value }))} min={1} style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, fontFamily: 'Cairo, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#374151', marginBottom: 6 }}>الإجمالي (ج.م) *</label>
                <input type="number" value={newForm.total} onChange={e => setNewForm(f => ({ ...f, total: e.target.value }))} placeholder="0.00" style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, fontFamily: 'Cairo, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#374151', marginBottom: 6 }}>ملاحظات</label>
                <textarea value={newForm.notes} onChange={e => setNewForm(f => ({ ...f, notes: e.target.value }))} rows={3} style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, fontFamily: 'Cairo, sans-serif', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={addPurchase} style={{ flex: 1, padding: 12, background: 'linear-gradient(135deg, #D4AF37, #A07B20)', border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'Cairo, sans-serif', fontWeight: 700, color: '#000', fontSize: 14 }}>حفظ الطلب</button>
                <button onClick={() => setShowNew(false)} style={{ flex: 1, padding: 12, background: '#F3F4F6', border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'Cairo, sans-serif', color: '#374151', fontSize: 14 }}>إلغاء</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
