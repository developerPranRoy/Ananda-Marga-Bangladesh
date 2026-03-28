// src/pages/ServicePage.jsx
import { useState, useRef, useEffect } from "react";
import { supabase } from "../utils/supabase";

const bn = { fontFamily: "'Noto Serif Bengali', serif" };

function useReveal() {
    const ref = useRef(null);
    const [vis, setVis] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.1 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return [ref, vis];
}

const inp = (err) => ({
    width: "100%", boxSizing: "border-box",
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${err ? "rgba(248,113,113,0.4)" : "rgba(255,255,255,0.1)"}`,
    borderRadius: 12, padding: "11px 14px",
    color: "#e7e5e4", fontSize: 14,
    fontFamily: "'Noto Serif Bengali', serif", outline: "none",
});

// ── AMURT Section ─────────────────────────────────────────────────────────────
function AmurtSection() {
    const [ref, vis] = useReveal();
    return (
        <section ref={ref} style={{ padding: "80px 24px", background: "#0f2218" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <div style={{ display: "grid", gap: 48, alignItems: "center" }} className="md:grid-cols-2">
                    <div style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateX(-24px)", transition: "all 0.7s ease" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 999, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", color: "#fcd34d", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>
                            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#fbbf24" }} /> AMURT Bangladesh
                        </div>
                        <h2 style={{ ...bn, fontSize: "clamp(26px,4vw,40px)", fontWeight: 700, color: "#fff", marginBottom: 18, lineHeight: 1.3 }}>
                            AMURT বাংলাদেশ — <span style={{ color: "#fbbf24" }}>মানবতার সেবায়</span>
                        </h2>
                        <p style={{ ...bn, color: "#a8a29e", fontSize: 15, lineHeight: 1.85, marginBottom: 16 }}>
                            AMURT (Ananda Marga Universal Relief Team) বাংলাদেশে ১৯৭২ সাল থেকে মানবিক সেবা প্রদান করে আসছে। মুক্তিযুদ্ধ পরবর্তী পুনর্গঠনে গুরুত্বপূর্ণ ভূমিকা রেখেছে এই সংগঠন।
                        </p>
                        <p style={{ ...bn, color: "#a8a29e", fontSize: 15, lineHeight: 1.85, marginBottom: 24 }}>
                            বন্যা, ঘূর্ণিঝড়সহ যেকোনো প্রাকৃতিক দুর্যোগে AMURT তাৎক্ষণিক সাড়া দেয় এবং দীর্ঘমেয়াদী পুনর্বাসন কার্যক্রম পরিচালনা করে।
                        </p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            {[["১৯৭২", "প্রতিষ্ঠা"], ["৬৪", "জেলায় কার্যক্রম"], ["৫০+", "বছরের অভিজ্ঞতা"], ["১০K+", "উপকারভোগী"]].map(([val, lbl]) => (
                                <div key={lbl} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "14px 16px" }}>
                                    <div style={{ ...bn, color: "#fbbf24", fontWeight: 700, fontSize: 22 }}>{val}</div>
                                    <div style={{ ...bn, color: "#57534e", fontSize: 12, marginTop: 2 }}>{lbl}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right decorative */}
                    <div style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateX(24px)", transition: "all 0.7s ease 0.2s" }}>
                        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 24, padding: 28 }}>
                            <div style={{ fontSize: 48, marginBottom: 16, textAlign: "center" }}>🤝</div>
                            <h3 style={{ ...bn, color: "#fff", fontWeight: 700, fontSize: 18, textAlign: "center", marginBottom: 20 }}>আমাদের মূলনীতি</h3>
                            {[
                                { icon: "💛", text: "সকলের জন্য নিঃস্বার্থ সেবা" },
                                { icon: "⚡", text: "দুর্যোগে তাৎক্ষণিক সাড়া" },
                                { icon: "🌱", text: "দীর্ঘমেয়াদী পুনর্বাসন" },
                                { icon: "🤲", text: "স্থানীয় সম্প্রদায়ের ক্ষমতায়ন" },
                                { icon: "🌍", text: "আন্তর্জাতিক নেটওয়ার্কের সাথে সংযুক্ত" },
                            ].map((item) => (
                                <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                                    <span style={{ ...bn, color: "#a8a29e", fontSize: 14 }}>{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ── Health Section ────────────────────────────────────────────────────────────
function HealthSection() {
    const [ref, vis] = useReveal();
    const PROGRAMS = [
        { icon: "🏥", title: "বিনামূল্যে স্বাস্থ্য শিবির", desc: "প্রতি মাসে বিভিন্ন জেলায় বিনামূল্যে চিকিৎসা সেবা প্রদান করা হয়।", tag: "মাসিক" },
        { icon: "💊", title: "ওষুধ বিতরণ", desc: "দরিদ্র রোগীদের বিনামূল্যে ওষুধ সরবরাহ করা হয়।", tag: "নিয়মিত" },
        { icon: "🩺", title: "বিশেষজ্ঞ চিকিৎসা", desc: "বিশেষজ্ঞ চিকিৎসকদের দ্বারা বিনামূল্যে পরামর্শ সেবা।", tag: "ত্রৈমাসিক" },
        { icon: "🤰", title: "মাতৃস্বাস্থ্য", desc: "গর্ভবতী মা ও শিশুদের জন্য বিশেষ স্বাস্থ্যসেবা কার্যক্রম।", tag: "AMURTEL" },
    ];

    return (
        <section ref={ref} style={{ padding: "80px 24px", background: "linear-gradient(180deg,#0f2218,#0d1f1e)" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: 48, opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(20px)", transition: "all 0.7s" }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>🏥</div>
                    <h2 style={{ ...bn, fontSize: "clamp(24px,4vw,38px)", fontWeight: 700, color: "#fff", marginBottom: 10 }}>
                        স্বাস্থ্যসেবা <span style={{ color: "#fbbf24" }}>কার্যক্রম</span>
                    </h2>
                    <p style={{ ...bn, color: "#78716c", fontSize: 15, maxWidth: 560, margin: "0 auto" }}>
                        সুবিধাবঞ্চিত মানুষদের দোরগোড়ায় স্বাস্থ্যসেবা পৌঁছে দেওয়াই আমাদের লক্ষ্য।
                    </p>
                </div>
                <div style={{ display: "grid", gap: 16 }} className="sm:grid-cols-2 lg:grid-cols-4">
                    {PROGRAMS.map((p, i) => (
                        <div key={p.title} style={{ background: "rgba(251,113,133,0.07)", border: "1px solid rgba(251,113,133,0.18)", borderRadius: 20, padding: 22, opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(28px)", transition: `all 0.6s ease ${i * 0.1}s` }}>
                            <div style={{ fontSize: 32, marginBottom: 12 }}>{p.icon}</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                                <h3 style={{ ...bn, color: "#fff", fontWeight: 700, fontSize: 15, margin: 0 }}>{p.title}</h3>
                            </div>
                            <span style={{ ...bn, fontSize: 11, padding: "2px 9px", borderRadius: 999, background: "rgba(251,113,133,0.12)", color: "#fb7185", border: "1px solid rgba(251,113,133,0.2)" }}>{p.tag}</span>
                            <p style={{ ...bn, color: "#78716c", fontSize: 13, lineHeight: 1.7, marginTop: 10 }}>{p.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ── Education Section ─────────────────────────────────────────────────────────
function EducationSection() {
    const [ref, vis] = useReveal();
    const ITEMS = [
        { icon: "🏫", title: "আনন্দ মার্গ স্কুল", desc: "নৈতিক মূল্যবোধ ভিত্তিক শিক্ষায় সারাদেশে ৫০+ বিদ্যালয়।", color: "#2dd4bf" },
        { icon: "👩‍🎓", title: "বৃত্তি কার্যক্রম", desc: "মেধাবী ও দরিদ্র শিক্ষার্থীদের বৃত্তি প্রদান।", color: "#a78bfa" },
        { icon: "💻", title: "কম্পিউটার প্রশিক্ষণ", desc: "যুবকদের ডিজিটাল দক্ষতা উন্নয়নে প্রশিক্ষণ।", color: "#fbbf24" },
        { icon: "✂️", title: "বৃত্তিমূলক শিক্ষা", desc: "সেলাই, বুনন ও কারিগরি প্রশিক্ষণ — কর্মসংস্থান নিশ্চিতকরণ।", color: "#34d399" },
        { icon: "📖", title: "প্রাপ্তবয়স্ক শিক্ষা", desc: "নিরক্ষর প্রাপ্তবয়স্কদের জন্য সাক্ষরতা কার্যক্রম।", color: "#f97316" },
        { icon: "🌐", title: "অনলাইন শিক্ষা", desc: "দূরবর্তী এলাকায় ডিজিটাল শিক্ষা সম্প্রসারণ।", color: "#06b6d4" },
    ];

    return (
        <section ref={ref} style={{ padding: "80px 24px", background: "#0d1f1e" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: 48, opacity: vis ? 1 : 0, transition: "all 0.7s" }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>📚</div>
                    <h2 style={{ ...bn, fontSize: "clamp(24px,4vw,38px)", fontWeight: 700, color: "#fff", marginBottom: 10 }}>
                        শিক্ষা <span style={{ color: "#fbbf24" }}>কার্যক্রম</span>
                    </h2>
                    <p style={{ ...bn, color: "#78716c", fontSize: 15, maxWidth: 560, margin: "0 auto" }}>
                        শিক্ষাই জাতির মেরুদণ্ড — এই বিশ্বাসে আনন্দমার্গ শিক্ষা বিস্তারে নিরলস কাজ করে যাচ্ছে।
                    </p>
                </div>
                <div style={{ display: "grid", gap: 14 }} className="sm:grid-cols-2 lg:grid-cols-3">
                    {ITEMS.map((item, i) => (
                        <div key={item.title} style={{ display: "flex", gap: 16, padding: 20, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(24px)", transition: `all 0.6s ease ${i * 0.08}s` }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${item.color}30`; e.currentTarget.style.transform = "translateY(-3px)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                            <div style={{ width: 46, height: 46, borderRadius: 13, background: `${item.color}15`, border: `1px solid ${item.color}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{item.icon}</div>
                            <div>
                                <h3 style={{ ...bn, color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{item.title}</h3>
                                <p style={{ ...bn, color: "#78716c", fontSize: 13, lineHeight: 1.7 }}>{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ── Disaster Relief Section ───────────────────────────────────────────────────
function DisasterSection() {
    const [ref, vis] = useReveal();
    const STEPS = [
        { step: "০১", icon: "🚨", title: "তাৎক্ষণিক সাড়া", desc: "দুর্যোগের ২৪ ঘণ্টার মধ্যে ত্রাণ দল মাঠে পৌঁছায়।" },
        { step: "০২", icon: "🍱", title: "খাদ্য ও আশ্রয়", desc: "জরুরি খাবার, পানি ও অস্থায়ী আশ্রয়ের ব্যবস্থা।" },
        { step: "০৩", icon: "🏥", title: "চিকিৎসা সেবা", desc: "মোবাইল মেডিকেল টিম দিয়ে তাৎক্ষণিক চিকিৎসা।" },
        { step: "০৪", icon: "🏗️", title: "পুনর্বাসন", desc: "দীর্ঘমেয়াদী পুনর্গঠন ও আর্থিক পুনর্বাসন।" },
    ];

    return (
        <section ref={ref} style={{ padding: "80px 24px", background: "#0a1a12" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: 48, opacity: vis ? 1 : 0, transition: "all 0.7s" }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>🆘</div>
                    <h2 style={{ ...bn, fontSize: "clamp(24px,4vw,38px)", fontWeight: 700, color: "#fff", marginBottom: 10 }}>
                        দুর্যোগ <span style={{ color: "#fbbf24" }}>ত্রাণ কার্যক্রম</span>
                    </h2>
                    <p style={{ ...bn, color: "#78716c", fontSize: 15, maxWidth: 560, margin: "0 auto" }}>
                        বন্যা, ঘূর্ণিঝড়, ভূমিকম্প — যেকোনো দুর্যোগে আমরা পাশে আছি।
                    </p>
                </div>

                <div style={{ display: "grid", gap: 16 }} className="sm:grid-cols-2 lg:grid-cols-4">
                    {STEPS.map((s, i) => (
                        <div key={s.step} style={{ background: "rgba(249,115,22,0.07)", border: "1px solid rgba(249,115,22,0.18)", borderRadius: 20, padding: 24, opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(28px)", transition: `all 0.6s ease ${i * 0.12}s` }}>
                            <div style={{ ...bn, color: "rgba(249,115,22,0.3)", fontWeight: 700, fontSize: 32, marginBottom: 12 }}>{s.step}</div>
                            <div style={{ fontSize: 28, marginBottom: 12 }}>{s.icon}</div>
                            <h3 style={{ ...bn, color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{s.title}</h3>
                            <p style={{ ...bn, color: "#78716c", fontSize: 13, lineHeight: 1.7 }}>{s.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Past relief work */}
                <div style={{ marginTop: 40, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 28 }}>
                    <h3 style={{ ...bn, color: "#fff", fontWeight: 700, fontSize: 18, marginBottom: 20 }}>উল্লেখযোগ্য ত্রাণ কার্যক্রম</h3>
                    <div style={{ display: "grid", gap: 12 }} className="sm:grid-cols-3">
                        {[
                            { year: "২০২২", event: "সিলেট বন্যা", detail: "৫০,০০০+ পরিবারকে সহায়তা" },
                            { year: "২০২০", event: "আম্পান ঘূর্ণিঝড়", detail: "উপকূলীয় এলাকায় ত্রাণ বিতরণ" },
                            { year: "২০১৭", event: "রোহিঙ্গা সংকট", detail: "শরণার্থীদের খাদ্য ও চিকিৎসা সেবা" },
                        ].map((item) => (
                            <div key={item.year} style={{ padding: "14px 16px", background: "rgba(249,115,22,0.05)", border: "1px solid rgba(249,115,22,0.12)", borderRadius: 14 }}>
                                <div style={{ display: "flex", gap: 10, marginBottom: 6 }}>
                                    <span style={{ ...bn, color: "#f97316", fontWeight: 700, fontSize: 14 }}>{item.year}</span>
                                    <span style={{ ...bn, color: "#fff", fontWeight: 600, fontSize: 14 }}>{item.event}</span>
                                </div>
                                <p style={{ ...bn, color: "#78716c", fontSize: 12 }}>{item.detail}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

// ── Volunteer Form ────────────────────────────────────────────────────────────
function VolunteerSection() {
    const [ref, vis] = useReveal();
    const [form, setForm] = useState({ name: "", email: "", phone: "", district: "", skill: "", message: "" });
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState("idle");

    const SKILLS = ["স্বাস্থ্যসেবা", "শিক্ষা", "দুর্যোগ ত্রাণ", "যোগ ও মেডিটেশন", "তথ্যপ্রযুক্তি", "ফটোগ্রাফি", "অন্যান্য"];

    const ch = (f) => (e) => { setForm((d) => ({ ...d, [f]: e.target.value })); setErrors((er) => ({ ...er, [f]: "" })); };

    const submit = async (e) => {
        e.preventDefault();
        const er = {};
        if (!form.name.trim()) er.name = "নাম লিখুন";
        if (!/\S+@\S+\.\S+/.test(form.email)) er.email = "সঠিক ইমেইল লিখুন";
        if (!form.phone.trim()) er.phone = "ফোন নম্বর লিখুন";
        if (!form.skill) er.skill = "দক্ষতা বেছে নিন";
        if (Object.keys(er).length) { setErrors(er); return; }

        setStatus("sending");
        const { error } = await supabase.from("contact_messages").insert({
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            topic: `স্বেচ্ছাসেবক আবেদন — ${form.skill}`,
            message: `জেলা: ${form.district || "উল্লেখ নেই"}\nদক্ষতা: ${form.skill}\n\n${form.message}`,
        });

        if (error) { setErrors({ submit: error.message }); setStatus("idle"); return; }
        setStatus("success");
    };

    return (
        <section ref={ref} style={{ padding: "80px 24px", background: "#0d1f1e", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 500, height: 200, borderRadius: "50%", background: "rgba(245,158,11,0.06)", filter: "blur(60px)", pointerEvents: "none" }} />
            <div style={{ position: "relative", maxWidth: 700, margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: 40, opacity: vis ? 1 : 0, transition: "all 0.7s" }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>🙋</div>
                    <h2 style={{ ...bn, fontSize: "clamp(24px,4vw,38px)", fontWeight: 700, color: "#fff", marginBottom: 10 }}>
                        স্বেচ্ছাসেবক <span style={{ color: "#fbbf24" }}>হিসেবে যোগ দিন</span>
                    </h2>
                    <p style={{ ...bn, color: "#78716c", fontSize: 15 }}>আপনার সময় ও দক্ষতা দিয়ে সমাজের উপকার করুন।</p>
                </div>

                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 22, padding: 28, opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(24px)", transition: "all 0.7s ease 0.2s" }}>
                    {status === "success" ? (
                        <div style={{ textAlign: "center", padding: "40px 0" }}>
                            <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
                            <h3 style={{ ...bn, color: "#fff", fontWeight: 700, fontSize: 20, marginBottom: 10 }}>আবেদন পাঠানো হয়েছে!</h3>
                            <p style={{ ...bn, color: "#78716c", fontSize: 14 }}>আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।</p>
                            <button type="button" onClick={() => { setStatus("idle"); setForm({ name: "", email: "", phone: "", district: "", skill: "", message: "" }); }}
                                style={{ ...bn, marginTop: 20, padding: "10px 24px", borderRadius: 999, border: "1px solid rgba(245,158,11,0.3)", background: "transparent", color: "#fbbf24", fontSize: 13, cursor: "pointer" }}>
                                আরেকটি আবেদন করুন
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={submit} noValidate>
                            <div style={{ display: "grid", gap: 14 }} className="sm:grid-cols-2">
                                {/* Name */}
                                <div>
                                    <label style={{ ...bn, display: "block", color: "#78716c", fontSize: 12, marginBottom: 5 }}>নাম <span style={{ color: "#fbbf24" }}>*</span></label>
                                    <input type="text" placeholder="আপনার পূর্ণ নাম" value={form.name} onChange={ch("name")} style={inp(errors.name)}
                                        onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
                                        onBlur={(e) => (e.target.style.borderColor = errors.name ? "rgba(248,113,113,0.4)" : "rgba(255,255,255,0.1)")} />
                                    {errors.name && <p style={{ ...bn, color: "#f87171", fontSize: 11, marginTop: 3 }}>{errors.name}</p>}
                                </div>
                                {/* Email */}
                                <div>
                                    <label style={{ ...bn, display: "block", color: "#78716c", fontSize: 12, marginBottom: 5 }}>ইমেইল <span style={{ color: "#fbbf24" }}>*</span></label>
                                    <input type="email" placeholder="example@email.com" value={form.email} onChange={ch("email")} style={inp(errors.email)}
                                        onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
                                        onBlur={(e) => (e.target.style.borderColor = errors.email ? "rgba(248,113,113,0.4)" : "rgba(255,255,255,0.1)")} />
                                    {errors.email && <p style={{ ...bn, color: "#f87171", fontSize: 11, marginTop: 3 }}>{errors.email}</p>}
                                </div>
                                {/* Phone */}
                                <div>
                                    <label style={{ ...bn, display: "block", color: "#78716c", fontSize: 12, marginBottom: 5 }}>ফোন <span style={{ color: "#fbbf24" }}>*</span></label>
                                    <input type="tel" placeholder="+880 1X-XXXXXXXX" value={form.phone} onChange={ch("phone")} style={inp(errors.phone)}
                                        onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
                                        onBlur={(e) => (e.target.style.borderColor = errors.phone ? "rgba(248,113,113,0.4)" : "rgba(255,255,255,0.1)")} />
                                    {errors.phone && <p style={{ ...bn, color: "#f87171", fontSize: 11, marginTop: 3 }}>{errors.phone}</p>}
                                </div>
                                {/* District */}
                                <div>
                                    <label style={{ ...bn, display: "block", color: "#78716c", fontSize: 12, marginBottom: 5 }}>জেলা</label>
                                    <input type="text" placeholder="আপনার জেলার নাম" value={form.district} onChange={ch("district")} style={inp(false)}
                                        onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
                                        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
                                </div>
                            </div>

                            {/* Skill */}
                            <div style={{ marginTop: 14 }}>
                                <label style={{ ...bn, display: "block", color: "#78716c", fontSize: 12, marginBottom: 5 }}>দক্ষতা / আগ্রহের ক্ষেত্র <span style={{ color: "#fbbf24" }}>*</span></label>
                                <select value={form.skill} onChange={ch("skill")} style={{ ...inp(errors.skill), cursor: "pointer" }}
                                    onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
                                    onBlur={(e) => (e.target.style.borderColor = errors.skill ? "rgba(248,113,113,0.4)" : "rgba(255,255,255,0.1)")}>
                                    <option value="" style={{ background: "#0d1f1e" }}>বেছে নিন</option>
                                    {SKILLS.map((s) => <option key={s} value={s} style={{ background: "#0d1f1e" }}>{s}</option>)}
                                </select>
                                {errors.skill && <p style={{ ...bn, color: "#f87171", fontSize: 11, marginTop: 3 }}>{errors.skill}</p>}
                            </div>

                            {/* Message */}
                            <div style={{ marginTop: 14 }}>
                                <label style={{ ...bn, display: "block", color: "#78716c", fontSize: 12, marginBottom: 5 }}>বার্তা <span style={{ color: "#57534e", fontSize: 11 }}>(ঐচ্ছিক)</span></label>
                                <textarea rows={4} placeholder="কেন স্বেচ্ছাসেবক হতে চান? আপনার অভিজ্ঞতা সম্পর্কে লিখুন..." value={form.message} onChange={ch("message")}
                                    style={{ ...inp(false), resize: "vertical" }}
                                    onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
                                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
                            </div>

                            {errors.submit && (
                                <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 10, background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)" }}>
                                    <p style={{ ...bn, color: "#f87171", fontSize: 13, margin: 0 }}>⚠️ {errors.submit}</p>
                                </div>
                            )}

                            <button type="submit" disabled={status === "sending"}
                                style={{ ...bn, width: "100%", marginTop: 20, padding: "13px", borderRadius: 999, border: "none", background: status === "sending" ? "rgba(245,158,11,0.4)" : "linear-gradient(90deg,#f59e0b,#ea580c)", color: "#0d1f1e", fontWeight: 700, fontSize: 15, cursor: status === "sending" ? "not-allowed" : "pointer" }}>
                                {status === "sending" ? "পাঠানো হচ্ছে..." : "🙋 স্বেচ্ছাসেবক হিসেবে আবেদন করুন"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ServicePage() {
    return (
        <>
            {/* Hero */}
            <section style={{ paddingTop: 100, paddingBottom: 60, padding: "100px 24px 60px", background: "linear-gradient(135deg,#0d1f1e,#0f2a28,#0d1a10)", textAlign: "center", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 500, height: 220, borderRadius: "50%", background: "rgba(20,184,166,0.07)", filter: "blur(60px)", pointerEvents: "none" }} />
                <div style={{ position: "relative", maxWidth: 680, margin: "0 auto" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 999, background: "rgba(20,184,166,0.1)", border: "1px solid rgba(20,184,166,0.2)", color: "#5eead4", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 20 }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#2dd4bf" }} /> সেবামূলক কার্যক্রম
                    </div>
                    <h1 style={{ ...bn, fontSize: "clamp(28px,5vw,50px)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 16 }}>
                        মানবতার সেবায়
                        <br />
                        <span style={{ background: "linear-gradient(90deg,#f59e0b,#ea580c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            আনন্দমার্গ AMURT
                        </span>
                    </h1>
                    <p style={{ ...bn, color: "#a8a29e", fontSize: 15, lineHeight: 1.8, maxWidth: 520, margin: "0 auto 28px" }}>
                        স্বাস্থ্য, শিক্ষা ও দুর্যোগ ত্রাণে বাংলাদেশের প্রতিটি কোণে আমাদের সেবা পৌঁছে যাচ্ছে।
                    </p>
                    {/* Quick stats */}
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16 }}>
                        {[["৩০+", "স্বাস্থ্য শিবির/বছর"], ["৫০+", "বিদ্যালয়"], ["১০K+", "উপকারভোগী"]].map(([val, lbl]) => (
                            <div key={lbl} style={{ padding: "10px 20px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }}>
                                <span style={{ ...bn, color: "#fbbf24", fontWeight: 700, fontSize: 18 }}>{val}</span>
                                <span style={{ ...bn, color: "#57534e", fontSize: 12, marginLeft: 6 }}>{lbl}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <AmurtSection />
            <HealthSection />
            <EducationSection />
            <DisasterSection />
            <VolunteerSection />
        </>
    );
}