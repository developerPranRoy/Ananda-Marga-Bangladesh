import { useState } from "react";
import { supabase } from "../utils/supabase";

const bn = { fontFamily: "'Noto Serif Bengali', serif" };
const fmt = (n) => "৳" + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const TIERS = [
    { amount: 500, label: "সহযোগী", icon: "🌱", color: "#2dd4bf" },
    { amount: 1500, label: "সেবক", icon: "🤝", color: "#fbbf24", popular: true },
    { amount: 5000, label: "দাতা", icon: "💛", color: "#a78bfa" },
    { amount: 10000, label: "মহাদাতা", icon: "🕉️", color: "#f97316" },
];

const CAUSES = [
    { id: "education", label: "শিক্ষা", icon: "📚" },
    { id: "health", label: "স্বাস্থ্য", icon: "🏥" },
    { id: "yoga", label: "যোগ কেন্দ্র", icon: "🧘" },
    { id: "disaster", label: "দুর্যোগ ত্রাণ", icon: "🆘" },
    { id: "general", label: "সাধারণ", icon: "🌿" },
];

const PAYMENTS = [
    { id: "bkash", label: "bKash", icon: "📱", number: "01XXXXXXXXX", color: "#e2136e" },
    { id: "nagad", label: "Nagad", icon: "💳", number: "01XXXXXXXXX", color: "#f7941d" },
    { id: "bank", label: "ব্যাংক ট্রান্সফার", icon: "🏦", number: "AC: XXXX-XXXX-XXXX", color: "#3b82f6" },
];

const INIT = { tierIdx: 1, custom: "", useCustom: false, cause: "general", name: "", phone: "", email: "", anon: false, payment: "bkash" };

// ── Reusable field ────────────────────────────────────────────────────────────
function Field({ label, required, error, children }) {
    return (
        <div>
            <label style={{ ...bn, display: "block", color: "#78716c", fontSize: 12, marginBottom: 5 }}>
                {label} {required && <span style={{ color: "#fbbf24" }}>*</span>}
            </label>
            {children}
            {error && <p style={{ ...bn, color: "#f87171", fontSize: 11, marginTop: 3 }}>{error}</p>}
        </div>
    );
}

const inpStyle = (err) => ({
    width: "100%", boxSizing: "border-box",
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${err ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.1)"}`,
    borderRadius: 12, padding: "11px 14px",
    color: "#e7e5e4", fontSize: 14,
    fontFamily: "'Noto Serif Bengali', serif", outline: "none",
});

const gradBtn = { ...bn, width: "100%", padding: "13px", borderRadius: 999, border: "none", background: "linear-gradient(90deg,#f59e0b,#ea580c)", color: "#0d1f1e", fontWeight: 700, fontSize: 14, cursor: "pointer" };
const backBtn = { ...bn, flex: 1, padding: "13px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.12)", background: "transparent", color: "#78716c", fontSize: 13, cursor: "pointer" };

// ── Steps ─────────────────────────────────────────────────────────────────────
function Step1({ d, set, next }) {
    const [err, setErr] = useState("");
    const amount = d.useCustom ? (parseInt(d.custom) || 0) : TIERS[d.tierIdx].amount;

    return (
        <div>
            <h3 style={{ ...bn, color: "#fff", fontWeight: 700, fontSize: 19, marginBottom: 4 }}>দানের পরিমাণ</h3>
            <p style={{ ...bn, color: "#78716c", fontSize: 13, marginBottom: 18 }}>আপনার সাধ্যমতো দান করুন।</p>

            {/* Tiers */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                {TIERS.map((t, i) => {
                    const active = !d.useCustom && d.tierIdx === i;
                    return (
                        <button key={t.amount} type="button" onClick={() => { set({ tierIdx: i, useCustom: false }); setErr(""); }}
                            style={{ position: "relative", padding: 14, textAlign: "left", borderRadius: 12, cursor: "pointer", border: `1px solid ${active ? t.color + "66" : "rgba(255,255,255,0.08)"}`, background: active ? t.color + "15" : "rgba(255,255,255,0.02)", transition: "all 0.2s", transform: active ? "scale(1.02)" : "scale(1)" }}>
                            {t.popular && <span style={{ position: "absolute", top: -9, right: 10, background: "#f59e0b", color: "#0d1f1e", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999 }}>জনপ্রিয়</span>}
                            <div style={{ fontSize: 20, marginBottom: 6 }}>{t.icon}</div>
                            <div style={{ ...bn, fontWeight: 700, fontSize: 15, color: t.color }}>{fmt(t.amount)}</div>
                            <div style={{ ...bn, fontSize: 11, color: "#78716c" }}>{t.label}</div>
                        </button>
                    );
                })}
            </div>

            {/* Custom */}
            {d.useCustom ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 14px", borderRadius: 12, border: "1px solid rgba(245,158,11,0.4)", background: "rgba(245,158,11,0.05)", marginBottom: 12 }}>
                    <span style={{ color: "#fbbf24" }}>৳</span>
                    <input autoFocus type="number" placeholder="পরিমাণ লিখুন" value={d.custom} onChange={(e) => { set({ custom: e.target.value }); setErr(""); }}
                        style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#fbbf24", fontSize: 14, fontFamily: "'Noto Serif Bengali', serif" }} />
                    <button type="button" onClick={() => set({ useCustom: false, custom: "" })} style={{ background: "none", border: "none", cursor: "pointer", color: "#57534e", fontSize: 14 }}>✕</button>
                </div>
            ) : (
                <button type="button" onClick={() => set({ useCustom: true })}
                    style={{ ...bn, width: "100%", padding: "11px", borderRadius: 12, border: "1px dashed rgba(255,255,255,0.12)", background: "transparent", color: "#78716c", fontSize: 13, cursor: "pointer", marginBottom: 12, transition: "all 0.2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(245,158,11,0.3)"; e.currentTarget.style.color = "#fbbf24"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#78716c"; }}>
                    + নিজে পরিমাণ লিখুন
                </button>
            )}
            {err && <p style={{ ...bn, color: "#f87171", fontSize: 12, marginBottom: 8 }}>{err}</p>}

            {/* Cause */}
            <p style={{ ...bn, color: "#78716c", fontSize: 12, marginBottom: 8 }}>কোন কাজে ব্যবহার করবেন?</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 18 }}>
                {CAUSES.map((c) => (
                    <button key={c.id} type="button" onClick={() => set({ cause: c.id })}
                        style={{ ...bn, display: "flex", alignItems: "center", gap: 5, padding: "5px 11px", borderRadius: 999, fontSize: 12, cursor: "pointer", border: `1px solid ${d.cause === c.id ? "rgba(245,158,11,0.5)" : "rgba(255,255,255,0.1)"}`, background: d.cause === c.id ? "rgba(245,158,11,0.1)" : "transparent", color: d.cause === c.id ? "#fbbf24" : "#78716c" }}>
                        {c.icon} {c.label}
                    </button>
                ))}
            </div>

            {amount >= 10 && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(245,158,11,0.2)", background: "rgba(245,158,11,0.07)", marginBottom: 18 }}>
                    <span style={{ ...bn, color: "#a8a29e", fontSize: 13 }}>মোট দান</span>
                    <span style={{ ...bn, color: "#fbbf24", fontWeight: 700, fontSize: 20 }}>{fmt(amount)}</span>
                </div>
            )}

            <button type="button" style={gradBtn} onClick={() => { if (amount < 10) { setErr("সর্বনিম্ন ১০ টাকা দান করুন"); return; } next(); }}>
                পরবর্তী ধাপ →
            </button>
        </div>
    );
}

function Step2({ d, set, next, back }) {
    const [errs, setErrs] = useState({});
    const go = () => {
        if (d.anon) { next(); return; }
        const e = {};
        if (!d.name.trim()) e.name = "নাম লিখুন";
        if (!d.phone.trim()) e.phone = "ফোন নম্বর লিখুন";
        if (Object.keys(e).length) { setErrs(e); return; }
        next();
    };
    const upd = (f) => (e) => { set({ [f]: e.target.value }); setErrs((er) => ({ ...er, [f]: "" })); };

    return (
        <div>
            <h3 style={{ ...bn, color: "#fff", fontWeight: 700, fontSize: 19, marginBottom: 4 }}>দাতার তথ্য</h3>
            <p style={{ ...bn, color: "#78716c", fontSize: 13, marginBottom: 18 }}>রসিদ পাঠানোর জন্য তথ্য দিন।</p>

            {/* Anonymous toggle */}
            <button type="button" onClick={() => set({ anon: !d.anon })}
                style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", borderRadius: 12, border: `1px solid ${d.anon ? "rgba(45,212,191,0.4)" : "rgba(255,255,255,0.08)"}`, background: d.anon ? "rgba(20,184,166,0.07)" : "rgba(255,255,255,0.02)", cursor: "pointer", marginBottom: 16, transition: "all 0.2s" }}>
                <span style={{ ...bn, fontSize: 13, color: d.anon ? "#2dd4bf" : "#78716c" }}>🕵️ পরিচয় গোপন রেখে দান করুন</span>
                <div style={{ width: 38, height: 20, borderRadius: 999, background: d.anon ? "#14b8a6" : "rgba(255,255,255,0.1)", position: "relative", transition: "background 0.3s", flexShrink: 0 }}>
                    <div style={{ position: "absolute", top: 2, left: d.anon ? 20 : 2, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.3s" }} />
                </div>
            </button>

            {!d.anon && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 4 }}>
                    <Field label="নাম" required error={errs.name}>
                        <input type="text" placeholder="আপনার পূর্ণ নাম" value={d.name} onChange={upd("name")} style={inpStyle(errs.name)}
                            onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
                            onBlur={(e) => (e.target.style.borderColor = errs.name ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.1)")} />
                    </Field>
                    <Field label="ফোন নম্বর" required error={errs.phone}>
                        <input type="tel" placeholder="+880 1X-XXXXXXXX" value={d.phone} onChange={upd("phone")} style={inpStyle(errs.phone)}
                            onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
                            onBlur={(e) => (e.target.style.borderColor = errs.phone ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.1)")} />
                    </Field>
                    <Field label="ইমেইল" error={null}>
                        <input type="email" placeholder="example@email.com" value={d.email} onChange={upd("email")} style={inpStyle(false)}
                            onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
                            onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
                    </Field>
                </div>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button type="button" style={backBtn} onClick={back}>← আগে</button>
                <button type="button" style={{ ...gradBtn, flex: 2, width: "auto" }} onClick={go}>পেমেন্ট পদ্ধতি →</button>
            </div>
        </div>
    );
}

function Step3({ d, set, amount, next, back }) {
    const cause = CAUSES.find((c) => c.id === d.cause);
    const payment = PAYMENTS.find((p) => p.id === d.payment);
    return (
        <div>
            <h3 style={{ ...bn, color: "#fff", fontWeight: 700, fontSize: 19, marginBottom: 4 }}>পেমেন্ট পদ্ধতি</h3>
            <p style={{ ...bn, color: "#78716c", fontSize: 13, marginBottom: 18 }}>পছন্দের পদ্ধতি বেছে নিন।</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
                {PAYMENTS.map((p) => {
                    const active = d.payment === p.id;
                    return (
                        <button key={p.id} type="button" onClick={() => set({ payment: p.id })}
                            style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 15px", borderRadius: 12, border: `1px solid ${active ? "rgba(245,158,11,0.4)" : "rgba(255,255,255,0.08)"}`, background: active ? "rgba(245,158,11,0.07)" : "rgba(255,255,255,0.02)", cursor: "pointer", width: "100%", transition: "all 0.2s" }}>
                            <div style={{ width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0, background: p.color + "20", border: `1px solid ${p.color}30` }}>{p.icon}</div>
                            <div style={{ flex: 1, textAlign: "left" }}>
                                <div style={{ ...bn, color: "#f5f5f4", fontSize: 14 }}>{p.label}</div>
                                <div style={{ color: "#57534e", fontSize: 11, fontFamily: "monospace", marginTop: 2 }}>{p.number}</div>
                            </div>
                            <div style={{ width: 17, height: 17, borderRadius: "50%", border: `2px solid ${active ? "#fbbf24" : "#44403c"}`, background: active ? "#fbbf24" : "transparent", flexShrink: 0, transition: "all 0.2s" }} />
                        </button>
                    );
                })}
            </div>

            {/* Summary */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 16px", marginBottom: 18 }}>
                {[
                    { label: "দানের পরিমাণ", val: fmt(amount), color: "#f5f5f4" },
                    { label: "কারণ", val: cause ? `${cause.icon} ${cause.label}` : "", color: "#2dd4bf" },
                    { label: "পেমেন্ট", val: payment ? payment.label : "", color: "#fbbf24" },
                ].map((r) => (
                    <div key={r.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ ...bn, color: "#78716c", fontSize: 13 }}>{r.label}</span>
                        <span style={{ ...bn, color: r.color, fontSize: 13 }}>{r.val}</span>
                    </div>
                ))}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
                    <span style={{ ...bn, color: "#f5f5f4", fontWeight: 700, fontSize: 14 }}>মোট</span>
                    <span style={{ ...bn, color: "#fbbf24", fontWeight: 700, fontSize: 18 }}>{fmt(amount)}</span>
                </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
                <button type="button" style={backBtn} onClick={back}>← আগে</button>
                <button type="button" style={{ ...gradBtn, flex: 2, width: "auto" }} onClick={next}>🙏 দান নিশ্চিত করুন</button>
            </div>
        </div>
    );
}

function Step4({ amount, cause, payment, reset }) {
    const c = CAUSES.find((x) => x.id === cause);
    const p = PAYMENTS.find((x) => x.id === payment);
    return (
        <div style={{ padding: "40px 0", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 16 }}>
            <div style={{ width: 76, height: 76, borderRadius: "50%", background: "rgba(245,158,11,0.12)", border: "2px solid rgba(245,158,11,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34 }}>🙏</div>
            <h4 style={{ ...bn, color: "#fff", fontWeight: 700, fontSize: 22, margin: 0 }}>অনেক ধন্যবাদ!</h4>
            <p style={{ ...bn, color: "#a8a29e", fontSize: 14, lineHeight: 1.7, maxWidth: 260, margin: 0 }}>আপনার {fmt(amount)} দান সফলভাবে নিবন্ধিত হয়েছে।</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                {c && <span style={{ ...bn, padding: "5px 12px", borderRadius: 999, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", color: "#fbbf24", fontSize: 12 }}>{c.icon} {c.label}</span>}
                {p && <span style={{ ...bn, padding: "5px 12px", borderRadius: 999, background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.2)", color: "#2dd4bf", fontSize: 12 }}>{p.label}</span>}
            </div>
            <button type="button" onClick={reset} style={{ ...bn, marginTop: 8, padding: "10px 24px", borderRadius: 999, border: "1px solid rgba(245,158,11,0.3)", background: "transparent", color: "#fbbf24", fontSize: 13, cursor: "pointer" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(245,158,11,0.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                আরেকটি দান করুন
            </button>
        </div>
    );
}

export default function DonationPage() {
    const [step, setStep] = useState(1);
    const [d, setD] = useState(INIT);

    const patch = (obj) => setD((prev) => ({ ...prev, ...obj }));
    const amount = d.useCustom ? (parseInt(d.custom) || 0) : TIERS[d.tierIdx].amount;
    const reset = () => { setStep(1); setD(INIT); };

    const STEP_LABELS = ["পরিমাণ", "তথ্য", "পেমেন্ট"];

    return (
        <>
            {/* Hero */}
            <section style={{ paddingTop: 120, paddingBottom: 56, padding: "120px 24px 56px", background: "linear-gradient(135deg,#0d1f1e,#0f2a28,#1a1205)", textAlign: "center", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 500, height: 220, borderRadius: "50%", background: "rgba(245,158,11,0.07)", filter: "blur(60px)", pointerEvents: "none" }} />
                <div style={{ position: "relative", maxWidth: 560, margin: "0 auto" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 999, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", color: "#fcd34d", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 20 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fbbf24" }} /> দান ও অনুদান
                    </div>
                    <h1 style={{ ...bn, fontSize: "clamp(30px,5vw,50px)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 14 }}>
                        আপনার দানে<br />
                        <span style={{ background: "linear-gradient(90deg,#f59e0b,#ea580c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>বদলাবে জীবন</span>
                    </h1>
                    <p style={{ ...bn, color: "#a8a29e", fontSize: 15, lineHeight: 1.7 }}>আপনার ছোট্ট অবদান একটি পরিবারের মুখে হাসি ফোটাতে পারে।</p>
                </div>
            </section>

            {/* Main */}
            <section style={{ padding: "52px 24px 80px" }}>
                <div style={{ maxWidth: 1060, margin: "0 auto", display: "grid", gap: 28 }} className="lg:grid-cols-[3fr_2fr]">

                    {/* Donation form card */}
                    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 22, overflow: "hidden" }}>
                        {/* Step indicator */}
                        {step < 4 && (
                            <div style={{ display: "flex", alignItems: "center", padding: "13px 22px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", gap: 4 }}>
                                {STEP_LABELS.map((lbl, i) => (
                                    <div key={lbl} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                                        <div style={{ width: 27, height: 27, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, background: step > i + 1 ? "#f59e0b" : step === i + 1 ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.05)", border: `1px solid ${step >= i + 1 ? "rgba(245,158,11,0.5)" : "rgba(255,255,255,0.1)"}`, color: step >= i + 1 ? "#fbbf24" : "#57534e", fontFamily: "'Noto Serif Bengali', serif", transition: "all 0.3s" }}>
                                            {step > i + 1 ? "✓" : i + 1}
                                        </div>
                                        <span style={{ ...bn, fontSize: 11, marginLeft: 6, color: step >= i + 1 ? "#fbbf24" : "#57534e" }} className="hidden sm:inline">{lbl}</span>
                                        {i < 2 && <div style={{ flex: 1, height: 1, margin: "0 8px", background: step > i + 1 ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.06)", transition: "background 0.3s" }} />}
                                    </div>
                                ))}
                            </div>
                        )}
                        <div style={{ padding: 24 }}>
                            {step === 1 && <Step1 d={d} set={patch} next={() => setStep(2)} />}
                            {step === 2 && <Step2 d={d} set={patch} next={() => setStep(3)} back={() => setStep(1)} />}

                            {step === 3 && <Step3 d={d} set={patch} amount={amount} back={() => setStep(2)} next={async () => {
                                const { error } = await supabase.from("donations").insert({
                                    donor_name: d.anon ? null : d.name?.trim() || null,
                                    email: d.anon ? null : d.email?.trim() || null,
                                    phone: d.anon ? null : d.phone?.trim() || null,
                                    amount, cause: d.cause, payment: d.payment,
                                    anonymous: d.anon, status: "pending",
                                });
                                if (error) { alert("সমস্যা: " + error.message); return; }
                                setStep(4);
                            }} />}


                            {step === 4 && <Step4 amount={amount} cause={d.cause} payment={d.payment} reset={reset} />}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <h3 style={{ ...bn, color: "#f5f5f4", fontWeight: 700, fontSize: 15, margin: 0 }}>আপনার দানের প্রভাব</h3>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                            {[["👨‍👩‍👧‍👦", "৫০০+", "পরিবার উপকৃত"], ["📖", "১২০০+", "শিশু শিক্ষার্থী"], ["🏥", "৩০+", "স্বাস্থ্য শিবির"], ["✅", "১০০%", "স্বচ্ছতা"]].map(([icon, val, lbl]) => (
                                <div key={lbl} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "14px 10px", textAlign: "center" }}>
                                    <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
                                    <div style={{ ...bn, color: "#fbbf24", fontWeight: 700, fontSize: 18 }}>{val}</div>
                                    <div style={{ ...bn, color: "#57534e", fontSize: 11, marginTop: 2 }}>{lbl}</div>
                                </div>
                            ))}
                        </div>
                        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 16 }}>
                            <p style={{ ...bn, color: "#57534e", fontSize: 11, marginBottom: 12 }}>আমরা বিশ্বাসযোগ্য কারণ</p>
                            {[["🔒", "১০০% নিরাপদ পেমেন্ট"], ["📊", "সম্পূর্ণ আর্থিক স্বচ্ছতা"], ["🧾", "প্রতিটি দানের রসিদ"], ["🏛️", "সরকার অনুমোদিত সংগঠন"]].map(([icon, text]) => (
                                <div key={text} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                                    <span style={{ fontSize: 16 }}>{icon}</span>
                                    <span style={{ ...bn, color: "#a8a29e", fontSize: 12 }}>{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}