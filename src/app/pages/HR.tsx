import { useState } from 'react';
import { Plus, Search, Edit, Trash2, X, Eye } from 'lucide-react';
import { Header } from '../components/Header';
import { EMPLOYEES } from '../data/mockData';
import { useApp } from '../context/AppContext';

type Employee = typeof EMPLOYEES[0];

export function HR() {
  const { addToast } = useApp();
  const [tab, setTab] = useState<'employees' | 'attendance' | 'vacations' | 'payroll'>('employees');
  const [search, setSearch] = useState('');
  const [employees, setEmployees] = useState<Employee[]>(EMPLOYEES);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Employee | null>(null);
  const [form, setForm] = useState({ name: '', position: '', department: '', salary: '', phone: '' });

  const filtered = employees.filter(e => e.name.includes(search) || e.position.includes(search));

  const openEdit = (e: Employee) => {
    setEditItem(e);
    setForm({ name: e.name, position: e.position, department: e.department, salary: String(e.salary), phone: e.phone });
    setShowForm(true);
  };

  const save = () => {
    if (!form.name) { addToast({ type: 'error', message: 'الاسم مطلوب' }); return; }
    if (editItem) {
      setEmployees(prev => prev.map(e => e.id === editItem.id ? { ...e, ...form, salary: Number(form.salary) } : e));
      addToast({ type: 'success', message: 'تم التحديث' });
    } else {
      setEmployees(prev => [...prev, { id: Date.now(), ...form, salary: Number(form.salary), branch: 1, attendance: 0, vacations: 0, status: 'active' as const }]);
      addToast({ type: 'success', message: 'تم إضافة الموظف' });
    }
    setShowForm(false); setEditItem(null);
  };

  const totalSalary = employees.reduce((s, e) => s + e.salary, 0);

  const tabs = [{ id: 'employees', label: 'الموظفون' }, { id: 'attendance', label: 'الحضور' }, { id: 'vacations', label: 'الإجازات' }, { id: 'payroll', label: 'الرواتب' }] as const;

  return (
    <div style={{ fontFamily: 'Cairo, sans-serif' }}>
      <Header title="الموارد البشرية" breadcrumbs={[{ label: 'الرئيسية', path: '/dashboard' }, { label: 'الموارد البشرية' }]} />
      <div style={{ padding: 24 }}>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, background: '#fff', borderRadius: 12, padding: 6, marginBottom: 20, boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6', width: 'fit-content' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '8px 16px', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'Cairo, sans-serif', fontSize: 13, fontWeight: tab === t.id ? 700 : 400, background: tab === t.id ? 'linear-gradient(135deg, #D4AF37, #A07B20)' : 'transparent', color: tab === t.id ? '#000' : '#6B7280' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
          {[
            { label: 'إجمالي الموظفين', value: employees.length, color: '#3B82F6' },
            { label: 'موظفون نشطون', value: employees.filter(e => e.status === 'active').length, color: '#10B981' },
            { label: 'إجمالي الرواتب', value: (totalSalary / 1000).toFixed(0) + 'ك ج.م', color: '#D4AF37' },
            { label: 'متوسط الحضور', value: employees.length > 0 ? Math.round(employees.reduce((s, e) => s + e.attendance, 0) / employees.length) + ' يوم' : '0', color: '#8B5CF6' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
              <p style={{ margin: '0 0 4px', fontSize: 12, color: '#9CA3AF' }}>{s.label}</p>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Employees Tab */}
        {tab === 'employees' && (
          <div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={15} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث بالاسم أو المنصب..." style={{ width: '100%', padding: '9px 38px 9px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, fontFamily: 'Cairo, sans-serif', outline: 'none', boxSizing: 'border-box', background: '#fff' }} />
              </div>
              <button onClick={() => { setEditItem(null); setForm({ name: '', position: '', department: '', salary: '', phone: '' }); setShowForm(true); }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', border: 'none', borderRadius: 8, background: 'linear-gradient(135deg, #D4AF37, #A07B20)', cursor: 'pointer', fontSize: 13, fontFamily: 'Cairo, sans-serif', fontWeight: 700, color: '#000' }}>
                <Plus size={14} /> موظف جديد
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
              {filtered.map(e => (
                <div key={e.id} style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, #111827, #374151)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, color: '#D4AF37', fontWeight: 700 }}>
                        {e.name.charAt(0)}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#111827' }}>{e.name}</p>
                        <p style={{ margin: '2px 0 0', fontSize: 12, color: '#9CA3AF' }}>{e.position} - {e.department}</p>
                      </div>
                    </div>
                    <span style={{ background: e.status === 'active' ? '#DCFCE7' : '#FEE2E2', color: e.status === 'active' ? '#16A34A' : '#DC2626', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                      {e.status === 'active' ? 'نشط' : 'غير نشط'}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
                    {[['الراتب', e.salary.toLocaleString('ar-EG') + ' ج.م'], ['الحضور', e.attendance + ' يوم'], ['الإجازات', e.vacations + ' يوم']].map(([k, v]) => (
                      <div key={k} style={{ background: '#F9FAFB', borderRadius: 8, padding: '6px 10px', textAlign: 'center' }}>
                        <p style={{ margin: '0 0 2px', fontSize: 10, color: '#9CA3AF' }}>{k}</p>
                        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#111827' }}>{v}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => openEdit(e)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '7px', border: '1px solid #E5E7EB', borderRadius: 8, background: '#F9FAFB', cursor: 'pointer', fontSize: 12, fontFamily: 'Cairo, sans-serif', color: '#6B7280' }}>
                      <Edit size={13} /> تعديل
                    </button>
                    <button onClick={() => { if (confirm('حذف الموظف؟')) { setEmployees(p => p.filter(x => x.id !== e.id)); addToast({ type: 'success', message: 'تم الحذف' }); } }} style={{ padding: '7px 12px', border: '1px solid #FEE2E2', borderRadius: 8, background: '#FFF5F5', cursor: 'pointer', color: '#EF4444' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Attendance Tab */}
        {tab === 'attendance' && (
          <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                  {['الموظف', 'القسم', 'الفرع', 'أيام الحضور', 'أيام الغياب', 'نسبة الحضور'].map(h => (
                    <th key={h} style={{ padding: '12px 14px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'Cairo, sans-serif' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.map(e => {
                  const workDays = 28;
                  const absent = workDays - e.attendance;
                  const pct = Math.round((e.attendance / workDays) * 100);
                  return (
                    <tr key={e.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600, color: '#111827' }}>{e.name}</td>
                      <td style={{ padding: '12px 14px', fontSize: 13, color: '#6B7280' }}>{e.department}</td>
                      <td style={{ padding: '12px 14px', fontSize: 13, color: '#6B7280' }}>فرع {e.branch}</td>
                      <td style={{ padding: '12px 14px', fontSize: 13, color: '#10B981', fontWeight: 700 }}>{e.attendance} يوم</td>
                      <td style={{ padding: '12px 14px', fontSize: 13, color: absent > 3 ? '#EF4444' : '#6B7280', fontWeight: absent > 3 ? 700 : 400 }}>{absent} يوم</td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1, height: 6, background: '#F3F4F6', borderRadius: 3 }}>
                            <div style={{ width: pct + '%', height: '100%', background: pct >= 90 ? '#10B981' : pct >= 75 ? '#F59E0B' : '#EF4444', borderRadius: 3 }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 600, color: '#374151', minWidth: 32 }}>{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Vacations Tab */}
        {tab === 'vacations' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {employees.map(e => (
              <div key={e.id} style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
                <p style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: '#111827' }}>{e.name}</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ flex: 1, background: '#F0FDF4', borderRadius: 8, padding: '10px', textAlign: 'center' }}>
                    <p style={{ margin: '0 0 2px', fontSize: 11, color: '#9CA3AF' }}>مستخدمة</p>
                    <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#10B981' }}>{e.vacations}</p>
                    <p style={{ margin: 0, fontSize: 10, color: '#9CA3AF' }}>يوم</p>
                  </div>
                  <div style={{ flex: 1, background: '#FFF9E6', borderRadius: 8, padding: '10px', textAlign: 'center' }}>
                    <p style={{ margin: '0 0 2px', fontSize: 11, color: '#9CA3AF' }}>المتبقية</p>
                    <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#D4AF37' }}>{21 - e.vacations}</p>
                    <p style={{ margin: 0, fontSize: 10, color: '#9CA3AF' }}>يوم</p>
                  </div>
                  <div style={{ flex: 1, background: '#F9FAFB', borderRadius: 8, padding: '10px', textAlign: 'center' }}>
                    <p style={{ margin: '0 0 2px', fontSize: 11, color: '#9CA3AF' }}>الرصيد الكلي</p>
                    <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#374151' }}>21</p>
                    <p style={{ margin: 0, fontSize: 10, color: '#9CA3AF' }}>يوم</p>
                  </div>
                </div>
                <button onClick={() => addToast({ type: 'info', message: 'جارٍ معالجة طلب الإجازة...' })} style={{ marginTop: 12, width: '100%', padding: '8px', background: '#F3F4F6', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontFamily: 'Cairo, sans-serif', color: '#374151' }}>
                  طلب إجازة
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Payroll Tab */}
        {tab === 'payroll' && (
          <div>
            <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>كشف الرواتب - يونيو 2024</h3>
                <button onClick={() => addToast({ type: 'info', message: 'جارٍ تصدير كشف الرواتب...' })} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', border: '1px solid #E5E7EB', borderRadius: 8, background: '#F9FAFB', cursor: 'pointer', fontSize: 13, fontFamily: 'Cairo, sans-serif', color: '#6B7280' }}>
                  تصدير PDF
                </button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                    {['الموظف', 'المنصب', 'الراتب الأساسي', 'بدلات', 'خصومات', 'صافي الراتب', 'الحالة'].map(h => (
                      <th key={h} style={{ padding: '12px 14px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'Cairo, sans-serif' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {employees.map(e => {
                    const allowance = Math.round(e.salary * 0.1);
                    const deduction = e.vacations > 2 ? Math.round(e.salary * 0.05) : 0;
                    const net = e.salary + allowance - deduction;
                    return (
                      <tr key={e.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                        <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600, color: '#111827' }}>{e.name}</td>
                        <td style={{ padding: '12px 14px', fontSize: 13, color: '#6B7280' }}>{e.position}</td>
                        <td style={{ padding: '12px 14px', fontSize: 13 }}>{e.salary.toLocaleString('ar-EG')} ج.م</td>
                        <td style={{ padding: '12px 14px', fontSize: 13, color: '#10B981' }}>+{allowance.toLocaleString('ar-EG')} ج.م</td>
                        <td style={{ padding: '12px 14px', fontSize: 13, color: deduction > 0 ? '#EF4444' : '#9CA3AF' }}>
                          {deduction > 0 ? '-' + deduction.toLocaleString('ar-EG') + ' ج.م' : '-'}
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: 14, fontWeight: 800, color: '#D4AF37' }}>{net.toLocaleString('ar-EG')} ج.م</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ background: '#DCFCE7', color: '#16A34A', padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>محول</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ background: '#F9FAFB', borderTop: '2px solid #E5E7EB' }}>
                    <td colSpan={5} style={{ padding: '12px 14px', fontSize: 14, fontWeight: 700, color: '#111827', fontFamily: 'Cairo, sans-serif' }}>إجمالي الرواتب</td>
                    <td style={{ padding: '12px 14px', fontSize: 14, fontWeight: 800, color: '#D4AF37' }}>{Math.round(totalSalary * 1.1).toLocaleString('ar-EG')} ج.م</td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Employee Form Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 460, fontFamily: 'Cairo, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0 }}>{editItem ? 'تعديل بيانات الموظف' : 'موظف جديد'}</h3>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[['name', 'الاسم الكامل *', 'text'], ['position', 'المنصب', 'text'], ['department', 'القسم', 'text'], ['salary', 'الراتب الأساسي (ج.م)', 'number'], ['phone', 'الهاتف', 'tel']].map(([k, label, type]) => (
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
