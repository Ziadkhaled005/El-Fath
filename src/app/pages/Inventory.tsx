import { useEffect, useState } from "react";
import {
    Plus,
    Search,
    Download,
    AlertTriangle,
    Edit,
    Trash2,
    X,
    Package,
} from "lucide-react";
import { Header } from "../components/Header";
import { PRODUCTS } from "../data/mockData";
import { useApp } from "../context/AppContext";
import { normalizeCollection, productsApi } from "../services/api";

type Product = (typeof PRODUCTS)[0];

export function Inventory() {
    const { addToast } = useApp();
    const [search, setSearch] = useState("");
    const [catFilter, setCatFilter] = useState("");
    const [products, setProducts] = useState<Product[]>(PRODUCTS);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [editProduct, setEditProduct] = useState<Product | null>(null);
    const [showAdjust, setShowAdjust] = useState<Product | null>(null);
    const [adjustQty, setAdjustQty] = useState("");
    const [adjustReason, setAdjustReason] = useState("");
    const [form, setForm] = useState({
        name: "",
        code: "",
        category: "",
        unit: "مل",
        price: "",
        cost: "",
        stock: "",
        minStock: "",
        barcode: "",
    });
    const [page, setPage] = useState(1);
    const PER_PAGE = 6;

    const categories = [...new Set(products.map((p) => p.category))];
    const filtered = products.filter(
        (p) =>
            (p.name.includes(search) || p.code.includes(search)) &&
            (!catFilter || p.category === catFilter),
    );
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
    const totalPages = Math.ceil(filtered.length / PER_PAGE);

    const deleteProduct = async (id: number) => {
        if (!confirm("هل تريد حذف هذا المنتج؟")) return;
        setProducts((prev) => prev.filter((p) => p.id !== id));
        try {
            await productsApi.remove(id);
            addToast({ type: "success", message: "تم حذف المنتج" });
        } catch {
            addToast({
                type: "error",
                message: "تعذر الاتصال بالخادم، تم حذف المنتج محلياً فقط",
            });
        }
    };

    const saveProduct = async () => {
        if (!form.name || !form.price) {
            addToast({ type: "error", message: "يرجى ملء الحقول المطلوبة" });
            return;
        }
        const payload = {
            name: form.name,
            code: form.code,
            category: form.category,
            unit: form.unit,
            price: Number(form.price),
            cost: Number(form.cost),
            stock: Number(form.stock),
            minStock: Number(form.minStock),
            barcode: form.barcode,
        };

        if (editProduct) {
            setProducts((prev) =>
                prev.map((p) =>
                    p.id === editProduct.id ? { ...p, ...payload } : p,
                ),
            );
            try {
                await productsApi.update(editProduct.id, payload);
                addToast({ type: "success", message: "تم تحديث المنتج" });
            } catch {
                addToast({
                    type: "error",
                    message: "تعذر الاتصال بالخادم، تم تحديث المنتج محلياً فقط",
                });
            }
        } else {
            const optimistic = {
                id: Date.now(),
                ...payload,
                brand: "الفتح",
                expiry: "",
            } as Product;
            setProducts((prev) => [...prev, optimistic]);
            try {
                await productsApi.create(payload);
                addToast({ type: "success", message: "تم إضافة المنتج" });
            } catch {
                addToast({
                    type: "error",
                    message: "تعذر الاتصال بالخادم، تم إضافة المنتج محلياً فقط",
                });
            }
        }
        setShowAdd(false);
        setEditProduct(null);
        setForm({
            name: "",
            code: "",
            category: "",
            unit: "مل",
            price: "",
            cost: "",
            stock: "",
            minStock: "",
            barcode: "",
        });
    };

    const doAdjust = async () => {
        if (!adjustQty || !showAdjust) return;
        const qty = parseInt(adjustQty);
        const nextStock = Math.max(0, showAdjust.stock + qty);
        setProducts((prev) =>
            prev.map((p) =>
                p.id === showAdjust.id ? { ...p, stock: nextStock } : p,
            ),
        );
        try {
            await productsApi.adjustStock(
                showAdjust.id,
                qty,
                adjustReason || "manual",
            );
            addToast({
                type: "success",
                message: `تم تعديل المخزون بمقدار ${qty > 0 ? "+" : ""}${qty}`,
            });
        } catch {
            addToast({
                type: "error",
                message: "تعذر الاتصال بالخادم، تم تعديل المخزون محلياً فقط",
            });
        }
        setShowAdjust(null);
        setAdjustQty("");
        setAdjustReason("");
    };

    const openEdit = (p: Product) => {
        setEditProduct(p);
        setForm({
            name: p.name,
            code: p.code,
            category: p.category,
            unit: p.unit,
            price: String(p.price),
            cost: String(p.cost),
            stock: String(p.stock),
            minStock: String(p.minStock),
            barcode: p.barcode,
        });
        setShowAdd(true);
    };

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const payload = await productsApi.list({
                    page: 1,
                    pageSize: 100,
                });
                const items = normalizeCollection<Product>(payload);
                if (items.length > 0) {
                    setProducts(items as Product[]);
                }
            } catch {
                setProducts(PRODUCTS);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    const lowCount = products.filter((p) => p.stock <= p.minStock).length;
    const totalValue = products.reduce((s, p) => s + p.price * p.stock, 0);

    const requestProductMutation = async (mutation: () => Promise<unknown>) => {
        try {
            await mutation();
            addToast({ type: "success", message: "تم حفظ التغييرات بنجاح" });
        } catch {
            addToast({
                type: "error",
                message: "تعذر الاتصال بالخادم، تم حفظ التغييرات محلياً فقط",
            });
        }
    };

    return (
        <div style={{ fontFamily: "Cairo, sans-serif" }}>
            <Header
                title="المخزون"
                breadcrumbs={[
                    { label: "الرئيسية", path: "/dashboard" },
                    { label: "المخزون" },
                ]}
            />
            <div style={{ padding: 24 }}>
                {/* Stats */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: 16,
                        marginBottom: 24,
                    }}>
                    {[
                        {
                            label: "إجمالي المنتجات",
                            value: products.length,
                            color: "#3B82F6",
                        },
                        {
                            label: "قيمة المخزون",
                            value: (totalValue / 1000).toFixed(0) + "ك ج.م",
                            color: "#D4AF37",
                        },
                        {
                            label: "منخفض المخزون",
                            value: lowCount,
                            color: "#EF4444",
                        },
                        {
                            label: "الفئات",
                            value: categories.length,
                            color: "#8B5CF6",
                        },
                    ].map((s, i) => (
                        <div
                            key={i}
                            style={{
                                background: "#fff",
                                borderRadius: 12,
                                padding: "16px 20px",
                                boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
                                border: "1px solid #F3F4F6",
                            }}>
                            <p
                                style={{
                                    margin: "0 0 4px",
                                    fontSize: 12,
                                    color: "#9CA3AF",
                                }}>
                                {s.label}
                            </p>
                            <p
                                style={{
                                    margin: 0,
                                    fontSize: 22,
                                    fontWeight: 800,
                                    color: s.color,
                                }}>
                                {s.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Toolbar */}
                <div
                    style={{
                        background: "#fff",
                        borderRadius: 14,
                        padding: "16px 20px",
                        marginBottom: 16,
                        boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
                        border: "1px solid #F3F4F6",
                        display: "flex",
                        gap: 12,
                        flexWrap: "wrap",
                        alignItems: "center",
                    }}>
                    <div
                        style={{
                            position: "relative",
                            flex: 1,
                            minWidth: 200,
                        }}>
                        <Search
                            size={15}
                            style={{
                                position: "absolute",
                                right: 12,
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "#9CA3AF",
                            }}
                        />
                        <input
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            placeholder="بحث بالاسم أو الكود..."
                            style={{
                                width: "100%",
                                padding: "9px 38px 9px 12px",
                                border: "1px solid #E5E7EB",
                                borderRadius: 8,
                                fontSize: 13,
                                fontFamily: "Cairo, sans-serif",
                                outline: "none",
                                boxSizing: "border-box",
                            }}
                        />
                    </div>
                    <select
                        value={catFilter}
                        onChange={(e) => {
                            setCatFilter(e.target.value);
                            setPage(1);
                        }}
                        style={{
                            padding: "9px 12px",
                            border: "1px solid #E5E7EB",
                            borderRadius: 8,
                            fontSize: 13,
                            fontFamily: "Cairo, sans-serif",
                            outline: "none",
                        }}>
                        <option value="">جميع الفئات</option>
                        {categories.map((c) => (
                            <option
                                key={c}
                                value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={() =>
                            addToast({
                                type: "info",
                                message: "جارٍ التصدير...",
                            })
                        }
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "9px 14px",
                            border: "1px solid #E5E7EB",
                            borderRadius: 8,
                            background: "#F9FAFB",
                            cursor: "pointer",
                            fontSize: 13,
                            fontFamily: "Cairo, sans-serif",
                            color: "#6B7280",
                        }}>
                        <Download size={14} /> تصدير
                    </button>
                    <button
                        onClick={() => {
                            setEditProduct(null);
                            setForm({
                                name: "",
                                code: "",
                                category: "",
                                unit: "مل",
                                price: "",
                                cost: "",
                                stock: "",
                                minStock: "",
                                barcode: "",
                            });
                            setShowAdd(true);
                        }}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "9px 16px",
                            border: "none",
                            borderRadius: 8,
                            background:
                                "linear-gradient(135deg, #D4AF37, #A07B20)",
                            cursor: "pointer",
                            fontSize: 13,
                            fontFamily: "Cairo, sans-serif",
                            fontWeight: 700,
                            color: "#000",
                        }}>
                        <Plus size={14} /> منتج جديد
                    </button>
                </div>

                {/* Products Table */}
                <div
                    style={{
                        background: "#fff",
                        borderRadius: 14,
                        boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
                        border: "1px solid #F3F4F6",
                        overflow: "hidden",
                    }}>
                    <table
                        style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr
                                style={{
                                    background: "#F9FAFB",
                                    borderBottom: "1px solid #E5E7EB",
                                }}>
                                {[
                                    "الكود",
                                    "المنتج",
                                    "الفئة",
                                    "الوحدة",
                                    "سعر البيع",
                                    "التكلفة",
                                    "المخزون",
                                    "الحد الأدنى",
                                    "الحالة",
                                    "الإجراءات",
                                ].map((h) => (
                                    <th
                                        key={h}
                                        style={{
                                            padding: "12px 14px",
                                            textAlign: "right",
                                            fontSize: 12,
                                            fontWeight: 600,
                                            color: "#374151",
                                            fontFamily: "Cairo, sans-serif",
                                        }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={10}
                                        style={{
                                            textAlign: "center",
                                            padding: 40,
                                            color: "#9CA3AF",
                                        }}>
                                        جارٍ تحميل البيانات...
                                    </td>
                                </tr>
                            ) : (
                                paginated.map((p) => {
                                    const low = p.stock <= p.minStock;
                                    const critical = p.stock <= p.minStock / 2;
                                    return (
                                        <tr
                                            key={p.id}
                                            style={{
                                                borderBottom:
                                                    "1px solid #F3F4F6",
                                                background: critical
                                                    ? "#FFF5F5"
                                                    : "transparent",
                                            }}>
                                            <td
                                                style={{
                                                    padding: "11px 14px",
                                                    fontSize: 12,
                                                    color: "#9CA3AF",
                                                    fontFamily: "monospace",
                                                }}>
                                                {p.code}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "11px 14px",
                                                }}>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 8,
                                                    }}>
                                                    <div
                                                        style={{
                                                            width: 32,
                                                            height: 32,
                                                            borderRadius: 8,
                                                            background:
                                                                "#FFF7ED",
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center",
                                                            fontSize: 16,
                                                        }}>
                                                        🧴
                                                    </div>
                                                    <div>
                                                        <p
                                                            style={{
                                                                margin: 0,
                                                                fontSize: 13,
                                                                fontWeight: 600,
                                                                color: "#111827",
                                                            }}>
                                                            {p.name}
                                                        </p>
                                                        <p
                                                            style={{
                                                                margin: 0,
                                                                fontSize: 11,
                                                                color: "#9CA3AF",
                                                            }}>
                                                            {p.barcode}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td
                                                style={{
                                                    padding: "11px 14px",
                                                    fontSize: 13,
                                                    color: "#6B7280",
                                                }}>
                                                {p.category}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "11px 14px",
                                                    fontSize: 13,
                                                    color: "#6B7280",
                                                }}>
                                                {p.unit}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "11px 14px",
                                                    fontSize: 13,
                                                    fontWeight: 700,
                                                    color: "#D4AF37",
                                                }}>
                                                {p.price.toLocaleString(
                                                    "ar-EG",
                                                )}{" "}
                                                ج.م
                                            </td>
                                            <td
                                                style={{
                                                    padding: "11px 14px",
                                                    fontSize: 13,
                                                    color: "#374151",
                                                }}>
                                                {p.cost.toLocaleString("ar-EG")}{" "}
                                                ج.م
                                            </td>
                                            <td
                                                style={{
                                                    padding: "11px 14px",
                                                }}>
                                                <span
                                                    style={{
                                                        fontSize: 14,
                                                        fontWeight: 800,
                                                        color: critical
                                                            ? "#DC2626"
                                                            : low
                                                              ? "#D97706"
                                                              : "#111827",
                                                    }}>
                                                    {p.stock} {p.unit}
                                                </span>
                                            </td>
                                            <td
                                                style={{
                                                    padding: "11px 14px",
                                                    fontSize: 13,
                                                    color: "#9CA3AF",
                                                }}>
                                                {p.minStock} {p.unit}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "11px 14px",
                                                }}>
                                                {critical ? (
                                                    <span
                                                        style={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            gap: 4,
                                                            background:
                                                                "#FEE2E2",
                                                            color: "#DC2626",
                                                            padding: "2px 8px",
                                                            borderRadius: 20,
                                                            fontSize: 11,
                                                            fontWeight: 600,
                                                            width: "fit-content",
                                                        }}>
                                                        <AlertTriangle
                                                            size={11}
                                                        />{" "}
                                                        حرج
                                                    </span>
                                                ) : low ? (
                                                    <span
                                                        style={{
                                                            background:
                                                                "#FEF3C7",
                                                            color: "#D97706",
                                                            padding: "2px 8px",
                                                            borderRadius: 20,
                                                            fontSize: 11,
                                                            fontWeight: 600,
                                                        }}>
                                                        منخفض
                                                    </span>
                                                ) : (
                                                    <span
                                                        style={{
                                                            background:
                                                                "#DCFCE7",
                                                            color: "#16A34A",
                                                            padding: "2px 8px",
                                                            borderRadius: 20,
                                                            fontSize: 11,
                                                            fontWeight: 600,
                                                        }}>
                                                        جيد
                                                    </span>
                                                )}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "11px 14px",
                                                }}>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        gap: 5,
                                                    }}>
                                                    <button
                                                        onClick={() =>
                                                            setShowAdjust(p)
                                                        }
                                                        style={{
                                                            width: 28,
                                                            height: 28,
                                                            borderRadius: 6,
                                                            border: "1px solid #DBEAFE",
                                                            background:
                                                                "#EFF6FF",
                                                            cursor: "pointer",
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center",
                                                        }}
                                                        title="تعديل مخزون">
                                                        <Package
                                                            size={12}
                                                            color="#3B82F6"
                                                        />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            openEdit(p)
                                                        }
                                                        style={{
                                                            width: 28,
                                                            height: 28,
                                                            borderRadius: 6,
                                                            border: "1px solid #E5E7EB",
                                                            background:
                                                                "#F9FAFB",
                                                            cursor: "pointer",
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center",
                                                        }}>
                                                        <Edit
                                                            size={12}
                                                            color="#6B7280"
                                                        />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            deleteProduct(p.id)
                                                        }
                                                        style={{
                                                            width: 28,
                                                            height: 28,
                                                            borderRadius: 6,
                                                            border: "1px solid #FEE2E2",
                                                            background:
                                                                "#FFF5F5",
                                                            cursor: "pointer",
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center",
                                                        }}>
                                                        <Trash2
                                                            size={12}
                                                            color="#EF4444"
                                                        />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "12px 16px",
                            borderTop: "1px solid #F3F4F6",
                        }}>
                        <span style={{ fontSize: 13, color: "#9CA3AF" }}>
                            عرض {paginated.length} من {filtered.length} منتج
                        </span>
                        <div style={{ display: "flex", gap: 6 }}>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i + 1)}
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 6,
                                        border: "1px solid",
                                        borderColor:
                                            page === i + 1
                                                ? "#D4AF37"
                                                : "#E5E7EB",
                                        background:
                                            page === i + 1 ? "#D4AF37" : "#fff",
                                        color:
                                            page === i + 1 ? "#000" : "#6B7280",
                                        cursor: "pointer",
                                        fontSize: 13,
                                        fontFamily: "Cairo, sans-serif",
                                        fontWeight: page === i + 1 ? 700 : 400,
                                    }}>
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Add/Edit Product Modal */}
            {showAdd && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                    }}>
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 16,
                            padding: 28,
                            width: 560,
                            maxHeight: "90vh",
                            overflowY: "auto",
                            fontFamily: "Cairo, sans-serif",
                        }}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 20,
                            }}>
                            <h3 style={{ margin: 0 }}>
                                {editProduct
                                    ? "تعديل المنتج"
                                    : "إضافة منتج جديد"}
                            </h3>
                            <button
                                onClick={() => setShowAdd(false)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                }}>
                                <X size={20} />
                            </button>
                        </div>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: 14,
                            }}>
                            {(
                                [
                                    ["name", "اسم المنتج *", "text"],
                                    ["code", "كود المنتج", "text"],
                                    ["category", "الفئة", "text"],
                                    ["unit", "الوحدة", "text"],
                                    ["price", "سعر البيع *", "number"],
                                    ["cost", "التكلفة", "number"],
                                    ["stock", "المخزون الحالي", "number"],
                                    ["minStock", "الحد الأدنى", "number"],
                                    ["barcode", "الباركود", "text"],
                                ] as [keyof typeof form, string, string][]
                            ).map(([key, label, type]) => (
                                <div
                                    key={key}
                                    style={{
                                        gridColumn:
                                            key === "name" ? "1 / -1" : "auto",
                                    }}>
                                    <label
                                        style={{
                                            display: "block",
                                            fontSize: 13,
                                            color: "#374151",
                                            marginBottom: 5,
                                        }}>
                                        {label}
                                    </label>
                                    <input
                                        type={type}
                                        value={form[key]}
                                        onChange={(e) =>
                                            setForm((f) => ({
                                                ...f,
                                                [key]: e.target.value,
                                            }))
                                        }
                                        style={{
                                            width: "100%",
                                            padding: "9px 12px",
                                            border: "1px solid #E5E7EB",
                                            borderRadius: 8,
                                            fontSize: 13,
                                            fontFamily: "Cairo, sans-serif",
                                            outline: "none",
                                            boxSizing: "border-box",
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                        <div
                            style={{ display: "flex", gap: 10, marginTop: 20 }}>
                            <button
                                onClick={saveProduct}
                                style={{
                                    flex: 1,
                                    padding: 12,
                                    background:
                                        "linear-gradient(135deg, #D4AF37, #A07B20)",
                                    border: "none",
                                    borderRadius: 10,
                                    cursor: "pointer",
                                    fontFamily: "Cairo, sans-serif",
                                    fontWeight: 700,
                                    color: "#000",
                                    fontSize: 14,
                                }}>
                                {editProduct ? "حفظ التعديلات" : "إضافة المنتج"}
                            </button>
                            <button
                                onClick={() => setShowAdd(false)}
                                style={{
                                    flex: 1,
                                    padding: 12,
                                    background: "#F3F4F6",
                                    border: "none",
                                    borderRadius: 10,
                                    cursor: "pointer",
                                    fontFamily: "Cairo, sans-serif",
                                    color: "#374151",
                                    fontSize: 14,
                                }}>
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Stock Adjustment Modal */}
            {showAdjust && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                    }}>
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 16,
                            padding: 28,
                            width: 400,
                            fontFamily: "Cairo, sans-serif",
                        }}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 16,
                            }}>
                            <h3 style={{ margin: 0, fontSize: 15 }}>
                                تعديل مخزون: {showAdjust.name}
                            </h3>
                            <button
                                onClick={() => setShowAdjust(null)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                }}>
                                <X size={18} />
                            </button>
                        </div>
                        <p
                            style={{
                                margin: "0 0 16px",
                                fontSize: 13,
                                color: "#9CA3AF",
                            }}>
                            المخزون الحالي:{" "}
                            <strong style={{ color: "#111827" }}>
                                {showAdjust.stock} {showAdjust.unit}
                            </strong>
                        </p>
                        <div style={{ marginBottom: 14 }}>
                            <label
                                style={{
                                    display: "block",
                                    fontSize: 13,
                                    color: "#374151",
                                    marginBottom: 5,
                                }}>
                                الكمية (موجبة للإضافة، سالبة للخصم)
                            </label>
                            <input
                                type="number"
                                value={adjustQty}
                                onChange={(e) => setAdjustQty(e.target.value)}
                                placeholder="مثال: +50 أو -10"
                                style={{
                                    width: "100%",
                                    padding: "10px 12px",
                                    border: "1px solid #E5E7EB",
                                    borderRadius: 8,
                                    fontSize: 13,
                                    fontFamily: "Cairo, sans-serif",
                                    outline: "none",
                                    boxSizing: "border-box",
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: 20 }}>
                            <label
                                style={{
                                    display: "block",
                                    fontSize: 13,
                                    color: "#374151",
                                    marginBottom: 5,
                                }}>
                                سبب التعديل
                            </label>
                            <input
                                value={adjustReason}
                                onChange={(e) =>
                                    setAdjustReason(e.target.value)
                                }
                                placeholder="مثال: جرد فعلي، تالف..."
                                style={{
                                    width: "100%",
                                    padding: "10px 12px",
                                    border: "1px solid #E5E7EB",
                                    borderRadius: 8,
                                    fontSize: 13,
                                    fontFamily: "Cairo, sans-serif",
                                    outline: "none",
                                    boxSizing: "border-box",
                                }}
                            />
                        </div>
                        <div style={{ display: "flex", gap: 10 }}>
                            <button
                                onClick={doAdjust}
                                style={{
                                    flex: 1,
                                    padding: 12,
                                    background:
                                        "linear-gradient(135deg, #D4AF37, #A07B20)",
                                    border: "none",
                                    borderRadius: 10,
                                    cursor: "pointer",
                                    fontFamily: "Cairo, sans-serif",
                                    fontWeight: 700,
                                    color: "#000",
                                }}>
                                تطبيق التعديل
                            </button>
                            <button
                                onClick={() => setShowAdjust(null)}
                                style={{
                                    flex: 1,
                                    padding: 12,
                                    background: "#F3F4F6",
                                    border: "none",
                                    borderRadius: 10,
                                    cursor: "pointer",
                                    fontFamily: "Cairo, sans-serif",
                                    color: "#374151",
                                }}>
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
