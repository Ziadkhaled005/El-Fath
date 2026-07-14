import { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, ArrowRight } from "lucide-react";
import logo from "../../imports/0.png";
import { authApi } from "../services/api";

export function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await authApi.forgotPassword(email);
            setSent(true);
        } catch {
            setSent(true);
        }
    };

    return (
        <div
            dir="rtl"
            style={{
                minHeight: "100vh",
                background:
                    "linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 50%, #0d0d0d 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Cairo, sans-serif",
                padding: 24,
            }}>
            <div style={{ width: "100%", maxWidth: 400 }}>
                <div
                    style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(212,175,55,0.2)",
                        borderRadius: 20,
                        padding: "40px 36px",
                        backdropFilter: "blur(20px)",
                        boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
                    }}>
                    <div style={{ textAlign: "center", marginBottom: 28 }}>
                        <img
                            src={logo}
                            alt="الفتح"
                            style={{
                                width: 64,
                                height: 64,
                                borderRadius: "50%",
                                margin: "0 auto 12px",
                            }}
                        />
                        <h2
                            style={{
                                color: "#fff",
                                margin: 0,
                                fontSize: 18,
                                fontWeight: 700,
                            }}>
                            استعادة كلمة المرور
                        </h2>
                        <p
                            style={{
                                color: "#9CA3AF",
                                margin: "8px 0 0",
                                fontSize: 13,
                            }}>
                            {sent
                                ? "تم إرسال رابط إعادة التعيين على بريدك الإلكتروني"
                                : "أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور"}
                        </p>
                    </div>

                    {!sent ? (
                        <form
                            onSubmit={handleSubmit}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 16,
                            }}>
                            <div>
                                <label
                                    style={{
                                        display: "block",
                                        color: "#D1D5DB",
                                        fontSize: 13,
                                        marginBottom: 6,
                                    }}>
                                    البريد الإلكتروني
                                </label>
                                <div style={{ position: "relative" }}>
                                    <Mail
                                        size={16}
                                        style={{
                                            position: "absolute",
                                            top: "50%",
                                            right: 12,
                                            transform: "translateY(-50%)",
                                            color: "#6B7280",
                                        }}
                                    />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                        placeholder="البريد الإلكتروني"
                                        style={{
                                            width: "100%",
                                            padding: "12px 40px 12px 16px",
                                            background:
                                                "rgba(255,255,255,0.07)",
                                            border: "1px solid rgba(255,255,255,0.1)",
                                            borderRadius: 10,
                                            color: "#fff",
                                            fontSize: 14,
                                            fontFamily: "Cairo, sans-serif",
                                            outline: "none",
                                            boxSizing: "border-box",
                                        }}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                style={{
                                    width: "100%",
                                    padding: 14,
                                    background:
                                        "linear-gradient(135deg, #D4AF37, #A07B20)",
                                    border: "none",
                                    borderRadius: 10,
                                    cursor: "pointer",
                                    color: "#000",
                                    fontWeight: 700,
                                    fontSize: 15,
                                    fontFamily: "Cairo, sans-serif",
                                }}>
                                إرسال رابط الاستعادة
                            </button>
                        </form>
                    ) : (
                        <div
                            style={{
                                textAlign: "center",
                                padding: 20,
                                color: "#10B981",
                                fontSize: 14,
                            }}>
                            ✓ تم الإرسال بنجاح. تحقق من بريدك الإلكتروني.
                        </div>
                    )}

                    <button
                        onClick={() => navigate("/login")}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#D4AF37",
                            fontSize: 13,
                            fontFamily: "Cairo, sans-serif",
                            marginTop: 20,
                            width: "100%",
                            justifyContent: "center",
                        }}>
                        <ArrowRight size={14} />
                        العودة لتسجيل الدخول
                    </button>
                </div>
            </div>
        </div>
    );
}
