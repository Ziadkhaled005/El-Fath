import { useEffect, useState } from 'react';
import { Plus, Search, Download, CheckCircle, XCircle, Clock, X, Eye } from 'lucide-react';
import { Header } from '../components/Header';
import { EXPENSES } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { expensesApi, normalizeCollection } from '../services/api';

type Expense = typeof EXPENSES[0];
const STATUS_MAP = {
  approved: { bg: '#DCFCE7', color: '#16A34A', label: 'معتمد' },
  pending: { bg: '#FEF3C7', color: '#D97706', label: 'معلق' },
  rejected: { bg: '#FEE2E2', color: '#DC2626', label: 'مرفوض' },
};

const CATEGORIES = ['إيجار', 'كهرباء', 'مياه', 'رواتب', 'صيانة', 'نقل', 'تسويق', 'أخرى'];

export function Expenses() {
  const { addToast } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expenses, setExpenses] = useState<Expense[]>(EXPENSES);
  const [showNew, setShowNew] = useState(false);
  const [viewItem, setViewItem] = useState<Expense | null>(null);
  const [form, setForm] = useState({ category: 'إيجار', description: '', amount: '', branch: 'الرئيسي' });

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const payload = await expensesApi.list({ page: 1, pageSize: 100 });
        const items = normalizeCollection<Expense>(payload);
        if (items.length > 0) setExpenses(items);
      } catch {
        setExpenses(EXPENSES);
      }
    };

    loadExpenses();
  }, []);

  const filtered = expenses.filter(e =>
    (e.description.includes(search) || e.category.includes(search)) &&
    (!statusFilter || e.status === statusFilter)
  );

  const total = filtered.reduce((s, e) => s + e.amount, 0);
  const pending = expenses.filter(e => e.status === 'pending').length;
  const approved = expenses.filter(e => e.status === 'approved');
  const approvedTotal = approved.reduce((s, e) => s + e.amount, 0);

  const approve = async (id: string) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, status: 'approved' as const } : e));
    try {
      await expensesApi.approve(id);
      addToast({ type: 'success', message: 'تمت الموافقة على المصروف' });
    } catch {
      addToast({ type: 'error', message: 'تعذر حفظ الموافقة على الخادم' });
    }
  };

  const reject = async (id: string) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, status: 'rejected' as const } : e));
    try {
      await expensesApi.reject(id);
      addToast({ type: 'error', message: 'تم رفض المصروف' });
    } catch {
      addToast({ type: 'error', message: 'تعذر حفظ الرفض على الخادم' });
    }
  };

  const addExpense = async () => {
    if (!form.description || !form.amount) { addToast({ type: 'error', message: 'يرجى ملء جميع الحقول' }); return; }
    const newE: Expense = {
      id: `EXP-${String(expenses.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      category: form.category,
      description: form.description,
      amount: parseFloat(form.amount),
      branch: form.branch,
      status: 'pending',
      submittedBy: 'المستخدم الحالي',
    };
    setExpenses(prev => [newE, ...prev]);
    try {
      await expensesApi.create({
        category: form.category,
        description: form.description,
        amount: parseFloat(form.amount),
        branch: form.branch,
      });
      addToast({ type: 'success', message: 'تم تقديم المصروف وهو بانتظار الموافقة' });
      setShowNew(false);
      setForm({ category: 'إيجار', description: '', amount: '', branch: 'الرئيسي' });
    } catch {
      addToast({ type: 'error', message: 'تعذر حفظ المصروف على الخادم' });
    }
  };

  return (
    <div style={{ fontFamily: 'Cairo, sans-serif' }}>
      <Header title="المصروفات" breadcrumbs={[{ label: 'الرئيسية', path: '/dashboard' }, { label: 'المصروفات' }]} />
      <div style={{ padding: 24 }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'إجمالي المصروفات', value: total.toLocaleString('ar-EG') + ' ج.م', color: '#EF4444' },
            { label: 'معتمدة', value: approvedTotal.toLocaleString('ar-EG') + ' ج.م', color: '#10B981' },
            { label: 'بانتظار الموافقة', value: pending, color: '#F59E0B' },
            { label: 'مرفوضة', value: expenses.filter(e => e.status === 'rejected').length, color: '#6B7280' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
              <p style={{ margin: '0 0 4px', fontSize: 12, color: '#9CA3AF' }}>{s.label}</p>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Workflow info */}
        <div style={{ background: '#FFF9E6', border: '1px solid #FDE68A', borderRadius: 12, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: '#92400E' }}>
          <span>📋</span>
          <span>سير العمل: <strong>تقديم المصروف</strong> ← <strong>بانتظار الموافقة</strong> ← <strong>معتمد / مرفوض</strong> — لا يُعتمد أي مصروف تلقائياً</span>
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
            <Plus size={14} /> مصروف جديد
          </button>
        </div>

        {/* Table */}
        <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                {['رقم المصروف', 'التاريخ', 'الفئة', 'الوصف', 'الفرع', 'المبلغ', 'مقدم الطلب', 'الحالة', 'الإجراءات'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'Cairo, sans-serif' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => {
                const s = STATUS_MAP[e.status as keyof typeof STATUS_MAP];
                return (
                  <tr key={e.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '12px 14px', fontSize: 13, color: '#D4AF37', fontWeight: 600 }}>{e.id}</td>
                    <td style={{ padding: '12px 14px', fontSize: 13, color: '#374151' }}>{e.date}</td>
                    <td style={{ padding: '12px 14px' }}><span style={{ background: '#F3F4F6', borderRadius: 20, padding: '2px 10px', fontSize: 12, color: '#374151' }}>{e.category}</span></td>
                    <td style={{ padding: '12px 14px', fontSize: 13, color: '#111827', maxWidth: 200 }}>{e.description}</td>
                    <td style={{ padding: '12px 14px', fontSize: 13, color: '#6B7280' }}>{e.branch}</td>
                    <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 700, color: '#EF4444' }}>{e.amount.toLocaleString('ar-EG')} ج.م</td>
                    <td style={{ padding: '12px 14px', fontSize: 13, color: '#6B7280' }}>{e.submittedBy}</td>
                    <td style={{ padding: '12px 14px' }}><span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{s.label}</span></td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: 5 }}>
                        <button onClick={() => setViewItem(e)} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #E5E7EB', background: '#F9FAFB', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Eye size={12} color="#6B7280" /></button>
                        {e.status === 'pending' && (
                          <>
                            <button onClick={() => approve(e.id)} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #DCFCE7', background: '#F0FDF4', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircle size={12} color="#16A34A" /></button>
                            <button onClick={() => reject(e.id)} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #FEE2E2', background: '#FFF5F5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><XCircle size={12} color="#EF4444" /></button>
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

      {/* New Expense Modal */}
      {showNew && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 460, fontFamily: 'Cairo, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0 }}>تقديم مصروف جديد</h3>
              <button onClick={() => setShowNew(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#374151', marginBottom: 5 }}>الفئة</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, fontFamily: 'Cairo, sans-serif', outline: 'none' }}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#374151', marginBottom: 5 }}>الوصف *</label>
                <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, fontFamily: 'Cairo, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#374151', marginBottom: 5 }}>المبلغ (ج.م) *</label>
                <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="0.00" style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, fontFamily: 'Cairo, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ background: '#FFF9E6', border: '1px solid #FDE68A', borderRadius: 8, padding: '10px 14px', marginTop: 14, fontSize: 12, color: '#92400E' }}>
              ⚠️ سيتم إرسال هذا المصروف للموافقة ولن يُعتمد تلقائياً
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button onClick={addExpense} style={{ flex: 1, padding: 12, background: 'linear-gradient(135deg, #D4AF37, #A07B20)', border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'Cairo, sans-serif', fontWeight: 700, color: '#000' }}>تقديم الطلب</button>
              <button onClick={() => setShowNew(false)} style={{ flex: 1, padding: 12, background: '#F3F4F6', border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'Cairo, sans-serif', color: '#374151' }}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
