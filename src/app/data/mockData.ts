export const COMPANY = {
  name: 'شركة الفتح لإنتاج وتقطير الزيوت العطرية',
  nameEn: 'Al-Fath Essential Oils Co.',
  address: 'القاهرة، مصر، شارع الصناعات، المنطقة الصناعية',
  phone: '01012345678',
  email: 'info@alfath-oils.com',
  taxNumber: '123-456-789',
  currency: 'ج.م',
  currencyCode: 'EGP',
};

export const BRANCHES = [
  { id: 1, name: 'الفرع الرئيسي - القاهرة', city: 'القاهرة', phone: '01012345678', manager: 'أحمد محمد', status: 'active', employees: 12, sales: 245000 },
  { id: 2, name: 'فرع الإسكندرية', city: 'الإسكندرية', phone: '01023456789', manager: 'محمود علي', status: 'active', employees: 8, sales: 187000 },
  { id: 3, name: 'فرع الجيزة', city: 'الجيزة', phone: '01034567890', manager: 'سارة أحمد', status: 'active', employees: 6, sales: 132000 },
  { id: 4, name: 'فرع أسيوط', city: 'أسيوط', phone: '01045678901', manager: 'خالد حسن', status: 'active', employees: 5, sales: 98000 },
  { id: 5, name: 'فرع طنطا', city: 'طنطا', phone: '01056789012', manager: 'منى إبراهيم', status: 'inactive', employees: 4, sales: 74000 },
];

export const PRODUCTS = [
  { id: 1, code: 'OIL-001', name: 'زيت الورد الطائفي', category: 'زيوت الورد', unit: 'مل', price: 850, cost: 420, stock: 245, minStock: 50, barcode: '6001234567890', brand: 'الفتح', expiry: '2025-12-31' },
  { id: 2, code: 'OIL-002', name: 'زيت اللافندر الخالص', category: 'زيوت اللافندر', unit: 'مل', price: 620, cost: 310, stock: 180, minStock: 40, barcode: '6001234567891', brand: 'الفتح', expiry: '2026-03-15' },
  { id: 3, code: 'OIL-003', name: 'زيت الياسمين المصري', category: 'زيوت الياسمين', unit: 'مل', price: 1200, cost: 600, stock: 95, minStock: 30, barcode: '6001234567892', brand: 'الفتح', expiry: '2025-09-20' },
  { id: 4, code: 'OIL-004', name: 'زيت العود الأصيل', category: 'زيوت العود', unit: 'مل', price: 3500, cost: 1800, stock: 42, minStock: 20, barcode: '6001234567893', brand: 'الفتح', expiry: '2027-01-10' },
  { id: 5, code: 'OIL-005', name: 'زيت البخور الممتاز', category: 'زيوت البخور', unit: 'جرام', price: 450, cost: 220, stock: 320, minStock: 60, barcode: '6001234567894', brand: 'الفتح', expiry: '2026-06-30' },
  { id: 6, code: 'OIL-006', name: 'زيت الفل الهندي', category: 'زيوت الفل', unit: 'مل', price: 780, cost: 390, stock: 18, minStock: 25, barcode: '6001234567895', brand: 'الفتح', expiry: '2025-11-15' },
  { id: 7, code: 'OIL-007', name: 'معطر الهواء بالورد', category: 'معطرات', unit: 'قطعة', price: 120, cost: 55, stock: 450, minStock: 80, barcode: '6001234567896', brand: 'الفتح', expiry: '2026-08-20' },
  { id: 8, code: 'OIL-008', name: 'زيت الجوري الطبيعي', category: 'زيوت الورد', unit: 'مل', price: 950, cost: 480, stock: 8, minStock: 30, barcode: '6001234567897', brand: 'الفتح', expiry: '2025-07-31' },
];

export const CUSTOMERS = [
  { id: 1, name: 'محل عطور النجوم', phone: '01111111111', email: 'nojom@email.com', address: 'القاهرة، شارع التحرير', balance: 12500, credit: 20000, group: 'تجزئة', purchases: 87500, branch: 1 },
  { id: 2, name: 'شركة أرواح الشرق', phone: '01222222222', email: 'arwah@email.com', address: 'الإسكندرية، المنتزه', balance: -3200, credit: 50000, group: 'جملة', purchases: 245000, branch: 1 },
  { id: 3, name: 'مؤسسة طيب الريح', phone: '01333333333', email: 'tayyeb@email.com', address: 'الجيزة، الدقي', balance: 8700, credit: 15000, group: 'تجزئة', purchases: 52000, branch: 2 },
  { id: 4, name: 'متجر الزهور العطرية', phone: '01444444444', email: 'zuhoor@email.com', address: 'القاهرة، مدينة نصر', balance: 0, credit: 10000, group: 'تجزئة', purchases: 34500, branch: 1 },
  { id: 5, name: 'شركة الخليج للعطور', phone: '01555555555', email: 'khalij@email.com', address: 'القاهرة، مصر الجديدة', balance: 25000, credit: 100000, group: 'جملة', purchases: 380000, branch: 1 },
];

export const SUPPLIERS = [
  { id: 1, name: 'مزرعة الورد الطائفي', phone: '01666666666', email: 'ward@email.com', address: 'الطائف، المملكة العربية السعودية', balance: 45000, purchases: 320000 },
  { id: 2, name: 'شركة استيراد الزيوت', phone: '01777777777', email: 'import@email.com', address: 'القاهرة، المناطق الحرة', balance: 12000, purchases: 185000 },
  { id: 3, name: 'مصنع الزجاجات الذهبية', phone: '01888888888', email: 'bottles@email.com', address: 'الإسكندرية، المنطقة الصناعية', balance: 8500, purchases: 95000 },
  { id: 4, name: 'موردو المواد الكيميائية', phone: '01999999999', email: 'chem@email.com', address: 'القاهرة', balance: 0, purchases: 67000 },
];

export const EMPLOYEES = [
  { id: 1, name: 'أحمد محمد السيد', position: 'مدير الفرع', department: 'الإدارة', salary: 8500, branch: 1, phone: '01012345678', attendance: 26, vacations: 2, status: 'active' },
  { id: 2, name: 'فاطمة علي حسن', position: 'محاسبة', department: 'المالية', salary: 5500, branch: 1, phone: '01023456789', attendance: 28, vacations: 0, status: 'active' },
  { id: 3, name: 'محمود إبراهيم', position: 'كاشير', department: 'المبيعات', salary: 4000, branch: 1, phone: '01034567890', attendance: 25, vacations: 3, status: 'active' },
  { id: 4, name: 'سارة خالد', position: 'مسؤولة مخزن', department: 'المخازن', salary: 4500, branch: 2, phone: '01045678901', attendance: 27, vacations: 1, status: 'active' },
  { id: 5, name: 'علي حسن عمر', position: 'مندوب مبيعات', department: 'المبيعات', salary: 3500, branch: 2, phone: '01056789012', attendance: 24, vacations: 4, status: 'active' },
];

export const SALES_INVOICES = [
  { id: 'INV-2024-001', date: '2024-06-15', customer: 'شركة أرواح الشرق', branch: 'الرئيسي', total: 18500, discount: 500, tax: 900, paid: 18900, status: 'paid', items: 5 },
  { id: 'INV-2024-002', date: '2024-06-14', customer: 'محل عطور النجوم', branch: 'الرئيسي', total: 7200, discount: 0, tax: 360, paid: 5000, status: 'partial', items: 3 },
  { id: 'INV-2024-003', date: '2024-06-13', customer: 'شركة الخليج للعطور', branch: 'الرئيسي', total: 45000, discount: 2000, tax: 2150, paid: 45150, status: 'paid', items: 12 },
  { id: 'INV-2024-004', date: '2024-06-12', customer: 'مؤسسة طيب الريح', branch: 'الجيزة', total: 3800, discount: 0, tax: 190, paid: 0, status: 'unpaid', items: 2 },
  { id: 'INV-2024-005', date: '2024-06-11', customer: 'متجر الزهور العطرية', branch: 'الرئيسي', total: 9600, discount: 200, tax: 470, paid: 9870, status: 'paid', items: 7 },
];

export const PURCHASES = [
  { id: 'PO-2024-001', date: '2024-06-10', supplier: 'مزرعة الورد الطائفي', branch: 'الرئيسي', total: 85000, status: 'approved', items: 8 },
  { id: 'PO-2024-002', date: '2024-06-08', supplier: 'شركة استيراد الزيوت', branch: 'الرئيسي', total: 42000, status: 'pending', items: 5 },
  { id: 'PO-2024-003', date: '2024-06-05', supplier: 'مصنع الزجاجات الذهبية', branch: 'الإسكندرية', total: 18500, status: 'approved', items: 3 },
  { id: 'PO-2024-004', date: '2024-06-01', supplier: 'موردو المواد الكيميائية', branch: 'الرئيسي', total: 12000, status: 'rejected', items: 2 },
];

export const EXPENSES = [
  { id: 'EXP-001', date: '2024-06-15', category: 'إيجار', description: 'إيجار الفرع الرئيسي - يونيو', amount: 15000, branch: 'الرئيسي', status: 'approved', submittedBy: 'أحمد محمد' },
  { id: 'EXP-002', date: '2024-06-14', category: 'كهرباء', description: 'فاتورة كهرباء يونيو', amount: 3500, branch: 'الرئيسي', status: 'pending', submittedBy: 'فاطمة علي' },
  { id: 'EXP-003', date: '2024-06-13', category: 'رواتب', description: 'سلفة راتب موظف', amount: 2000, branch: 'الجيزة', status: 'pending', submittedBy: 'سارة خالد' },
  { id: 'EXP-004', date: '2024-06-12', category: 'صيانة', description: 'صيانة معدات التقطير', amount: 8500, branch: 'الرئيسي', status: 'approved', submittedBy: 'محمود إبراهيم' },
  { id: 'EXP-005', date: '2024-06-10', category: 'نقل', description: 'مصاريف شحن بضاعة', amount: 1200, branch: 'الإسكندرية', status: 'rejected', submittedBy: 'علي حسن' },
];

export const DASHBOARD_STATS = {
  todaySales: 24750,
  todayPurchases: 18500,
  inventoryValue: 1250000,
  lowStockCount: 4,
  pendingOrders: 7,
  pendingApprovals: 3,
  cashBalance: 85000,
  monthlyRevenue: 736000,
};

export const SALES_CHART_DATA = [
  { month: 'يناير', sales: 185000, purchases: 92000 },
  { month: 'فبراير', sales: 210000, purchases: 105000 },
  { month: 'مارس', sales: 198000, purchases: 98000 },
  { month: 'أبريل', sales: 245000, purchases: 120000 },
  { month: 'مايو', sales: 285000, purchases: 145000 },
  { month: 'يونيو', sales: 320000, purchases: 165000 },
];

export const BRANCH_PERFORMANCE = [
  { name: 'القاهرة', value: 40 },
  { name: 'الإسكندرية', value: 25 },
  { name: 'الجيزة', value: 18 },
  { name: 'أسيوط', value: 11 },
  { name: 'طنطا', value: 6 },
];

export const RECENT_ACTIVITIES = [
  { id: 1, action: 'فاتورة مبيعات جديدة', details: 'INV-2024-001 - شركة أرواح الشرق', amount: 18500, time: 'منذ 30 دقيقة', type: 'sale' },
  { id: 2, action: 'تعديل المخزون', details: 'زيت الورد الطائفي - إضافة 50 وحدة', amount: null, time: 'منذ ساعة', type: 'inventory' },
  { id: 3, action: 'طلب شراء معلق', details: 'PO-2024-002 - شركة استيراد الزيوت', amount: 42000, time: 'منذ 2 ساعة', type: 'purchase' },
  { id: 4, action: 'عميل جديد', details: 'تم إضافة متجر الأريج', amount: null, time: 'منذ 3 ساعات', type: 'customer' },
  { id: 5, action: 'صرف مصروف', details: 'فاتورة كهرباء يونيو', amount: 3500, time: 'منذ 4 ساعات', type: 'expense' },
];

export const ROLES = [
  { id: 1, name: 'مدير النظام', description: 'صلاحيات كاملة على النظام', users: 2, status: 'active', isSystem: true },
  { id: 2, name: 'مدير فرع', description: 'إدارة فرع واحد بالكامل', users: 5, status: 'active', isSystem: false },
  { id: 3, name: 'كاشير', description: 'عمليات البيع فقط', users: 8, status: 'active', isSystem: false },
  { id: 4, name: 'محاسب', description: 'العمليات المالية والتقارير', users: 3, status: 'active', isSystem: false },
  { id: 5, name: 'مسؤول مخزن', description: 'إدارة المخزون والمستودعات', users: 4, status: 'active', isSystem: false },
  { id: 6, name: 'مندوب مبيعات', description: 'متابعة العملاء والمبيعات', users: 6, status: 'inactive', isSystem: false },
];

export const USERS = [
  { id: 1, name: 'أحمد محمد السيد', username: 'ahmed.admin', email: 'ahmed@alfath.com', role: 'مدير النظام', branch: 'الكل', status: 'active', lastLogin: '2024-06-15 09:30' },
  { id: 2, name: 'فاطمة علي حسن', username: 'fatma.acc', email: 'fatma@alfath.com', role: 'محاسب', branch: 'الرئيسي', status: 'active', lastLogin: '2024-06-15 08:45' },
  { id: 3, name: 'محمود إبراهيم', username: 'mahmoud.cashier', email: 'mahmoud@alfath.com', role: 'كاشير', branch: 'الرئيسي', status: 'active', lastLogin: '2024-06-15 10:00' },
  { id: 4, name: 'سارة خالد', username: 'sara.store', email: 'sara@alfath.com', role: 'مسؤول مخزن', branch: 'الإسكندرية', status: 'active', lastLogin: '2024-06-14 16:20' },
  { id: 5, name: 'خالد حسن', username: 'khaled.mgr', email: 'khaled@alfath.com', role: 'مدير فرع', branch: 'أسيوط', status: 'inactive', lastLogin: '2024-06-10 11:00' },
];

export const NOTIFICATIONS = [
  { id: 1, type: 'warning', title: 'مخزون منخفض', message: 'زيت الجوري الطبيعي - المخزون 8 وحدات فقط', time: 'منذ 10 دقائق', read: false },
  { id: 2, type: 'warning', title: 'مخزون منخفض', message: 'زيت الفل الهندي - المخزون 18 وحدة (أقل من الحد الأدنى)', time: 'منذ 30 دقيقة', read: false },
  { id: 3, type: 'info', title: 'طلب موافقة', message: 'مصروف جديد بانتظار الموافقة - فاتورة كهرباء يونيو', time: 'منذ ساعة', read: false },
  { id: 4, type: 'info', title: 'طلب شراء جديد', message: 'PO-2024-002 من شركة استيراد الزيوت بانتظار المراجعة', time: 'منذ 2 ساعة', read: true },
  { id: 5, type: 'success', title: 'تحصيل ناجح', message: 'تم استلام دفعة من شركة أرواح الشرق - 18,900 ج.م', time: 'منذ 3 ساعات', read: true },
  { id: 6, type: 'warning', title: 'تنبيه موظف', message: 'علي حسن - 4 أيام غياب هذا الشهر', time: 'منذ 5 ساعات', read: true },
];
