import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Search, Plus, Minus, Trash2, Printer, FileText, Mail, CreditCard, Banknote, Building2, Pause, Play, X, ChevronDown } from 'lucide-react';
import { PRODUCTS, CUSTOMERS, COMPANY } from '../data/mockData';
import { useApp } from '../context/AppContext';

interface CartItem {
  product: typeof PRODUCTS[0];
  qty: number;
  discount: number;
}

const TAX_RATE = 0.14;

export function POS() {
  const { addToast } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<typeof CUSTOMERS[0] | null>(null);
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'visa' | 'transfer'>('cash');
  const [cashReceived, setCashReceived] = useState('');
  const [heldInvoices, setHeldInvoices] = useState<CartItem[][]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [showHeld, setShowHeld] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');

  const categories = [...new Set(PRODUCTS.map(p => p.category))];
  const filtered = PRODUCTS.filter(p =>
    (p.name.includes(search) || p.code.includes(search) || p.barcode.includes(search)) &&
    (!categoryFilter || p.category === categoryFilter)
  );

  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty * (1 - i.discount / 100), 0);
  const discountAmt = subtotal * (globalDiscount / 100);
  const taxable = subtotal - discountAmt;
  const tax = taxable * TAX_RATE;
  const total = taxable + tax;
  const change = parseFloat(cashReceived || '0') - total;

  const addToCart = (product: typeof PRODUCTS[0]) => {
    if (product.stock === 0) { addToast({ type: 'error', message: 'هذا المنتج غير متوفر في المخزون' }); return; }
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, qty: Math.min(i.qty + 1, product.stock) } : i);
      return [...prev, { product, qty: 1, discount: 0 }];
    });
  };

  const updateQty = (id: number, qty: number) => {
    if (qty <= 0) setCart(prev => prev.filter(i => i.product.id !== id));
    else setCart(prev => prev.map(i => i.product.id === id ? { ...i, qty: Math.min(qty, i.product.stock) } : i));
  };

  const updateDiscount = (id: number, discount: number) => {
    setCart(prev => prev.map(i => i.product.id === id ? { ...i, discount: Math.min(100, Math.max(0, discount)) } : i));
  };

  const holdInvoice = () => {
    if (cart.length === 0) return;
    setHeldInvoices(prev => [...prev, cart]);
    setCart([]);
    addToast({ type: 'info', message: 'تم إيقاف الفاتورة مؤقتاً' });
  };

  const resumeInvoice = (idx: number) => {
    setCart(heldInvoices[idx]);
    setHeldInvoices(prev => prev.filter((_, i) => i !== idx));
    setShowHeld(false);
  };

  const completeSale = () => {
    if (cart.length === 0) { addToast({ type: 'error', message: 'السلة فارغة' }); return; }
    addToast({ type: 'success', message: `تم إتمام البيع بنجاح - الإجمالي: ${total.toFixed(2)} ج.م` });
    setCart([]);
    setShowPayment(false);
    setGlobalDiscount(0);
    setCashReceived('');
    setSelectedCustomer(null);
  };

  const printInvoice = () => {
    addToast({ type: 'info', message: 'جارٍ طباعة الفاتورة...' });
    completeSale();
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh)', fontFamily: 'Cairo, sans-serif', background: '#F3F4F6', overflow: 'hidden' }}>
      {/* Products Panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ background: '#111827', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: 13, fontFamily: 'Cairo, sans-serif' }}>
              ← لوحة التحكم
            </button>
            <h2 style={{ color: '#D4AF37', margin: 0, fontSize: 16, fontWeight: 700 }}>نقطة البيع</h2>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {heldInvoices.length > 0 && (
              <button onClick={() => setShowHeld(!showHeld)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#374151', border: 'none', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', color: '#D4AF37', fontSize: 13, fontFamily: 'Cairo, sans-serif' }}>
                <Play size={14} /> الفواتير المعلقة ({heldInvoices.length})
              </button>
            )}
            <button onClick={holdInvoice} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#374151', border: 'none', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', color: '#9CA3AF', fontSize: 13, fontFamily: 'Cairo, sans-serif' }}>
              <Pause size={14} /> إيقاف مؤقت
            </button>
          </div>
        </div>

        {/* Search & Categories */}
        <div style={{ background: '#fff', padding: '12px 20px', borderBottom: '1px solid #E5E7EB' }}>
          <div style={{ position: 'relative', marginBottom: 10 }}>
            <Search size={16} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="ابحث بالاسم أو الكود أو الباركود..."
              style={{ width: '100%', padding: '10px 40px 10px 16px', border: '1px solid #E5E7EB', borderRadius: 10, fontSize: 13, fontFamily: 'Cairo, sans-serif', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            <button onClick={() => setCategoryFilter('')} style={{ padding: '4px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', background: !categoryFilter ? '#D4AF37' : '#F3F4F6', color: !categoryFilter ? '#000' : '#6B7280', fontSize: 12, fontFamily: 'Cairo, sans-serif', whiteSpace: 'nowrap' }}>
              الكل
            </button>
            {categories.map(c => (
              <button key={c} onClick={() => setCategoryFilter(c === categoryFilter ? '' : c)} style={{ padding: '4px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', background: categoryFilter === c ? '#D4AF37' : '#F3F4F6', color: categoryFilter === c ? '#000' : '#6B7280', fontSize: 12, fontFamily: 'Cairo, sans-serif', whiteSpace: 'nowrap' }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
            {filtered.map(p => (
              <div
                key={p.id}
                onClick={() => addToCart(p)}
                style={{
                  background: '#fff', borderRadius: 12, padding: 14,
                  cursor: p.stock > 0 ? 'pointer' : 'not-allowed',
                  opacity: p.stock === 0 ? 0.5 : 1,
                  border: '1px solid #F3F4F6',
                  transition: 'all 0.2s',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                }}
                onMouseEnter={e => p.stock > 0 && (e.currentTarget.style.boxShadow = '0 4px 16px rgba(212,175,55,0.2)', e.currentTarget.style.borderColor = '#D4AF37')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)', e.currentTarget.style.borderColor = '#F3F4F6')}
              >
                <div style={{ width: '100%', height: 80, background: 'linear-gradient(135deg, #FFF7ED, #FEF3C7)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10, fontSize: 28 }}>
                  🧴
                </div>
                <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 600, color: '#111827', lineHeight: 1.3 }}>{p.name}</p>
                <p style={{ margin: '0 0 6px', fontSize: 11, color: '#9CA3AF' }}>{p.code}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#D4AF37' }}>{p.price.toLocaleString('ar-EG')} ج.م</span>
                  <span style={{ fontSize: 11, color: p.stock <= p.minStock ? '#EF4444' : '#10B981' }}>
                    {p.stock} {p.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Panel */}
      <div style={{ width: 380, background: '#fff', borderRight: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', boxShadow: '-4px 0 20px rgba(0,0,0,0.05)' }}>
        {/* Customer */}
        <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #F3F4F6' }}>
          <select
            value={selectedCustomer?.id || ''}
            onChange={e => setSelectedCustomer(CUSTOMERS.find(c => c.id === Number(e.target.value)) || null)}
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: 10, fontSize: 13, fontFamily: 'Cairo, sans-serif', outline: 'none', color: '#111827' }}
          >
            <option value="">-- اختر العميل (عميل نقدي) --</option>
            {CUSTOMERS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {/* Cart items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9CA3AF' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
              <p style={{ margin: 0, fontSize: 14 }}>السلة فارغة</p>
              <p style={{ margin: '4px 0 0', fontSize: 12 }}>اضغط على منتج لإضافته</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 8 }}>
              {cart.map(item => (
                <div key={item.product.id} style={{ background: '#F9FAFB', borderRadius: 10, padding: '10px 12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#111827' }}>{item.product.name}</p>
                      <p style={{ margin: '2px 0 0', fontSize: 11, color: '#9CA3AF' }}>{item.product.price.toLocaleString('ar-EG')} ج.م / {item.product.unit}</p>
                    </div>
                    <button onClick={() => setCart(prev => prev.filter(i => i.product.id !== item.product.id))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <button onClick={() => updateQty(item.product.id, item.qty - 1)} style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Minus size={12} />
                      </button>
                      <input
                        type="number" value={item.qty} min={1} max={item.product.stock}
                        onChange={e => updateQty(item.product.id, Number(e.target.value))}
                        style={{ width: 40, textAlign: 'center', border: '1px solid #E5E7EB', borderRadius: 6, padding: '4px', fontSize: 13, fontFamily: 'Cairo, sans-serif' }}
                      />
                      <button onClick={() => updateQty(item.product.id, item.qty + 1)} style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Plus size={12} />
                      </button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <input
                        type="number" value={item.discount} min={0} max={100}
                        onChange={e => updateDiscount(item.product.id, Number(e.target.value))}
                        style={{ width: 50, textAlign: 'center', border: '1px solid #E5E7EB', borderRadius: 6, padding: '4px', fontSize: 12, fontFamily: 'Cairo, sans-serif' }}
                      />
                      <span style={{ fontSize: 11, color: '#9CA3AF' }}>%خصم</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#D4AF37', minWidth: 70, textAlign: 'left' }}>
                      {(item.product.price * item.qty * (1 - item.discount / 100)).toFixed(2)} ج.م
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Totals */}
        <div style={{ borderTop: '1px solid #F3F4F6', padding: '16px' }}>
          <div style={{ background: '#F9FAFB', borderRadius: 12, padding: 14, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: '#6B7280' }}>المجموع الجزئي</span>
              <span style={{ fontSize: 13, color: '#111827' }}>{subtotal.toFixed(2)} ج.م</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: '#6B7280' }}>خصم عام %</span>
              <input
                type="number" value={globalDiscount} min={0} max={100}
                onChange={e => setGlobalDiscount(Number(e.target.value))}
                style={{ width: 60, textAlign: 'center', border: '1px solid #E5E7EB', borderRadius: 6, padding: '3px', fontSize: 12, fontFamily: 'Cairo, sans-serif' }}
              />
            </div>
            {globalDiscount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: '#EF4444' }}>قيمة الخصم</span>
                <span style={{ fontSize: 13, color: '#EF4444' }}>- {discountAmt.toFixed(2)} ج.م</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: '#6B7280' }}>ضريبة القيمة المضافة (14%)</span>
              <span style={{ fontSize: 13, color: '#111827' }}>{tax.toFixed(2)} ج.م</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid #E5E7EB' }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#111827' }}>الإجمالي</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: '#D4AF37' }}>{total.toFixed(2)} ج.م</span>
            </div>
          </div>

          {/* Payment methods */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
            {([['cash', 'نقدي', Banknote], ['visa', 'فيزا', CreditCard], ['transfer', 'تحويل', Building2]] as const).map(([m, label, Icon]) => (
              <button
                key={m}
                onClick={() => setPaymentMethod(m)}
                style={{
                  flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  padding: '8px 6px', borderRadius: 10, border: '2px solid',
                  borderColor: paymentMethod === m ? '#D4AF37' : '#E5E7EB',
                  background: paymentMethod === m ? '#FFF9E6' : '#F9FAFB',
                  cursor: 'pointer', fontFamily: 'Cairo, sans-serif',
                }}
              >
                <Icon size={16} color={paymentMethod === m ? '#D4AF37' : '#9CA3AF'} />
                <span style={{ fontSize: 11, color: paymentMethod === m ? '#D4AF37' : '#6B7280', fontWeight: paymentMethod === m ? 700 : 400 }}>{label}</span>
              </button>
            ))}
          </div>

          {paymentMethod === 'cash' && (
            <div style={{ marginBottom: 10 }}>
              <input
                type="number" value={cashReceived} onChange={e => setCashReceived(e.target.value)}
                placeholder="المبلغ المستلم"
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: 10, fontSize: 14, fontFamily: 'Cairo, sans-serif', outline: 'none', boxSizing: 'border-box' }}
              />
              {cashReceived && change >= 0 && (
                <p style={{ margin: '6px 0 0', fontSize: 13, color: '#10B981', fontWeight: 600 }}>
                  الباقي: {change.toFixed(2)} ج.م
                </p>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={printInvoice} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 12, background: 'linear-gradient(135deg, #D4AF37, #A07B20)', border: 'none', borderRadius: 10, cursor: 'pointer', color: '#000', fontWeight: 700, fontSize: 14, fontFamily: 'Cairo, sans-serif' }}>
              <Printer size={16} /> طباعة وإتمام
            </button>
            <button onClick={completeSale} style={{ padding: 12, background: '#111827', border: 'none', borderRadius: 10, cursor: 'pointer', color: '#fff', fontFamily: 'Cairo, sans-serif' }}>
              <FileText size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Held invoices modal */}
      {showHeld && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, width: 400, maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontFamily: 'Cairo, sans-serif' }}>الفواتير المعلقة</h3>
              <button onClick={() => setShowHeld(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            {heldInvoices.map((inv, idx) => (
              <div key={idx} style={{ border: '1px solid #E5E7EB', borderRadius: 10, padding: 14, marginBottom: 10 }}>
                <p style={{ margin: '0 0 6px', fontWeight: 600, fontFamily: 'Cairo, sans-serif' }}>فاتورة #{idx + 1} ({inv.length} منتجات)</p>
                <p style={{ margin: '0 0 10px', fontSize: 13, color: '#9CA3AF', fontFamily: 'Cairo, sans-serif' }}>
                  الإجمالي: {inv.reduce((s, i) => s + i.product.price * i.qty, 0).toFixed(2)} ج.م
                </p>
                <button onClick={() => resumeInvoice(idx)} style={{ width: '100%', padding: '8px', background: '#D4AF37', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                  استئناف
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
