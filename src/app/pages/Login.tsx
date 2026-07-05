import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import logo from '../../imports/0.png';

export function Login() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) { setError('يرجى إدخال اسم المستخدم وكلمة المرور'); return; }
    setLoading(true);
    setError('');
    const ok = await login(username, password);
    if (ok) navigate('/dashboard');
    else { setError('اسم المستخدم أو كلمة المرور غير صحيحة'); setLoading(false); }
  };

  return (
    <div dir="rtl" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 50%, #0d0d0d 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Cairo, sans-serif',
      padding: 24,
    }}>
      {/* Background pattern */}
      <div style={{
        position: 'fixed', inset: 0, opacity: 0.03,
        backgroundImage: 'radial-gradient(circle at 2px 2px, #D4AF37 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }} />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative' }}>
        {/* Logo card */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(212,175,55,0.2)',
          borderRadius: 20,
          padding: '40px 36px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <img src={logo} alt="الفتح" style={{ width: 80, height: 80, borderRadius: '50%', margin: '0 auto 16px' }} />
            <h1 style={{ color: '#D4AF37', margin: 0, fontSize: 20, fontWeight: 800 }}>شركة الفتح</h1>
            <p style={{ color: '#9CA3AF', margin: '4px 0 0', fontSize: 12 }}>لإنتاج وتقطير الزيوت العطرية</p>
            <div style={{ margin: '20px auto 0', height: 1, background: 'linear-gradient(to right, transparent, #D4AF37, transparent)', maxWidth: 200 }} />
          </div>

          <h2 style={{ color: '#fff', textAlign: 'center', fontSize: 16, marginBottom: 24, fontWeight: 600 }}>
            تسجيل الدخول إلى النظام
          </h2>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 10, padding: '12px 16px', marginBottom: 16,
              display: 'flex', alignItems: 'center', gap: 8, color: '#FCA5A5', fontSize: 13,
            }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', color: '#D1D5DB', fontSize: 13, marginBottom: 6 }}>اسم المستخدم</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', top: '50%', right: 12, transform: 'translateY(-50%)', color: '#6B7280' }} />
                <input
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="أدخل اسم المستخدم"
                  style={{
                    width: '100%', padding: '12px 40px 12px 16px',
                    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 10, color: '#fff', fontSize: 14, fontFamily: 'Cairo, sans-serif',
                    outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', color: '#D1D5DB', fontSize: 13, marginBottom: 6 }}>كلمة المرور</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', top: '50%', right: 12, transform: 'translateY(-50%)', color: '#6B7280' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور"
                  style={{
                    width: '100%', padding: '12px 40px 12px 40px',
                    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 10, color: '#fff', fontSize: 14, fontFamily: 'Cairo, sans-serif',
                    outline: 'none', boxSizing: 'border-box',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', top: '50%', left: 12, transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#D4AF37', fontSize: 12, fontFamily: 'Cairo, sans-serif' }}
              >
                نسيت كلمة المرور؟
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px',
                background: loading ? 'rgba(212,175,55,0.5)' : 'linear-gradient(135deg, #D4AF37, #A07B20)',
                border: 'none', borderRadius: 10, cursor: loading ? 'not-allowed' : 'pointer',
                color: '#000', fontWeight: 700, fontSize: 15, fontFamily: 'Cairo, sans-serif',
                transition: 'all 0.2s',
              }}
            >
              {loading ? 'جارٍ تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>

          <div style={{ marginTop: 24, padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ color: '#6B7280', fontSize: 11, margin: 0, textAlign: 'center' }}>
              بيانات الدخول التجريبية: admin / 123456
            </p>
          </div>
        </div>

        <p style={{ color: '#4B5563', fontSize: 11, textAlign: 'center', marginTop: 20 }}>
          جميع الحقوق محفوظة © 2024 شركة الفتح لإنتاج وتقطير الزيوت العطرية
        </p>
      </div>
    </div>
  );
}
