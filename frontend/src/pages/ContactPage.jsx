import { useState } from "react";

const bn = { fontFamily: "'Noto Serif Bengali', serif" };

const inp = (err) => ({
    width: "100%", boxSizing: "border-box",
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${err ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.1)"}`,
    borderRadius: 12, padding: "11px 14px",
    color: "#e7e5e4", fontSize: 14,
    fontFamily: "'Noto Serif Bengali', serif", outline: "none",
});

const TOPICS = ["যোগ ও মেডিটেশন", "সমাজসেবা কার্যক্রম", "শিক্ষা কার্যক্রম", "স্বেচ্ছাসেবক হওয়া", "দান ও অনুদান", "অন্যান্য"];

const OFFICES = [
    { city: "ঢাকা", role: "প্রধান কার্যালয়", address: "১২৩, মিরপুর রোড, ধানমন্ডি, ঢাকা-১২০৫", phone: "+880 2-9876543", email: "dhaka@anandamarga.org.bd", icon: "🏛️", color: "#fbbf24" },
    { city: "চট্টগ্রাম", role: "আঞ্চলিক কার্যালয়", address: "৪৫, আগ্রাবাদ বাণিজ্যিক এলাকা", phone: "+880 31-654321", email: "ctg@anandamarga.org.bd", icon: "🌊", color: "#2dd4bf" },
    { city: "রাজশাহী", role: "উত্তরাঞ্চল কার্যালয়", address: "৭৮, শাহ মখদুম এভিনিউ, রাজশাহী", phone: "+880 721-234567", email: "raj@anandamarga.org.bd", icon: "🌿", color: "#34d399" },
];

export default function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", phone: "", topic: "", message: "" });
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState("idle"); // idle | sending | success

    const change = (f) => (e) => { setForm((d) => ({ ...d, [f]: e.target.value })); setErrors((er) => ({ ...er, [f]: "" })); };

    const submit = async (e) => {
        e.preventDefault();
        const er = {};
        if (!form.name.trim()) er.name = "নাম লিখুন";
        if (!/\S+@\S+\.\S+/.test(form.email)) er.email = "সঠিক ইমেইল লিখুন";
        if (!form.topic) er.topic = "বিষয় বেছে নিন";
        if (form.message.trim().length < 10) er.message = "অন্তত ১০ অক্ষর লিখুন";
        if (Object.keys(er).length) { setErrors(er); return; }
        setStatus("sending");
        await new Promise((r) => setTimeout(r, 1500));
        setStatus("success");
    };

    return (
        <>
            {/* Hero */}
            <section style={{ paddingTop: 120, paddingBottom: 60, padding: "120px 24px 60px", background: "linear-gradient(135deg,#0d1f1e,#0f2a28,#0d1a10)", textAlign: "center", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 500, height: 220, borderRadius: "50%", background: "rgba(20,184,166,0.07)", filter: "blur(60px)", pointerEvents: "none" }} />
                <div style={{ position: "relative", maxWidth: 560, margin: "0 auto" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 999, background: "rgba(20,184,166,0.1)", border: "1px solid rgba(20,184,166,0.2)", color: "#5eead4", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 20 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#2dd4bf" }} /> যোগাযোগ
                    </div>
                    <h1 style={{ ...bn, fontSize: "clamp(30px,5vw,52px)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 14 }}>
                        আমাদের সাথে<br />
                        <span style={{ background: "linear-gradient(90deg,#f59e0b,#ea580c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>কথা বলুন</span>
                    </h1>
                    <p style={{ ...bn, color: "#a8a29e", fontSize: 15, lineHeight: 1.7 }}>আমরা ২৪ ঘণ্টার মধ্যে সাড়া দেওয়ার চেষ্টা করি।</p>
                </div>
            </section>

            {/* Main */}
            <section style={{ padding: "60px 24px 80px" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gap: 32 }} className="lg:grid-cols-[3fr_2fr]">

                    {/* Form */}
                    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 22, padding: 28 }}>
                        {status === "success" ? (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 16, padding: "48px 0" }}>
                                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>✅</div>
                                <h4 style={{ ...bn, color: "#fff", fontWeight: 700, fontSize: 20 }}>বার্তা পাঠানো হয়েছে!</h4>
                                <p style={{ ...bn, color: "#78716c", fontSize: 14 }}>শীঘ্রই আপনার সাথে যোগাযোগ করা হবে।</p>
                                <button type="button" onClick={() => { setStatus("idle"); setForm({ name: "", email: "", phone: "", topic: "", message: "" }); }}
                                    style={{ ...bn, padding: "9px 22px", borderRadius: 999, border: "1px solid rgba(245,158,11,0.3)", background: "transparent", color: "#fbbf24", fontSize: 13, cursor: "pointer" }}>
                                    আরেকটি বার্তা পাঠান
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={submit} noValidate>
                                <h3 style={{ ...bn, color: "#fff", fontWeight: 700, fontSize: 20, marginBottom: 4 }}>বার্তা পাঠান</h3>
                                <p style={{ ...bn, color: "#78716c", fontSize: 13, marginBottom: 22 }}>সব তারকা চিহ্নিত ঘর পূরণ করুন।</p>

                                <div style={{ display: "grid", gap: 14 }} className="sm:grid-cols-2">
                                    {/* Name */}
                                    <div>
                                        <label style={{ ...bn, display: "block", color: "#78716c", fontSize: 12, marginBottom: 5 }}>নাম <span style={{ color: "#fbbf24" }}>*</span></label>
                                        <input type="text" placeholder="আপনার পূর্ণ নাম" value={form.name} onChange={change("name")} style={inp(errors.name)}
                                            onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
                                            onBlur={(e) => (e.target.style.borderColor = errors.name ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.1)")} />
                                        {errors.name && <p style={{ ...bn, color: "#f87171", fontSize: 11, marginTop: 3 }}>{errors.name}</p>}
                                    </div>
                                    {/* Email */}
                                    <div>
                                        <label style={{ ...bn, display: "block", color: "#78716c", fontSize: 12, marginBottom: 5 }}>ইমেইল <span style={{ color: "#fbbf24" }}>*</span></label>
                                        <input type="email" placeholder="example@email.com" value={form.email} onChange={change("email")} style={inp(errors.email)}
                                            onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
                                            onBlur={(e) => (e.target.style.borderColor = errors.email ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.1)")} />
                                        {errors.email && <p style={{ ...bn, color: "#f87171", fontSize: 11, marginTop: 3 }}>{errors.email}</p>}
                                    </div>
                                    {/* Phone */}
                                    <div>
                                        <label style={{ ...bn, display: "block", color: "#78716c", fontSize: 12, marginBottom: 5 }}>ফোন নম্বর</label>
                                        <input type="tel" placeholder="+880 1X-XXXXXXXX" value={form.phone} onChange={change("phone")} style={inp(false)}
                                            onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
                                            onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
                                    </div>
                                    {/* Topic */}
                                    <div>
                                        <label style={{ ...bn, display: "block", color: "#78716c", fontSize: 12, marginBottom: 5 }}>বিষয় <span style={{ color: "#fbbf24" }}>*</span></label>
                                        <select value={form.topic} onChange={change("topic")} style={{ ...inp(errors.topic), cursor: "pointer" }}
                                            onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
                                            onBlur={(e) => (e.target.style.borderColor = errors.topic ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.1)")}>
                                            <option value="" style={{ background: "#0d1f1e" }}>বিষয় বেছে নিন</option>
                                            {TOPICS.map((t) => <option key={t} value={t} style={{ background: "#0d1f1e" }}>{t}</option>)}
                                        </select>
                                        {errors.topic && <p style={{ ...bn, color: "#f87171", fontSize: 11, marginTop: 3 }}>{errors.topic}</p>}
                                    </div>
                                </div>

                                {/* Message */}
                                <div style={{ marginTop: 14 }}>
                                    <label style={{ ...bn, display: "block", color: "#78716c", fontSize: 12, marginBottom: 5 }}>বার্তা <span style={{ color: "#fbbf24" }}>*</span></label>
                                    <textarea rows={5} placeholder="আপনার বার্তা এখানে লিখুন..." value={form.message} onChange={change("message")}
                                        style={{ ...inp(errors.message), resize: "vertical", minHeight: 120 }}
                                        onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
                                        onBlur={(e) => (e.target.style.borderColor = errors.message ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.1)")} />
                                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                                        {errors.message && <p style={{ ...bn, color: "#f87171", fontSize: 11 }}>{errors.message}</p>}
                                        <span style={{ color: "#57534e", fontSize: 11, marginLeft: "auto" }}>{form.message.length} অক্ষর</span>
                                    </div>
                                </div>

                                <button type="submit" disabled={status === "sending"}
                                    style={{ ...bn, marginTop: 20, width: "100%", padding: "13px", borderRadius: 999, border: "none", background: status === "sending" ? "rgba(245,158,11,0.4)" : "linear-gradient(90deg,#f59e0b,#ea580c)", color: "#0d1f1e", fontWeight: 700, fontSize: 14, cursor: status === "sending" ? "not-allowed" : "pointer", transition: "all 0.2s" }}>
                                    {status === "sending" ? "পাঠানো হচ্ছে..." : "বার্তা পাঠান →"}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Office info */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {OFFICES.map((o) => (
                            <div key={o.city} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${o.color}25`, borderRadius: 18, padding: "16px 18px" }}>
                                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                                    <div style={{ width: 38, height: 38, borderRadius: 10, background: `${o.color}15`, border: `1px solid ${o.color}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{o.icon}</div>
                                    <div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                                            <span style={{ ...bn, color: "#fff", fontWeight: 700, fontSize: 14 }}>{o.city}</span>
                                            <span style={{ ...bn, fontSize: 11, padding: "2px 8px", borderRadius: 999, background: `${o.color}15`, color: o.color }}>{o.role}</span>
                                        </div>
                                        <p style={{ ...bn, color: "#57534e", fontSize: 12, marginBottom: 6, lineHeight: 1.6 }}>{o.address}</p>
                                        <a href={`tel:${o.phone}`} style={{ ...bn, display: "block", color: "#5eead4", fontSize: 12, textDecoration: "none", marginBottom: 2 }}>📞 {o.phone}</a>
                                        <a href={`mailto:${o.email}`} style={{ ...bn, display: "block", color: "#fbbf24", fontSize: 12, textDecoration: "none", wordBreak: "break-all" }}>✉️ {o.email}</a>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Quick contact */}
                        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: "16px 18px" }}>
                            <p style={{ ...bn, color: "#57534e", fontSize: 12, marginBottom: 12 }}>দ্রুত যোগাযোগ</p>
                            {[
                                { icon: "📞", label: "ফোন", val: "+880 2-9876543", color: "#2dd4bf" },
                                { icon: "💬", label: "WhatsApp", val: "+880 1X-XXXXXXXX", color: "#34d399" },
                                { icon: "✉️", label: "ইমেইল", val: "info@anandamarga.org.bd", color: "#fbbf24" },
                            ].map((c) => (
                                <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                                    <span style={{ fontSize: 16 }}>{c.icon}</span>
                                    <div>
                                        <div style={{ color: "#57534e", fontSize: 10, textTransform: "uppercase", letterSpacing: 1 }}>{c.label}</div>
                                        <div style={{ color: c.color, fontSize: 12, fontFamily: "monospace" }}>{c.val}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}