import { useState } from 'react';
import { Save, Upload, Bell, Shield, Database, FileText, Globe, Palette, Clock } from 'lucide-react';
import { Header } from '../components/Header';
import { COMPANY } from '../data/mockData';
import { useApp } from '../context/AppContext';
import logo from '../../imports/0.png';

export function Settings() {
  const { addToast } = useApp();
  const [tab, setTab] = useState<'company' | 'invoice' | 'tax' | 'notifications' | 'backup' | 'audit'>('company');
  const [company, setCompany] = useState(COMPANY);
  const [taxRate, setTaxRate] = useState(14);
  const [invoicePrefix, setInvoicePrefix] = useState('INV');
  const [notifSettings, setNotifSettings] = useState({
    lowStock: true, pendingApproval: true, newOrder: true, email: false,
  });

  const save = () => addToast({ type: 'success', message: 'تم حفظ الإعدادات بنجاح' });

  const tabs = [
    { id: 'company', label: 'بيانات الشركة', icon: Globe },
    { id: 'invoice', label: 'إعدادات الفاتورة', icon: FileText },
    { id: 'tax', label: 'إعدادات الضريبة', icon: Shield },
    { id: 'notifications', label: 'الإشعارات', icon: Bell },
    { id: 'backup', label: 'النسخ الاحتياطي', icon: Database },
    { id: 'audit', label: 'سجل التدقيق', icon: Clock },
  ] as const;

  const AUDIT_LOGS = [
    { id: 1, user: 'أحمد محمد', action: 'إضافة منتج', detail: 'تم إضافة زيت الورد الطائفي', time: '2024-06-15 10:30' },
    { id: 2, user: 'فاطمة علي', action: 'موافقة مصروف', detail: 'الموافقة على EXP-004', time: '2024-06-15 09:45' },
    { id: 3, user: 'محمود إبراهيم', action: 'إنشاء فاتورة', detail: 'INV-2024-001 للعميل أرواح الشرق', time: '2024-06-15 09:00' },
    { id: 4, user: 'سارة خالد', action: 'تعديل مخزون', detail: 'تعديل مخزون زيت اللافندر +20 مل', time: '2024-06-14 16:20' },
    { id: 5, user: 'أحمد محمد', action: 'تسجيل دخول', detail: 'تسجيل دخول من IP: 192.168.1.1', time: '2024-06-14 08:00' },
  ];

  return (
    <div style={{ fontFamily: 'Cairo, sans-serif' }}>
      <Header title="الإعدادات" breadcrumbs={[{ label: 'الرئيسية', path: '/dashboard' }, { label: 'الإعدادات' }]} />
      <div style={{ padding: 24, display: 'flex', gap: 20 }}>

        {/* Sidebar */}
        <div style={{ width: 220, flexShrink: 0 }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 10, boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
            {tabs.map(t => {
              const Icon = t.icon;
              const isActive = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', border: 'none', borderRadius: 10, cursor: 'pointer', background: isActive ? '#FFF9E6' : 'transparent', borderRight: isActive ? '3px solid #D4AF37' : '3px solid transparent', marginBottom: 2, textAlign: 'right', fontFamily: 'Cairo, sans-serif', transition: 'all 0.15s' }}>
                  <Icon size={16} color={isActive ? '#D4AF37' : '#9CA3AF'} />
                  <span style={{ fontSize: 13, color: isActive ? '#111827' : '#6B7280', fontWeight: isActive ? 700 : 400 }}>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          {tab === 'company' && (
            <div style={{ background: '#fff', borderRadius: 14, padding: '24px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
              <h3 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 700 }}>بيانات الشركة</h3>

              {/* Logo upload */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24, padding: '16px', background: '#F9FAFB', borderRadius: 12 }}>
                <img src={logo} alt="شعار الشركة" style={{ width: 72, height: 72, borderRadius: '50%', border: '2px solid #D4AF37' }} />
                <div>
                  <p style={{ margin: '0 0 6px', fontSize: 13, fontWeight: 600, color: '#111827' }}>شعار الشركة</p>
                  <p style={{ margin: '0 0 10px', fontSize: 12, color: '#9CA3AF' }}>PNG أو JPG بدقة عالية</p>
                  <button onClick={() => addToast({ type: 'info', message: 'جارٍ رفع الشعار...' })} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', border: '1px solid #E5E7EB', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'Cairo, sans-serif', color: '#6B7280' }}>
                    <Upload size={13} /> رفع شعار جديد
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  ['name', 'اسم الشركة', company.name],
                  ['nameEn', 'الاسم بالإنجليزية', company.nameEn],
                  ['address', 'العنوان', company.address],
                  ['phone', 'الهاتف', company.phone],
                  ['email', 'البريد الإلكتروني', company.email],
                  ['taxNumber', 'الرقم الضريبي', company.taxNumber],
                ].map(([key, label, val]) => (
                  <div key={key} style={{ gridColumn: key === 'address' ? '1 / -1' : 'auto' }}>
                    <label style={{ display: 'block', fontSize: 13, color: '#374151', marginBottom: 6 }}>{label}</label>
                    <input
                      value={val}
                      onChange={e => setCompany(c => ({ ...c, [key]: e.target.value }))}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, fontFamily: 'Cairo, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                ))}
              </div>

              <button onClick={save} style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 20, padding: '11px 20px', border: 'none', borderRadius: 10, background: 'linear-gradient(135deg, #D4AF37, #A07B20)', cursor: 'pointer', fontSize: 14, fontFamily: 'Cairo, sans-serif', fontWeight: 700, color: '#000' }}>
                <Save size={16} /> حفظ البيانات
              </button>
            </div>
          )}

          {tab === 'invoice' && (
            <div style={{ background: '#fff', borderRadius: 14, padding: '24px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
              <h3 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 700 }}>إعدادات الفاتورة</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  ['بادئة رقم الفاتورة', invoicePrefix, (v: string) => setInvoicePrefix(v)],
                  ['تذييل الفاتورة', 'شكراً لتعاملكم معنا', () => {}],
                  ['ملاحظات افتراضية', 'يرجى الدفع خلال 30 يوم من تاريخ الفاتورة', () => {}],
                ].map(([label, val, setter]) => (
                  <div key={label as string}>
                    <label style={{ display: 'block', fontSize: 13, color: '#374151', marginBottom: 6 }}>{label}</label>
                    <input value={val as string} onChange={e => (setter as Function)(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, fontFamily: 'Cairo, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 20 }}>
                  {[['طباعة A4', true], ['طباعة Thermal', true], ['تضمين الشعار', true], ['تضمين QR كود', true]].map(([label, checked]) => (
                    <label key={label as string} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#374151' }}>
                      <input type="checkbox" defaultChecked={checked as boolean} style={{ width: 16, height: 16, accentColor: '#D4AF37' }} />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
              <button onClick={save} style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 20, padding: '11px 20px', border: 'none', borderRadius: 10, background: 'linear-gradient(135deg, #D4AF37, #A07B20)', cursor: 'pointer', fontSize: 14, fontFamily: 'Cairo, sans-serif', fontWeight: 700, color: '#000' }}>
                <Save size={16} /> حفظ الإعدادات
              </button>
            </div>
          )}

          {tab === 'tax' && (
            <div style={{ background: '#fff', borderRadius: 14, padding: '24px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
              <h3 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 700 }}>إعدادات الضريبة</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: '#374151', marginBottom: 6 }}>نسبة ضريبة القيمة المضافة (%)</label>
                  <input type="number" value={taxRate} onChange={e => setTaxRate(Number(e.target.value))} min={0} max={100} style={{ width: 120, padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, fontFamily: 'Cairo, sans-serif', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', gap: 20 }}>
                  {[['تضمين الضريبة في السعر', true], ['إظهار الضريبة في الفاتورة', true]].map(([label, checked]) => (
                    <label key={label as string} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#374151' }}>
                      <input type="checkbox" defaultChecked={checked as boolean} style={{ width: 16, height: 16, accentColor: '#D4AF37' }} />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
              <button onClick={save} style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 20, padding: '11px 20px', border: 'none', borderRadius: 10, background: 'linear-gradient(135deg, #D4AF37, #A07B20)', cursor: 'pointer', fontSize: 14, fontFamily: 'Cairo, sans-serif', fontWeight: 700, color: '#000' }}>
                <Save size={16} /> حفظ
              </button>
            </div>
          )}

          {tab === 'notifications' && (
            <div style={{ background: '#fff', borderRadius: 14, padding: '24px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
              <h3 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 700 }}>إعدادات الإشعارات</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { key: 'lowStock', label: 'إشعارات المخزون المنخفض', desc: 'تنبيه عند وصول المخزون للحد الأدنى' },
                  { key: 'pendingApproval', label: 'إشعارات الموافقة المعلقة', desc: 'تنبيه عند وجود طلبات تحتاج موافقة' },
                  { key: 'newOrder', label: 'إشعارات الطلبات الجديدة', desc: 'تنبيه عند وصول طلبات جديدة' },
                  { key: 'email', label: 'إشعارات البريد الإلكتروني', desc: 'إرسال إشعارات عبر البريد الإلكتروني' },
                ].map(item => (
                  <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', border: '1px solid #F3F4F6', borderRadius: 10, background: '#FAFAFA' }}>
                    <div>
                      <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 600, color: '#111827' }}>{item.label}</p>
                      <p style={{ margin: 0, fontSize: 12, color: '#9CA3AF' }}>{item.desc}</p>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={notifSettings[item.key as keyof typeof notifSettings]}
                        onChange={e => setNotifSettings(prev => ({ ...prev, [item.key]: e.target.checked }))}
                        style={{ display: 'none' }}
                      />
                      <div style={{
                        width: 44, height: 24, borderRadius: 12,
                        background: notifSettings[item.key as keyof typeof notifSettings] ? '#D4AF37' : '#E5E7EB',
                        transition: 'background 0.2s', position: 'relative',
                      }}>
                        <div style={{
                          position: 'absolute', top: 2, width: 20, height: 20, borderRadius: '50%', background: '#fff',
                          transition: 'right 0.2s',
                          right: notifSettings[item.key as keyof typeof notifSettings] ? 2 : 22,
                          boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                        }} />
                      </div>
                    </label>
                  </div>
                ))}
              </div>
              <button onClick={save} style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 20, padding: '11px 20px', border: 'none', borderRadius: 10, background: 'linear-gradient(135deg, #D4AF37, #A07B20)', cursor: 'pointer', fontSize: 14, fontFamily: 'Cairo, sans-serif', fontWeight: 700, color: '#000' }}>
                <Save size={16} /> حفظ
              </button>
            </div>
          )}

          {tab === 'backup' && (
            <div style={{ background: '#fff', borderRadius: 14, padding: '24px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
              <h3 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 700 }}>النسخ الاحتياطي والاستعادة</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { icon: '💾', title: 'إنشاء نسخة احتياطية', desc: 'تصدير جميع بيانات النظام', action: 'إنشاء النسخة', color: '#10B981' },
                  { icon: '📁', title: 'استعادة النسخة', desc: 'استيراد بيانات من نسخة سابقة', action: 'اختيار الملف', color: '#3B82F6' },
                  { icon: '📅', title: 'جدولة النسخ التلقائي', desc: 'نسخ احتياطي تلقائي يومي', action: 'إعداد الجدول', color: '#D4AF37' },
                  { icon: '☁️', title: 'رفع للسحابة', desc: 'حفظ النسخة على Google Drive', action: 'ربط الحساب', color: '#8B5CF6' },
                ].map((item, i) => (
                  <div key={i} style={{ border: '1px solid #E5E7EB', borderRadius: 12, padding: '20px' }}>
                    <div style={{ fontSize: 32, marginBottom: 10 }}>{item.icon}</div>
                    <h4 style={{ margin: '0 0 6px', fontSize: 14, color: '#111827' }}>{item.title}</h4>
                    <p style={{ margin: '0 0 14px', fontSize: 12, color: '#9CA3AF' }}>{item.desc}</p>
                    <button onClick={() => addToast({ type: 'info', message: item.action + '...' })} style={{ width: '100%', padding: '9px', border: `1px solid ${item.color}`, borderRadius: 8, background: item.color + '10', cursor: 'pointer', fontSize: 13, fontFamily: 'Cairo, sans-serif', fontWeight: 600, color: item.color }}>
                      {item.action}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'audit' && (
            <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6' }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>سجل التدقيق</h3>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                    {['المستخدم', 'الإجراء', 'التفاصيل', 'الوقت'].map(h => (
                      <th key={h} style={{ padding: '12px 14px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'Cairo, sans-serif' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {AUDIT_LOGS.map(log => (
                    <tr key={log.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <td style={{ padding: '11px 14px', fontSize: 13, fontWeight: 600, color: '#111827' }}>{log.user}</td>
                      <td style={{ padding: '11px 14px' }}><span style={{ background: '#EDE9FE', color: '#7C3AED', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{log.action}</span></td>
                      <td style={{ padding: '11px 14px', fontSize: 13, color: '#6B7280' }}>{log.detail}</td>
                      <td style={{ padding: '11px 14px', fontSize: 12, color: '#9CA3AF' }}>{log.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
