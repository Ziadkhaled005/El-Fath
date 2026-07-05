import { useNavigate } from 'react-router';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  TrendingUp, TrendingDown, Package, AlertTriangle, Clock, CheckCircle,
  DollarSign, BarChart2, Activity, ShoppingBag, Truck, Receipt
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Header } from '../components/Header';
import { dashboardApi, productsApi, normalizeCollection } from '../services/api';

const GOLD = '#D4AF37';
const COLORS = ['#D4AF37', '#A07B20', '#F59E0B', '#6B7280', '#374151'];

const fmt = (n: number) => n.toLocaleString('ar-EG') + ' ج.م';

function StatCard({ title, value, change, icon: Icon, color, onClick, subtitle }: any) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff', borderRadius: 14, padding: '20px 22px',
        boxShadow: '0 1px 8px rgba(0,0,0,0.06)', cursor: 'pointer',
        transition: 'all 0.2s', border: '1px solid #F3F4F6',
      }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 8px rgba(0,0,0,0.06)')}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ margin: '0 0 8px', color: '#6B7280', fontSize: 13 }}>{title}</p>
          <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#111827' }}>{value}</p>
          {subtitle && <p style={{ margin: '4px 0 0', color: '#9CA3AF', fontSize: 12 }}>{subtitle}</p>}
          {change !== undefined && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
              {change >= 0 ? <TrendingUp size={13} color="#10B981" /> : <TrendingDown size={13} color="#EF4444" />}
              <span style={{ fontSize: 12, color: change >= 0 ? '#10B981' : '#EF4444', fontWeight: 600 }}>
                {change >= 0 ? '+' : ''}{change}% مقارنة بالأمس
              </span>
            </div>
          )}
        </div>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: color + '15',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={22} color={color} />
        </div>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, padding: '10px 14px', fontFamily: 'Cairo, sans-serif', fontSize: 12 }}>
      <p style={{ margin: '0 0 6px', fontWeight: 700, color: '#111827' }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ margin: '2px 0', color: p.color }}>{p.name}: {Number(p.value).toLocaleString('ar-EG')} ج.م</p>
      ))}
    </div>
  );
};

export function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [salesChart, setSalesChart] = useState<any[]>([]);
  const [branchPerformance, setBranchPerformance] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsData, chartData, branchData, activityData, productData] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getSalesChart(),
          dashboardApi.getBranchPerformance(),
          dashboardApi.getRecentActivities(),
          productsApi.list({ page: 1, pageSize: 100 }),
        ]);
        setStats(statsData);
        setSalesChart(normalizeCollection(chartData));
        setBranchPerformance(normalizeCollection(branchData));
        setRecentActivities(normalizeCollection(activityData));
        setProducts(normalizeCollection(productData));
      } catch {
        setStats({ todaySales: 0, todayPurchases: 0, inventoryValue: 0, lowStockCount: 0, pendingOrders: 0, pendingApprovals: 0, cashBalance: 0, monthlyRevenue: 0 });
        setSalesChart([]);
        setBranchPerformance([]);
        setRecentActivities([]);
        setProducts([]);
      }
    };
    load();
  }, []);

  const lowStock = useMemo(() => products.filter((p: any) => p.stock <= p.minStock), [products]);
  const dashboardStats = stats ?? { todaySales: 0, todayPurchases: 0, inventoryValue: 0, lowStockCount: 0, pendingOrders: 0, pendingApprovals: 0, cashBalance: 0, monthlyRevenue: 0 };

  return (
    <div style={{ fontFamily: 'Cairo, sans-serif' }}>
      <Header
        title="لوحة التحكم"
        breadcrumbs={[{ label: 'الرئيسية' }, { label: 'لوحة التحكم' }]}
      />

      <div style={{ padding: 24 }}>
        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
          <StatCard title="مبيعات اليوم" value={fmt(dashboardStats.todaySales ?? 0)} change={12.5} icon={ShoppingBag} color="#10B981" onClick={() => navigate('/sales')} />
          <StatCard title="مشتريات اليوم" value={fmt(dashboardStats.todayPurchases ?? 0)} change={-3.2} icon={Truck} color="#3B82F6" onClick={() => navigate('/purchases')} />
          <StatCard title="قيمة المخزون" value={fmt(dashboardStats.inventoryValue ?? 0)} icon={Package} color={GOLD} onClick={() => navigate('/inventory')} />
          <StatCard title="الرصيد النقدي" value={fmt(dashboardStats.cashBalance ?? 0)} change={8.1} icon={DollarSign} color="#8B5CF6" onClick={() => navigate('/accounting')} />
          <StatCard title="منتجات منخفضة المخزون" value={dashboardStats.lowStockCount ?? 0} icon={AlertTriangle} color="#F59E0B" onClick={() => navigate('/inventory')} subtitle="تحتاج إعادة تعبئة" />
          <StatCard title="طلبات معلقة" value={dashboardStats.pendingOrders ?? 0} icon={Clock} color="#EF4444" onClick={() => navigate('/purchases')} subtitle="بانتظار المعالجة" />
          <StatCard title="بانتظار الموافقة" value={dashboardStats.pendingApprovals ?? 0} icon={CheckCircle} color="#F59E0B" onClick={() => navigate('/expenses')} subtitle="مصروفات وطلبات" />
          <StatCard title="إيرادات الشهر" value={fmt(dashboardStats.monthlyRevenue ?? 0)} change={18.4} icon={BarChart2} color="#10B981" onClick={() => navigate('/reports')} />
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 20 }}>
          {/* Sales/Purchase Chart */}
          <div style={{ background: '#fff', borderRadius: 14, padding: '20px 22px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#111827' }}>المبيعات والمشتريات الشهرية</h3>
              <button onClick={() => navigate('/reports')} style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12, color: '#6B7280', fontFamily: 'Cairo, sans-serif' }}>
                عرض التقارير
              </button>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={salesChart}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={GOLD} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={GOLD} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="purchGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="month" tick={{ fontFamily: 'Cairo, sans-serif', fontSize: 12 }} />
                <YAxis tick={{ fontFamily: 'Cairo, sans-serif', fontSize: 11 }} tickFormatter={v => (v / 1000) + 'ك'} />
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={v => v === 'sales' ? 'المبيعات' : 'المشتريات'} wrapperStyle={{ fontFamily: 'Cairo, sans-serif', fontSize: 12 }} />
                <Area type="monotone" dataKey="sales" name="sales" stroke={GOLD} fill="url(#salesGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="purchases" name="purchases" stroke="#3B82F6" fill="url(#purchGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Branch Pie */}
          <div style={{ background: '#fff', borderRadius: 14, padding: '20px 22px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#111827' }}>أداء الفروع</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={branchPerformance} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {branchPerformance.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => v + '%'} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {branchPerformance.map((b, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[i % COLORS.length] }} />
                    <span style={{ fontSize: 12, color: '#6B7280' }}>{b.name}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>{b.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Recent Activities */}
          <div style={{ background: '#fff', borderRadius: 14, padding: '20px 22px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#111827' }}>آخر الأنشطة</h3>
              <Activity size={16} color="#9CA3AF" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recentActivities.map((a: any) => {
                const colors: Record<string, string> = { sale: '#10B981', inventory: GOLD, purchase: '#3B82F6', customer: '#8B5CF6', expense: '#EF4444' };
                return (
                  <div key={a.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: colors[a.type], marginTop: 6, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#111827' }}>{a.action}</p>
                      <p style={{ margin: '2px 0 0', fontSize: 12, color: '#9CA3AF' }}>{a.details}</p>
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      {a.amount && <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: colors[a.type] }}>{a.amount.toLocaleString('ar-EG')} ج.م</p>}
                      <p style={{ margin: '2px 0 0', fontSize: 11, color: '#9CA3AF' }}>{a.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Low Stock Alert */}
          <div style={{ background: '#fff', borderRadius: 14, padding: '20px 22px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#111827' }}>تنبيهات المخزون</h3>
              <button onClick={() => navigate('/inventory')} style={{ background: '#FEF3C7', border: 'none', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontSize: 12, color: '#D97706', fontFamily: 'Cairo, sans-serif' }}>
                عرض الكل
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {lowStock.map((p: any) => (
                <div key={p.id} onClick={() => navigate('/inventory')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#FFF7ED', borderRadius: 10, cursor: 'pointer', border: '1px solid #FED7AA' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#111827' }}>{p.name}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: '#9CA3AF' }}>الحد الأدنى: {p.minStock} {p.unit}</p>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <span style={{ background: p.stock < p.minStock / 2 ? '#FEE2E2' : '#FEF3C7', color: p.stock < p.minStock / 2 ? '#DC2626' : '#D97706', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                      {p.stock} {p.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
