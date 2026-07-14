import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Save, Lock, LogOut, User, Mail, Phone, Shield } from 'lucide-react';
import { Header } from '../components/Header';
import { useApp } from '../context/AppContext';
import { authApi } from '../services/api';

export function Profile() {
  const { user, logout, addToast } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'info' | 'password'>('info');
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: '01012345678' });
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });

  const saveInfo = async () => {
    try {
      await authApi.profile({ fullName: form.name, name: form.name, email: form.email, phone: form.phone });
      addToast({ type: 'success', message: 'تم تحديث بيانات الملف الشخصي' });
    } catch {
      addToast({ type: 'error', message: 'تعذر تحديث بيانات الملف الشخصي' });
    }
  };

  const changePassword = async () => {
    if (!passwords.current) { addToast({ type: 'error', message: 'يرجى إدخال كلمة المرور الحالية' }); return; }
    if (passwords.newPass !== passwords.confirm) { addToast({ type: 'error', message: 'كلمتا المرور غير متطابقتان' }); return; }
    if (passwords.newPass.length < 6) { addToast({ type: 'error', message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }); return; }
    try {
      await authApi.changePassword({
        currentPassword: passwords.current,
        newPassword: passwords.newPass,
        confirmPassword: passwords.confirm,
      });
      addToast({ type: 'success', message: 'تم تغيير كلمة المرور بنجاح' });
      setPasswords({ current: '', newPass: '', confirm: '' });
    } catch {
      addToast({ type: 'error', message: 'تعذر تغيير كلمة المرور' });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ fontFamily: 'Cairo, sans-serif' }}>
      <Header title="الملف الشخصي" breadcrumbs={[{ label: 'الرئيسية', path: '/dashboard' }, { label: 'الملف الشخصي' }]} />
      <div style={{ padding: 24, maxWidth: 700 }}>

        {/* Profile header card */}
        <div style={{ background: 'linear-gradient(135deg, #111827, #1F2937)', borderRadius: 16, padding: '28px 24px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #D4AF37, #A07B20)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: '#000', fontWeight: 800, border: '3px solid rgba(212,175,55,0.4)' }}>
            {user?.name?.charAt(0)}
          </div>
          <div>
            <h2 style={{ margin: '0 0 4px', color: '#fff', fontSize: 20, fontWeight: 800 }}>{user?.name}</h2>
            <p style={{ margin: '0 0 8px', color: '#9CA3AF', fontSize: 14 }}>{user?.email}</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ background: 'rgba(212,175,55,0.2)', color: '#D4AF37', padding: '3px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                <Shield size={11} style={{ display: 'inline', marginLeft: 4 }} />
                {user?.role}
              </span>
              <span style={{ background: 'rgba(16,185,129,0.2)', color: '#10B981', padding: '3px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                {user?.branch}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, background: '#fff', borderRadius: 12, padding: 6, marginBottom: 20, boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6', width: 'fit-content' }}>
          {[{ id: 'info', label: 'البيانات الشخصية', icon: User }, { id: 'password', label: 'تغيير كلمة المرور', icon: Lock }].map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setTab(t.id as any)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'Cairo, sans-serif', fontSize: 13, fontWeight: tab === t.id ? 700 : 400, background: tab === t.id ? 'linear-gradient(135deg, #D4AF37, #A07B20)' : 'transparent', color: tab === t.id ? '#000' : '#6B7280' }}>
                <Icon size={14} /> {t.label}
              </button>
            );
          })}
        </div>

        {tab === 'info' && (
          <div style={{ background: '#fff', borderRadius: 14, padding: '24px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 700 }}>البيانات الشخصية</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { key: 'name', label: 'الاسم الكامل', icon: User, type: 'text' },
                { key: 'email', label: 'البريد الإلكتروني', icon: Mail, type: 'email' },
                { key: 'phone', label: 'رقم الهاتف', icon: Phone, type: 'tel' },
              ].map(({ key, label, icon: Icon, type }) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: 13, color: '#374151', marginBottom: 6 }}>{label}</label>
                  <div style={{ position: 'relative' }}>
                    <Icon size={15} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                    <input
                      type={type}
                      value={form[key as keyof typeof form]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      style={{ width: '100%', padding: '11px 40px 11px 12px', border: '1px solid #E5E7EB', borderRadius: 10, fontSize: 13, fontFamily: 'Cairo, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              ))}
              {/* Read-only fields */}
              {[['الدور', user?.role || ''], ['الفرع', user?.branch || '']].map(([label, val]) => (
                <div key={label}>
                  <label style={{ display: 'block', fontSize: 13, color: '#374151', marginBottom: 6 }}>{label}</label>
                  <input value={val} readOnly style={{ width: '100%', padding: '11px 12px', border: '1px solid #E5E7EB', borderRadius: 10, fontSize: 13, fontFamily: 'Cairo, sans-serif', background: '#F9FAFB', color: '#9CA3AF', boxSizing: 'border-box', cursor: 'not-allowed' }} />
                </div>
              ))}
            </div>
            <button onClick={saveInfo} style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 20, padding: '11px 20px', border: 'none', borderRadius: 10, background: 'linear-gradient(135deg, #D4AF37, #A07B20)', cursor: 'pointer', fontSize: 14, fontFamily: 'Cairo, sans-serif', fontWeight: 700, color: '#000' }}>
              <Save size={16} /> حفظ التعديلات
            </button>
          </div>
        )}

        {tab === 'password' && (
          <div style={{ background: '#fff', borderRadius: 14, padding: '24px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 700 }}>تغيير كلمة المرور</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { key: 'current', label: 'كلمة المرور الحالية' },
                { key: 'newPass', label: 'كلمة المرور الجديدة' },
                { key: 'confirm', label: 'تأكيد كلمة المرور الجديدة' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: 13, color: '#374151', marginBottom: 6 }}>{label}</label>
                  <input
                    type="password"
                    value={passwords[key as keyof typeof passwords]}
                    onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                    style={{ width: '100%', padding: '11px 12px', border: '1px solid #E5E7EB', borderRadius: 10, fontSize: 13, fontFamily: 'Cairo, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
              <div style={{ background: '#F0F7FF', border: '1px solid #DBEAFE', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#1E40AF' }}>
                💡 يجب أن تكون كلمة المرور 6 أحرف على الأقل وتحتوي على أرقام وحروف
              </div>
            </div>
            <button onClick={changePassword} style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 20, padding: '11px 20px', border: 'none', borderRadius: 10, background: 'linear-gradient(135deg, #D4AF37, #A07B20)', cursor: 'pointer', fontSize: 14, fontFamily: 'Cairo, sans-serif', fontWeight: 700, color: '#000' }}>
              <Lock size={16} /> تغيير كلمة المرور
            </button>
          </div>
        )}

        {/* Logout */}
        <div style={{ marginTop: 20 }}>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 20px', border: '1px solid #FEE2E2', borderRadius: 10, background: '#FFF5F5', cursor: 'pointer', fontSize: 14, fontFamily: 'Cairo, sans-serif', fontWeight: 600, color: '#EF4444' }}>
            <LogOut size={16} /> تسجيل الخروج من النظام
          </button>
        </div>
      </div>
    </div>
  );
}
