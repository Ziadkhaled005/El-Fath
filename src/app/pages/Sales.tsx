import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
    Plus,
    Search,
    Filter,
    Download,
    Printer,
    Eye,
    Edit,
    Trash2,
    X,
    CheckCircle,
} from "lucide-react";
import { Header } from "../components/Header";
import { SALES_INVOICES } from "../data/mockData";
import { useApp } from "../context/AppContext";
import { normalizeCollection, salesApi } from "../services/api";

const STATUS_COLORS: Record<
    string,
    { bg: string; color: string; label: string }
> = {
    paid: { bg: "#DCFCE7", color: "#16A34A", label: "مدفوعة" },
    partial: { bg: "#FEF3C7", color: "#D97706", label: "جزئي" },
    unpaid: { bg: "#FEE2E2", color: "#DC2626", label: "غير مدفوعة" },
};

export function Sales() {
    const { addToast } = useApp();
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [viewInvoice, setViewInvoice] = useState<
        (typeof SALES_INVOICES)[0] | null
    >(null);
    const [invoices, setInvoices] = useState(SALES_INVOICES);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const PER_PAGE = 5;

    const filtered = invoices.filter(
        (inv) =>
            (inv.id.toLowerCase().includes(search.toLowerCase()) ||
                inv.customer.includes(search)) &&
            (!statusFilter || inv.status === statusFilter),
    );
    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    useEffect(() => {
        const loadInvoices = async () => {
            try {
                const payload = await salesApi.list({ page: 1, pageSize: 100 });
                const items =
                    normalizeCollection<(typeof SALES_INVOICES)[0]>(payload);
                if (items.length > 0) {
                    setInvoices(items);
                }
            } catch {
                setInvoices(SALES_INVOICES);
            } finally {
                setLoading(false);
            }
        };

        loadInvoices();
    }, []);

    const deleteInvoice = async (id: string) => {
        setInvoices((prev) => prev.filter((i) => i.id !== id));
        try {
            await salesApi.create({ id, action: "delete" });
            addToast({ type: "success", message: "تم حذف الفاتورة بنجاح" });
        } catch {
            addToast({
                type: "error",
                message: "تعذر الاتصال بالخادم، تم حذف الفاتورة محلياً فقط",
            });
        }
    };

    return (
        <div style={{ fontFamily: "Cairo, sans-serif" }}>
            <Header
                title="المبيعات"
                breadcrumbs={[
                    { label: "الرئيسية", path: "/dashboard" },
                    { label: "المبيعات" },
                ]}
            />

            <div style={{ padding: 24 }}>
                {/* Stats row */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: 16,
                        marginBottom: 24,
                    }}>
                    {[
                        {
                            label: "إجمالي الفواتير",
                            value: invoices.length,
                            color: "#3B82F6",
                        },
                        {
                            label: "مدفوعة",
                            value: invoices.filter((i) => i.status === "paid")
                                .length,
                            color: "#10B981",
                        },
                        {
                            label: "جزئية",
                            value: invoices.filter(
                                (i) => i.status === "partial",
                            ).length,
                            color: "#F59E0B",
                        },
                        {
                            label: "غير مدفوعة",
                            value: invoices.filter((i) => i.status === "unpaid")
                                .length,
                            color: "#EF4444",
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
                                    fontSize: 24,
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
                    }}>
                    <div
                        style={{
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
                                placeholder="بحث بالرقم أو العميل..."
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
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
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
                            <option value="">جميع الحالات</option>
                            <option value="paid">مدفوعة</option>
                            <option value="partial">جزئية</option>
                            <option value="unpaid">غير مدفوعة</option>
                        </select>
                        <button
                            onClick={() =>
                                addToast({
                                    type: "info",
                                    message: "جارٍ تصدير البيانات...",
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
                            onClick={() =>
                                addToast({
                                    type: "info",
                                    message: "جارٍ الطباعة...",
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
                            <Printer size={14} /> طباعة
                        </button>
                        <button
                            onClick={() => navigate("/pos")}
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
                            <Plus size={14} /> فاتورة جديدة
                        </button>
                    </div>
                </div>

                {/* Table */}
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
                                    "رقم الفاتورة",
                                    "التاريخ",
                                    "العميل",
                                    "الفرع",
                                    "الإجمالي",
                                    "المدفوع",
                                    "الحالة",
                                    "الإجراءات",
                                ].map((h) => (
                                    <th
                                        key={h}
                                        style={{
                                            padding: "12px 16px",
                                            textAlign: "right",
                                            fontSize: 13,
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
                                        colSpan={8}
                                        style={{
                                            textAlign: "center",
                                            padding: 40,
                                            color: "#9CA3AF",
                                        }}>
                                        جارٍ تحميل البيانات...
                                    </td>
                                </tr>
                            ) : (
                                paginated.map((inv) => {
                                    const s = STATUS_COLORS[inv.status];
                                    return (
                                        <tr
                                            key={inv.id}
                                            style={{
                                                borderBottom:
                                                    "1px solid #F3F4F6",
                                                transition: "background 0.15s",
                                            }}
                                            onMouseEnter={(e) =>
                                                (e.currentTarget.style.background =
                                                    "#FAFAFA")
                                            }
                                            onMouseLeave={(e) =>
                                                (e.currentTarget.style.background =
                                                    "#fff")
                                            }>
                                            <td
                                                style={{
                                                    padding: "12px 16px",
                                                    fontSize: 13,
                                                    color: "#D4AF37",
                                                    fontWeight: 600,
                                                    cursor: "pointer",
                                                }}
                                                onClick={() =>
                                                    setViewInvoice(inv)
                                                }>
                                                {inv.id}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "12px 16px",
                                                    fontSize: 13,
                                                    color: "#374151",
                                                }}>
                                                {inv.date}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "12px 16px",
                                                    fontSize: 13,
                                                    color: "#111827",
                                                    fontWeight: 500,
                                                }}>
                                                {inv.customer}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "12px 16px",
                                                    fontSize: 13,
                                                    color: "#6B7280",
                                                }}>
                                                {inv.branch}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "12px 16px",
                                                    fontSize: 13,
                                                    fontWeight: 700,
                                                    color: "#111827",
                                                }}>
                                                {inv.total.toLocaleString(
                                                    "ar-EG",
                                                )}{" "}
                                                ج.م
                                            </td>
                                            <td
                                                style={{
                                                    padding: "12px 16px",
                                                    fontSize: 13,
                                                    color: "#374151",
                                                }}>
                                                {inv.paid.toLocaleString(
                                                    "ar-EG",
                                                )}{" "}
                                                ج.م
                                            </td>
                                            <td
                                                style={{
                                                    padding: "12px 16px",
                                                }}>
                                                <span
                                                    style={{
                                                        background: s.bg,
                                                        color: s.color,
                                                        padding: "3px 10px",
                                                        borderRadius: 20,
                                                        fontSize: 12,
                                                        fontWeight: 600,
                                                    }}>
                                                    {s.label}
                                                </span>
                                            </td>
                                            <td
                                                style={{
                                                    padding: "12px 16px",
                                                }}>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        gap: 6,
                                                    }}>
                                                    <button
                                                        onClick={() =>
                                                            setViewInvoice(inv)
                                                        }
                                                        style={{
                                                            width: 30,
                                                            height: 30,
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
                                                        <Eye
                                                            size={13}
                                                            color="#6B7280"
                                                        />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            addToast({
                                                                type: "info",
                                                                message:
                                                                    "جارٍ الطباعة...",
                                                            })
                                                        }
                                                        style={{
                                                            width: 30,
                                                            height: 30,
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
                                                        <Printer
                                                            size={13}
                                                            color="#6B7280"
                                                        />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (
                                                                confirm(
                                                                    "هل تريد حذف هذه الفاتورة؟",
                                                                )
                                                            )
                                                                deleteInvoice(
                                                                    inv.id,
                                                                );
                                                        }}
                                                        style={{
                                                            width: 30,
                                                            height: 30,
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
                                                            size={13}
                                                            color="#EF4444"
                                                        />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                            {paginated.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={8}
                                        style={{
                                            textAlign: "center",
                                            padding: 40,
                                            color: "#9CA3AF",
                                            fontFamily: "Cairo, sans-serif",
                                            fontSize: 14,
                                        }}>
                                        لا توجد فواتير مطابقة
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "12px 16px",
                            borderTop: "1px solid #F3F4F6",
                        }}>
                        <span style={{ fontSize: 13, color: "#9CA3AF" }}>
                            عرض {paginated.length} من {filtered.length} فاتورة
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

            {/* Invoice Detail Modal */}
            {viewInvoice && (
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
                            width: 520,
                            maxHeight: "80vh",
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
                            <h3
                                style={{
                                    margin: 0,
                                    fontSize: 16,
                                    fontWeight: 700,
                                }}>
                                تفاصيل الفاتورة: {viewInvoice.id}
                            </h3>
                            <button
                                onClick={() => setViewInvoice(null)}
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
                                gap: 12,
                                marginBottom: 20,
                            }}>
                            {[
                                ["العميل", viewInvoice.customer],
                                ["التاريخ", viewInvoice.date],
                                ["الفرع", viewInvoice.branch],
                                ["عدد المنتجات", viewInvoice.items],
                                [
                                    "الإجمالي",
                                    viewInvoice.total.toLocaleString("ar-EG") +
                                        " ج.م",
                                ],
                                [
                                    "المدفوع",
                                    viewInvoice.paid.toLocaleString("ar-EG") +
                                        " ج.م",
                                ],
                                [
                                    "الخصم",
                                    viewInvoice.discount.toLocaleString(
                                        "ar-EG",
                                    ) + " ج.م",
                                ],
                                [
                                    "الضريبة",
                                    viewInvoice.tax.toLocaleString("ar-EG") +
                                        " ج.م",
                                ],
                            ].map(([k, v]) => (
                                <div
                                    key={k}
                                    style={{
                                        background: "#F9FAFB",
                                        borderRadius: 8,
                                        padding: "10px 14px",
                                    }}>
                                    <p
                                        style={{
                                            margin: "0 0 2px",
                                            fontSize: 11,
                                            color: "#9CA3AF",
                                        }}>
                                        {k}
                                    </p>
                                    <p
                                        style={{
                                            margin: 0,
                                            fontSize: 14,
                                            fontWeight: 600,
                                            color: "#111827",
                                        }}>
                                        {v}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div style={{ display: "flex", gap: 10 }}>
                            <button
                                onClick={() => {
                                    addToast({
                                        type: "info",
                                        message: "جارٍ الطباعة...",
                                    });
                                    setViewInvoice(null);
                                }}
                                style={{
                                    flex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 6,
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
                                <Printer size={16} /> طباعة
                            </button>
                            <button
                                onClick={() => setViewInvoice(null)}
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
                                إغلاق
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
