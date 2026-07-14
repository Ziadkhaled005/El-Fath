import { useEffect, useState } from 'react';
import { Plus, Download, Printer, X } from 'lucide-react';
import { Header } from '../components/Header';
import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { accountingApi, normalizeCollection } from '../services/api';

const JOURNAL = [
  { id: 'JE-001', date: '2024-06-15', type: 'مبيعات', description: 'فاتورة مبيعات INV-2024-001', debit: 18900, credit: 0, account: 'الصندوق' },
  { id: 'JE-002', date: '2024-06-15', type: 'مصروف', description: 'فاتورة كهرباء يونيو', debit: 0, credit: 3500, account: 'مصروفات كهرباء' },
  { id: 'JE-003', date: '2024-06-14', type: 'مشتريات', description: 'PO-2024-001 - مزرعة الورد', debit: 0, credit: 85000, account: 'موردون' },
  { id: 'JE-004', date: '2024-06-13', type: 'تحصيل', description: 'تحصيل من شركة أرواح الشرق', debit: 18900, credit: 0, account: 'الصندوق' },
  { id: 'JE-005', date: '2024-06-12', type: 'مبيعات', description: 'فاتورة مبيعات INV-2024-003', debit: 45150, credit: 0, account: 'الصندوق' },
];

const MONTHLY = [
  { month: 'يناير', income: 185000, expense: 92000 },
  { month: 'فبراير', income: 210000, expense: 105000 },
  { month: 'مارس', income: 198000, expense: 98000 },
  { month: 'أبريل', income: 245000, expense: 120000 },
  { month: 'مايو', income: 285000, expense: 145000 },
  { month: 'يونيو', income: 320000, expense: 165000 },
];

export function Accounting() {
  const { addToast } = useApp();
  const [tab, setTab] = useState<'cashbox' | 'journal' | 'pnl' | 'balance'>('cashbox');
  const [showNew, setShowNew] = useState(false);
  const [journals, setJournals] = useState(JOURNAL);
  const [monthly, setMonthly] = useState(MONTHLY);
  const [cashbox, setCashbox] = useState({ balance: 85000, todayIncome: 24750, todayExpense: 3500 });
  useEffect(() => {
    const loadAccounting = async () => {
      try {
        const [cashboxPayload, journalPayload, pnlPayload, balancePayload] = await Promise.all([
          accountingApi.getCashbox(),
          accountingApi.getJournal({ page: 1, pageSize: 100 }),
          accountingApi.getProfitLoss(),
          accountingApi.getBalanceSheet(),
        ]);
        const journalItems = normalizeCollection<(typeof JOURNAL)[0]>(journalPayload);
        if (journalItems.length > 0) setJournals(journalItems);
        setCashbox(prev => ({ ...prev, ...(cashboxPayload as Partial<typeof prev>) }));
        const pnl = pnlPayload as { monthly?: typeof MONTHLY };
        if (Array.isArray(pnl.monthly)) setMonthly(pnl.monthly);
        void balancePayload;
      } catch {
        setJournals(JOURNAL);
      }
    };

    loadAccounting();
  }, []);
  const [form, setForm] = useState({ type: 'مبيعات', description: '', debit: '', credit: '', account: '' });

  const addEntry = async () => {
    if (!form.description) { addToast({ type: 'error', message: 'الوصف مطلوب' }); return; }
    try {
      await accountingApi.createJournalEntry({
        ...form,
        debit: parseFloat(form.debit) || 0,
        credit: parseFloat(form.credit) || 0,
      });
    } catch {
      addToast({ type: 'error', message: 'تعذر حفظ القيد على الخادم' });
      return;
    }
    setJournals(prev => [{
      id: `JE-${String(prev.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      ...form,
      debit: parseFloat(form.debit) || 0,
      credit: parseFloat(form.credit) || 0,
    }, ...prev]);
    setShowNew(false);
    addToast({ type: 'success', message: 'تم إضافة القيد المحاسبي' });
  };

  const totalIncome = monthly.reduce((s, m) => s + m.income, 0);
  const totalExpense = monthly.reduce((s, m) => s + m.expense, 0);
  const netProfit = totalIncome - totalExpense;

  const tabs = [
    { id: 'cashbox', label: 'الصندوق' },
    { id: 'journal', label: 'القيود المحاسبية' },
    { id: 'pnl', label: 'الأرباح والخسائر' },
    { id: 'balance', label: 'الميزانية' },
  ] as const;

  return (
    <div style={{ fontFamily: 'Cairo, sans-serif' }}>
      <Header title="المحاسبة" breadcrumbs={[{ label: 'الرئيسية', path: '/dashboard' }, { label: 'المحاسبة' }]} />
      <div style={{ padding: 24 }}>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, background: '#fff', borderRadius: 12, padding: 6, marginBottom: 20, boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6', width: 'fit-content' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '8px 18px', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'Cairo, sans-serif', fontSize: 13, fontWeight: tab === t.id ? 700 : 400, background: tab === t.id ? 'linear-gradient(135deg, #D4AF37, #A07B20)' : 'transparent', color: tab === t.id ? '#000' : '#6B7280', transition: 'all 0.2s' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Cashbox */}
        {tab === 'cashbox' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
              {[
                { label: 'رصيد الصندوق', value: cashbox.balance.toLocaleString('ar-EG') + ' ج.م', color: '#10B981', icon: '💰' },
                { label: 'إيرادات اليوم', value: cashbox.todayIncome.toLocaleString('ar-EG') + ' ج.م', color: '#3B82F6', icon: '📈' },
                { label: 'مصروفات اليوم', value: cashbox.todayExpense.toLocaleString('ar-EG') + ' ج.م', color: '#EF4444', icon: '📉' },
              ].map((s, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 14, padding: '20px 22px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ margin: '0 0 6px', fontSize: 13, color: '#9CA3AF' }}>{s.label}</p>
                      <p style={{ margin: 0, fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</p>
                    </div>
                    <span style={{ fontSize: 32 }}>{s.icon}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: '#fff', borderRadius: 14, padding: '20px 22px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>حركة الصندوق الشهرية</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="month" tick={{ fontFamily: 'Cairo, sans-serif', fontSize: 12 }} />
                  <YAxis tick={{ fontFamily: 'Cairo, sans-serif', fontSize: 11 }} tickFormatter={v => (v / 1000) + 'ك'} />
                  <Tooltip formatter={(v: number) => v.toLocaleString('ar-EG') + ' ج.م'} />
                  <Bar dataKey="income" name="إيرادات" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" name="مصروفات" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Journal */}
        {tab === 'journal' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
              <button onClick={() => setShowNew(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', border: 'none', borderRadius: 8, background: 'linear-gradient(135deg, #D4AF37, #A07B20)', cursor: 'pointer', fontSize: 13, fontFamily: 'Cairo, sans-serif', fontWeight: 700, color: '#000' }}>
                <Plus size={14} /> قيد جديد
              </button>
            </div>
            <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                    {['رقم القيد', 'التاريخ', 'النوع', 'الوصف', 'الحساب', 'مدين', 'دائن'].map(h => (
                      <th key={h} style={{ padding: '12px 14px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'Cairo, sans-serif' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {journals.map(j => (
                    <tr key={j.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <td style={{ padding: '11px 14px', fontSize: 13, color: '#D4AF37', fontWeight: 600 }}>{j.id}</td>
                      <td style={{ padding: '11px 14px', fontSize: 13, color: '#374151' }}>{j.date}</td>
                      <td style={{ padding: '11px 14px' }}><span style={{ background: '#F3F4F6', borderRadius: 20, padding: '2px 10px', fontSize: 12, color: '#374151' }}>{j.type}</span></td>
                      <td style={{ padding: '11px 14px', fontSize: 13, color: '#111827' }}>{j.description}</td>
                      <td style={{ padding: '11px 14px', fontSize: 13, color: '#6B7280' }}>{j.account}</td>
                      <td style={{ padding: '11px 14px', fontSize: 13, color: j.debit > 0 ? '#10B981' : '#9CA3AF', fontWeight: j.debit > 0 ? 700 : 400 }}>
                        {j.debit > 0 ? j.debit.toLocaleString('ar-EG') + ' ج.م' : '-'}
                      </td>
                      <td style={{ padding: '11px 14px', fontSize: 13, color: j.credit > 0 ? '#EF4444' : '#9CA3AF', fontWeight: j.credit > 0 ? 700 : 400 }}>
                        {j.credit > 0 ? j.credit.toLocaleString('ar-EG') + ' ج.م' : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* P&L */}
        {tab === 'pnl' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={{ background: '#fff', borderRadius: 14, padding: '24px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
              <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700, borderBottom: '2px solid #D4AF37', paddingBottom: 12 }}>قائمة الأرباح والخسائر - 2024</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#F0FDF4', borderRadius: 8 }}>
                  <span style={{ fontSize: 14, color: '#374151' }}>إجمالي الإيرادات</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#10B981' }}>{totalIncome.toLocaleString('ar-EG')} ج.م</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#FFF5F5', borderRadius: 8 }}>
                  <span style={{ fontSize: 14, color: '#374151' }}>إجمالي المصروفات</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#EF4444' }}>({totalExpense.toLocaleString('ar-EG')}) ج.م</span>
                </div>
                <div style={{ height: 1, background: '#E5E7EB', margin: '4px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: netProfit > 0 ? '#DCFCE7' : '#FEE2E2', borderRadius: 8, border: `2px solid ${netProfit > 0 ? '#16A34A' : '#DC2626'}` }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>صافي الربح</span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: netProfit > 0 ? '#16A34A' : '#DC2626' }}>{netProfit.toLocaleString('ar-EG')} ج.م</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#F9FAFB', borderRadius: 8 }}>
                  <span style={{ fontSize: 13, color: '#9CA3AF' }}>نسبة هامش الربح</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#D4AF37' }}>{((netProfit / totalIncome) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
            <div style={{ background: '#fff', borderRadius: 14, padding: '24px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>المقارنة الشهرية</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="month" tick={{ fontFamily: 'Cairo, sans-serif', fontSize: 11 }} />
                  <YAxis tick={{ fontFamily: 'Cairo, sans-serif', fontSize: 10 }} tickFormatter={v => (v / 1000) + 'ك'} />
                  <Tooltip formatter={(v: number) => v.toLocaleString('ar-EG') + ' ج.م'} />
                  <Bar dataKey="income" name="إيرادات" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" name="مصروفات" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Balance */}
        {tab === 'balance' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {[
              {
                title: 'الأصول', items: [
                  ['النقدية والصندوق', '85,000'],
                  ['الحسابات المدينة', '46,200'],
                  ['المخزون', '1,250,000'],
                  ['الأصول الثابتة', '320,000'],
                ], color: '#10B981', total: '1,701,200',
              },
              {
                title: 'الالتزامات وحقوق الملكية', items: [
                  ['الحسابات الدائنة', '57,000'],
                  ['القروض قصيرة الأجل', '100,000'],
                  ['حقوق الملكية', '1,200,000'],
                  ['الأرباح المحتجزة', '344,200'],
                ], color: '#EF4444', total: '1,701,200',
              },
            ].map(section => (
              <div key={section.title} style={{ background: '#fff', borderRadius: 14, padding: '24px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, borderBottom: `2px solid ${section.color}`, paddingBottom: 10 }}>{section.title}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {section.items.map(([label, val]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#F9FAFB', borderRadius: 8 }}>
                      <span style={{ fontSize: 13, color: '#374151' }}>{label}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{val} ج.م</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: section.color + '15', borderRadius: 8, border: `1px solid ${section.color}30` }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>الإجمالي</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: section.color }}>{section.total} ج.م</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Journal Entry Modal */}
      {showNew && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 460, fontFamily: 'Cairo, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0 }}>قيد محاسبي جديد</h3>
              <button onClick={() => setShowNew(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#374151', marginBottom: 5 }}>النوع</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, fontFamily: 'Cairo, sans-serif', outline: 'none' }}>
                  {['مبيعات', 'مشتريات', 'مصروف', 'تحصيل', 'دفع', 'تعديل'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              {[['description', 'الوصف *', 'text'], ['account', 'الحساب', 'text'], ['debit', 'مدين (ج.م)', 'number'], ['credit', 'دائن (ج.م)', 'number']].map(([k, label, type]) => (
                <div key={k}>
                  <label style={{ display: 'block', fontSize: 13, color: '#374151', marginBottom: 5 }}>{label}</label>
                  <input type={type} value={form[k as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, fontFamily: 'Cairo, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={addEntry} style={{ flex: 1, padding: 12, background: 'linear-gradient(135deg, #D4AF37, #A07B20)', border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'Cairo, sans-serif', fontWeight: 700, color: '#000' }}>حفظ القيد</button>
              <button onClick={() => setShowNew(false)} style={{ flex: 1, padding: 12, background: '#F3F4F6', border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'Cairo, sans-serif', color: '#374151' }}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
