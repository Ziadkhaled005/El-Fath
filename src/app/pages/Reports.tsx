import { useState } from 'react';
import { Download, Printer, BarChart2, FileText, Package, Users, Truck, DollarSign, GitBranch, UserSquare } from 'lucide-react';
import { Header } from '../components/Header';
import { useApp } from '../context/AppContext';
import { SALES_INVOICES, PURCHASES, PRODUCTS, EMPLOYEES, BRANCHES, SALES_CHART_DATA } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

type ReportType = 'sales' | 'purchases' | 'inventory' | 'customers' | 'suppliers' | 'expenses' | 'branches' | 'employees';

const REPORT_TYPES = [
  { id: 'sales', label: 'تقرير المبيعات', icon: BarChart2, color: '#10B981' },
  { id: 'purchases', label: 'تقرير المشتريات', icon: Truck, color: '#3B82F6' },
  { id: 'inventory', label: 'تقرير المخزون', icon: Package, color: '#D4AF37' },
  { id: 'customers', label: 'تقرير العملاء', icon: Users, color: '#8B5CF6' },
  { id: 'suppliers', label: 'تقرير الموردين', icon: Truck, color: '#F59E0B' },
  { id: 'expenses', label: 'تقرير المصروفات', icon: DollarSign, color: '#EF4444' },
  { id: 'branches', label: 'تقرير الفروع', icon: GitBranch, color: '#06B6D4' },
  { id: 'employees', label: 'تقرير الموظفين', icon: UserSquare, color: '#6366F1' },
] as const;

export function Reports() {
  const { addToast } = useApp();
  const [activeReport, setActiveReport] = useState<ReportType>('sales');
  const [dateFrom, setDateFrom] = useState('2024-01-01');
  const [dateTo, setDateTo] = useState('2024-06-30');

  const handleExport = (type: string) => addToast({ type: 'info', message: `جارٍ تصدير التقرير بصيغة ${type}...` });
  const handlePrint = () => addToast({ type: 'info', message: 'جارٍ إرسال التقرير للطباعة...' });

  const reportInfo = REPORT_TYPES.find(r => r.id === activeReport);

  return (
    <div style={{ fontFamily: 'Cairo, sans-serif' }}>
      <Header title="التقارير" breadcrumbs={[{ label: 'الرئيسية', path: '/dashboard' }, { label: 'التقارير' }]} />
      <div style={{ padding: 24 }}>
        <div style={{ display: 'flex', gap: 20 }}>
          {/* Report Type Selector */}
          <div style={{ width: 220, flexShrink: 0 }}>
            <div style={{ background: '#fff', borderRadius: 14, padding: 12, boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
              <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 600, color: '#9CA3AF', padding: '0 4px' }}>نوع التقرير</p>
              {REPORT_TYPES.map(r => {
                const Icon = r.icon;
                const isActive = activeReport === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setActiveReport(r.id)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 12px', border: 'none', borderRadius: 10, cursor: 'pointer',
                      background: isActive ? r.color + '15' : 'transparent',
                      borderRight: isActive ? `3px solid ${r.color}` : '3px solid transparent',
                      marginBottom: 2, textAlign: 'right', fontFamily: 'Cairo, sans-serif',
                      transition: 'all 0.15s',
                    }}
                  >
                    <Icon size={16} color={isActive ? r.color : '#9CA3AF'} />
                    <span style={{ fontSize: 13, color: isActive ? '#111827' : '#6B7280', fontWeight: isActive ? 700 : 400 }}>{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Report Content */}
          <div style={{ flex: 1 }}>
            {/* Filters */}
            <div style={{ background: '#fff', borderRadius: 14, padding: '14px 18px', marginBottom: 16, boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <label style={{ fontSize: 13, color: '#374151' }}>من:</label>
                <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ padding: '7px 10px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, fontFamily: 'Cairo, sans-serif', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <label style={{ fontSize: 13, color: '#374151' }}>إلى:</label>
                <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ padding: '7px 10px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, fontFamily: 'Cairo, sans-serif', outline: 'none' }} />
              </div>
              <div style={{ marginRight: 'auto', display: 'flex', gap: 8 }}>
                <button onClick={() => handleExport('Excel')} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', border: '1px solid #E5E7EB', borderRadius: 8, background: '#F9FAFB', cursor: 'pointer', fontSize: 12, fontFamily: 'Cairo, sans-serif', color: '#6B7280' }}>
                  <Download size={13} /> Excel
                </button>
                <button onClick={() => handleExport('PDF')} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', border: '1px solid #E5E7EB', borderRadius: 8, background: '#F9FAFB', cursor: 'pointer', fontSize: 12, fontFamily: 'Cairo, sans-serif', color: '#6B7280' }}>
                  <FileText size={13} /> PDF
                </button>
                <button onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', border: '1px solid #E5E7EB', borderRadius: 8, background: '#F9FAFB', cursor: 'pointer', fontSize: 12, fontFamily: 'Cairo, sans-serif', color: '#6B7280' }}>
                  <Printer size={13} /> طباعة
                </button>
              </div>
            </div>

            {/* Sales Report */}
            {activeReport === 'sales' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                  {[['إجمالي المبيعات', '736,000 ج.م', '#10B981'], ['عدد الفواتير', SALES_INVOICES.length, '#3B82F6'], ['متوسط الفاتورة', '14,720 ج.م', '#D4AF37'], ['مدفوعة بالكامل', SALES_INVOICES.filter(i => i.status === 'paid').length, '#8B5CF6']].map(([k, v, c]) => (
                    <div key={k as string} style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
                      <p style={{ margin: '0 0 4px', fontSize: 12, color: '#9CA3AF' }}>{k}</p>
                      <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: c as string }}>{v}</p>
                    </div>
                  ))}
                </div>
                <div style={{ background: '#fff', borderRadius: 14, padding: '20px 22px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
                  <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>تطور المبيعات الشهري</h3>
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={SALES_CHART_DATA}>
                      <defs>
                        <linearGradient id="salesGr" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                      <XAxis dataKey="month" tick={{ fontFamily: 'Cairo, sans-serif', fontSize: 12 }} />
                      <YAxis tick={{ fontFamily: 'Cairo, sans-serif', fontSize: 11 }} tickFormatter={v => (v / 1000) + 'ك'} />
                      <Tooltip formatter={(v: number) => v.toLocaleString('ar-EG') + ' ج.م'} />
                      <Area type="monotone" dataKey="sales" name="المبيعات" stroke="#D4AF37" fill="url(#salesGr)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                        {['رقم الفاتورة', 'التاريخ', 'العميل', 'الإجمالي', 'الحالة'].map(h => (
                          <th key={h} style={{ padding: '12px 14px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'Cairo, sans-serif' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {SALES_INVOICES.map(inv => (
                        <tr key={inv.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                          <td style={{ padding: '10px 14px', fontSize: 13, color: '#D4AF37', fontWeight: 600 }}>{inv.id}</td>
                          <td style={{ padding: '10px 14px', fontSize: 13, color: '#374151' }}>{inv.date}</td>
                          <td style={{ padding: '10px 14px', fontSize: 13, color: '#111827' }}>{inv.customer}</td>
                          <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 700 }}>{inv.total.toLocaleString('ar-EG')} ج.م</td>
                          <td style={{ padding: '10px 14px' }}>
                            <span style={{ background: inv.status === 'paid' ? '#DCFCE7' : inv.status === 'partial' ? '#FEF3C7' : '#FEE2E2', color: inv.status === 'paid' ? '#16A34A' : inv.status === 'partial' ? '#D97706' : '#DC2626', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                              {inv.status === 'paid' ? 'مدفوعة' : inv.status === 'partial' ? 'جزئية' : 'غير مدفوعة'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Inventory Report */}
            {activeReport === 'inventory' && (
              <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6', overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6' }}>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>تقرير المخزون الحالي</h3>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                      {['المنتج', 'الفئة', 'الكمية', 'الحد الأدنى', 'القيمة', 'الحالة'].map(h => (
                        <th key={h} style={{ padding: '12px 14px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'Cairo, sans-serif' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {PRODUCTS.map(p => (
                      <tr key={p.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                        <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 600, color: '#111827' }}>{p.name}</td>
                        <td style={{ padding: '10px 14px', fontSize: 13, color: '#6B7280' }}>{p.category}</td>
                        <td style={{ padding: '10px 14px', fontSize: 13 }}>{p.stock} {p.unit}</td>
                        <td style={{ padding: '10px 14px', fontSize: 13, color: '#9CA3AF' }}>{p.minStock} {p.unit}</td>
                        <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 700, color: '#D4AF37' }}>{(p.price * p.stock).toLocaleString('ar-EG')} ج.م</td>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{ background: p.stock <= p.minStock / 2 ? '#FEE2E2' : p.stock <= p.minStock ? '#FEF3C7' : '#DCFCE7', color: p.stock <= p.minStock / 2 ? '#DC2626' : p.stock <= p.minStock ? '#D97706' : '#16A34A', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                            {p.stock <= p.minStock / 2 ? 'حرج' : p.stock <= p.minStock ? 'منخفض' : 'جيد'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Branches Report */}
            {activeReport === 'branches' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
                {BRANCHES.map(b => (
                  <div key={b.id} style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#111827' }}>{b.name}</p>
                      <span style={{ background: b.status === 'active' ? '#DCFCE7' : '#FEE2E2', color: b.status === 'active' ? '#16A34A' : '#DC2626', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                        {b.status === 'active' ? 'نشط' : 'غير نشط'}
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      {[['المدير', b.manager], ['الموظفون', b.employees + ' موظف'], ['المبيعات', (b.sales / 1000).toFixed(0) + 'ك ج.م']].map(([k, v]) => (
                        <div key={k as string} style={{ background: '#F9FAFB', borderRadius: 8, padding: '8px 10px' }}>
                          <p style={{ margin: '0 0 2px', fontSize: 10, color: '#9CA3AF' }}>{k}</p>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#111827' }}>{v}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Default other reports */}
            {!['sales', 'inventory', 'branches'].includes(activeReport) && (
              <div style={{ background: '#fff', borderRadius: 14, padding: '40px', textAlign: 'center', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
                <div style={{ fontSize: 48, marginBottom: 12, display: 'flex', justifyContent: 'center' }}>
                  {reportInfo?.icon && (() => { const Icon = reportInfo.icon; return <Icon size={48} color={reportInfo.color} />; })()}
                </div>
                <h3 style={{ margin: '0 0 8px', color: '#111827' }}>{reportInfo?.label}</h3>
                <p style={{ margin: '0 0 20px', color: '#9CA3AF', fontSize: 13 }}>اختر نطاق التاريخ واضغط على تصدير لاستخراج التقرير</p>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                  {['Excel', 'PDF', 'طباعة'].map(btn => (
                    <button key={btn} onClick={() => btn === 'طباعة' ? handlePrint() : handleExport(btn)} style={{ padding: '10px 20px', border: '1px solid #E5E7EB', borderRadius: 10, background: '#F9FAFB', cursor: 'pointer', fontSize: 13, fontFamily: 'Cairo, sans-serif', color: '#374151' }}>
                      {btn}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
