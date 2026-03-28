// src/pages/auth/AuthPage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const bn = { fontFamily: "'Noto Serif Bengali', serif" };
const inp = (err) => ({
    width: "100%", boxSizing: "border-box",
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${err ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.1)"}`,
    borderRadius: 12, padding: "11px 14px",
    color: "#e7e5e4", fontSize: 14,
    fontFamily: "'Noto Serif Bengali', serif", outline: "none",
});

function Field({ label, required, optional, error, children }) {
    return (
        <div>
            <label style={{ ...bn, display: "block", color: "#78716c", fontSize: 12, marginBottom: 5 }}>
                {label}
                {required && <span style={{ color: "#fbbf24" }}> *</span>}
                {optional && <span style={{ color: "#57534e", fontSize: 11 }}> (ঐচ্ছিক)</span>}
            </label>
            {children}
            {error && <p style={{ ...bn, color: "#f87171", fontSize: 11, marginTop: 3 }}>{error}</p>}
        </div>
    );
}

export default function AuthPage({ mode = "login" }) {
    const navigate = useNavigate();
    const { login, register } = useAuthStore();

    const [isLogin, setIsLogin] = useState(mode === "login");
    const [form, setForm] = useState({
        email: "", password: "", name: "",
        mobile: "", address: "", acharja: "", bhukti: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const change = (f) => (e) => {
        setForm((d) => ({ ...d, [f]: e.target.value }));
        setErrors((er) => ({ ...er, [f]: "", submit: "" }));
    };

    const validate = () => {
        const e = {};
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "সঠিক ইমেইল লিখুন";
        if (!form.password || form.password.length < 6) e.password = "সর্বনিম্ন ৬ অক্ষর";
        if (!isLogin && !form.name.trim()) e.name = "নাম লিখুন";
        return e;
    };

    const submit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setLoading(true);
        try {
            if (isLogin) {
                await login({ email: form.email, password: form.password });
                navigate("/");
            } else {
                await register({
                    email: form.email,
                    password: form.password,
                    name: form.name.trim(),
                    mobile: form.mobile.trim(),
                    address: form.address.trim(),
                    acharja: form.acharja.trim(),
                    bhukti: form.bhukti.trim(),
                });
                setSuccess(true);
            }
        } catch (err) {
            setErrors({ submit: err.message || "কিছু একটা সমস্যা হয়েছে" });
        }
        setLoading(false);
    };

    // Registration success screen
    if (success) return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", background: "linear-gradient(135deg,#0d1f1e,#0f2a28,#0d1a10)" }}>
            <div style={{ textAlign: "center", maxWidth: 380 }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
                <h2 style={{ ...bn, color: "#fff", fontWeight: 700, fontSize: 22, marginBottom: 10 }}>নিবন্ধন সফল!</h2>
                <p style={{ ...bn, color: "#a8a29e", fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
                    আপনার অ্যাকাউন্ট তৈরি হয়েছে। এখন লগইন করুন।
                </p>
                <button type="button" onClick={() => { setSuccess(false); setIsLogin(true); setForm({ email: form.email, password: "", name: "", mobile: "", address: "", acharja: "", bhukti: "" }); }}
                    style={{ ...bn, padding: "12px 28px", borderRadius: 999, background: "linear-gradient(90deg,#f59e0b,#ea580c)", color: "#0d1f1e", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}>
                    লগইন করুন
                </button>
            </div>
        </div>
    );

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 24px 40px", background: "linear-gradient(135deg,#0d1f1e,#0f2a28,#0d1a10)" }}>
            <div style={{ width: "100%", maxWidth: isLogin ? 420 : 560 }}>

                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: 28 }}>
                    <div style={{ fontSize: 38, marginBottom: 8 }}>🕉️</div>
                    <h1 style={{ ...bn, color: "#fbbf24", fontWeight: 700, fontSize: 20, margin: 0 }}>আনন্দমার্গ বাংলাদেশ</h1>
                    <p style={{ ...bn, color: "#78716c", fontSize: 13, marginTop: 5 }}>
                        {isLogin ? "আপনার অ্যাকাউন্টে প্রবেশ করুন" : "নতুন অ্যাকাউন্ট তৈরি করুন"}
                    </p>
                </div>

                {/* Card */}
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 22, padding: 28 }}>

                    {/* Tabs */}
                    <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 4, marginBottom: 24, gap: 4 }}>
                        {["লগইন", "নিবন্ধন"].map((label, i) => {
                            const active = isLogin ? i === 0 : i === 1;
                            return (
                                <button key={label} type="button" onClick={() => { setIsLogin(i === 0); setErrors({}); }}
                                    style={{ ...bn, flex: 1, padding: "9px", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 14, fontWeight: active ? 700 : 400, background: active ? "rgba(245,158,11,0.15)" : "transparent", color: active ? "#fbbf24" : "#78716c", transition: "all 0.2s" }}>
                                    {label}
                                </button>
                            );
                        })}
                    </div>

                    <form onSubmit={submit} noValidate>
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

                            {/* Registration fields */}
                            {!isLogin && (
                                <>
                                    {/* Name */}
                                    <Field label="পূর্ণ নাম" required error={errors.name}>
                                        <input type="text" placeholder="আপনার পূর্ণ নাম" value={form.name} onChange={change("name")} style={inp(errors.name)}
                                            onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
                                            onBlur={(e) => (e.target.style.borderColor = errors.name ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.1)")} />
                                    </Field>

                                    <div style={{ display: "grid", gap: 14 }} className="sm:grid-cols-2">
                                        {/* Mobile */}
                                        <Field label="মোবাইল নম্বর" optional>
                                            <input type="tel" placeholder="+880 1X-XXXXXXXX" value={form.mobile} onChange={change("mobile")} style={inp(false)}
                                                onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
                                                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
                                        </Field>
                                        {/* Acharja */}
                                        <Field label="আচার্যের নাম" optional>
                                            <input type="text" placeholder="আপনার আধ্যাত্মিক গুরুর নাম" value={form.acharja} onChange={change("acharja")} style={inp(false)}
                                                onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
                                                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
                                        </Field>
                                    </div>

                                    <div style={{ display: "grid", gap: 14 }} className="sm:grid-cols-2">
                                        {/* Bhukti */}
                                        <Field label="ভুক্তি" optional>
                                            <input type="text" placeholder="স্থানীয় শাখার নাম" value={form.bhukti} onChange={change("bhukti")} style={inp(false)}
                                                onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
                                                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
                                        </Field>
                                        {/* Address */}
                                        <Field label="ঠিকানা" optional>
                                            <input type="text" placeholder="জেলা / উপজেলা" value={form.address} onChange={change("address")} style={inp(false)}
                                                onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
                                                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
                                        </Field>
                                    </div>
                                </>
                            )}

                            {/* Email */}
                            <Field label="ইমেইল" required error={errors.email}>
                                <input type="email" placeholder="example@email.com" value={form.email} onChange={change("email")} style={inp(errors.email)}
                                    onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
                                    onBlur={(e) => (e.target.style.borderColor = errors.email ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.1)")} />
                            </Field>

                            {/* Password */}
                            <Field label="পাসওয়ার্ড" required error={errors.password}>
                                <input type="password" placeholder={isLogin ? "আপনার পাসওয়ার্ড" : "সর্বনিম্ন ৬ অক্ষর"} value={form.password} onChange={change("password")} style={inp(errors.password)}
                                    onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
                                    onBlur={(e) => (e.target.style.borderColor = errors.password ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.1)")} />
                            </Field>

                            {/* Error */}
                            {errors.submit && (
                                <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 10, padding: "10px 14px" }}>
                                    <p style={{ ...bn, color: "#f87171", fontSize: 13, margin: 0 }}>⚠️ {errors.submit}</p>
                                </div>
                            )}

                            {/* Submit */}
                            <button type="submit" disabled={loading}
                                style={{ ...bn, width: "100%", padding: "13px", borderRadius: 999, border: "none", background: loading ? "rgba(245,158,11,0.4)" : "linear-gradient(90deg,#f59e0b,#ea580c)", color: "#0d1f1e", fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", marginTop: 4 }}>
                                {loading ? "অপেক্ষা করুন..." : isLogin ? "লগইন করুন" : "নিবন্ধন করুন"}
                            </button>
                        </div>
                    </form>
                </div>

                <p style={{ textAlign: "center", marginTop: 20 }}>
                    <Link to="/" style={{ ...bn, color: "#57534e", textDecoration: "none", fontSize: 13 }}>← হোমে ফিরুন</Link>
                </p>
            </div>
        </div>
    );
}