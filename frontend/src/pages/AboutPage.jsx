import { useRef, useState, useEffect } from "react";

const bn = { fontFamily: "'Noto Serif Bengali', serif" };

function useReveal() {
    const ref = useRef(null);
    const [vis, setVis] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.12 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return [ref, vis];
}

const TIMELINE = [
    { year: "১৯৫৫", title: "আনন্দমার্গের প্রতিষ্ঠা", desc: "শ্রী শ্রী আনন্দমূর্তি জী বিহারে আনন্দমার্গ প্রতিষ্ঠা করেন।", icon: "🕉️" },
    { year: "১৯৬৫", title: "বাংলাদেশে আগমন", desc: "তৎকালীন পূর্ব পাকিস্তানে প্রথম শাখা স্থাপিত হয়।", icon: "🌱" },
    { year: "১৯৭২", title: "স্বাধীন বাংলাদেশে প্রসার", desc: "মুক্তিযুদ্ধের পর সংগঠন পুনর্গঠিত হয় ও সেবামূলক কার্যক্রম শুরু হয়।", icon: "🇧🇩" },
    { year: "১৯৮০", title: "শিক্ষা কার্যক্রম", desc: "AMURT বাংলাদেশে শিক্ষা ও স্বাস্থ্য কেন্দ্র স্থাপন করে।", icon: "📚" },
    { year: "২০০০", title: "বিস্তার ও উন্নয়ন", desc: "৬৪ জেলায় কার্যক্রম সম্প্রসারিত হয়।", icon: "📈" },
    { year: "আজ", title: "অব্যাহত যাত্রা", desc: "২০০+ সেবাকেন্দ্র ও ১০,০০০+ স্বেচ্ছাসেবক নিয়ে এগিয়ে চলেছে।", icon: "✨" },
];

const VALUES = [
    { icon: "🧘", title: "আত্মজ্ঞান", desc: "নিজেকে জানার মাধ্যমে পরমসত্তার সাথে সংযোগ।", color: "#f59e0b" },
    { icon: "💛", title: "সর্বজনীন প্রেম", desc: "জাতি-ধর্ম নির্বিশেষে সকলকে ভালোবাসা ও সেবা করা।", color: "#2dd4bf" },
    { icon: "⚖️", title: "নৈতিকতা", desc: "ব্যক্তিগত ও সামাজিক জীবনে উচ্চ নৈতিক মানদণ্ড।", color: "#a78bfa" },
    { icon: "🌍", title: "বিশ্বভ্রাতৃত্ব", desc: "সমগ্র মানবজাতি একটি পরিবার — এই দর্শনে বিশ্বাসী।", color: "#34d399" },
];

export default function AboutPage() {
    const [valRef, valVis] = useReveal();
    const [tlRef, tlVis] = useReveal();

    return (
        <>
            {/* ── Hero ── */}
            <section style={{ paddingTop: 120, paddingBottom: 80, padding: "120px 24px 80px", background: "linear-gradient(135deg,#0d1f1e 0%,#0f2a28 50%,#0d1a10 100%)", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, right: 0, width: 400, height: 400, borderRadius: "50%", background: "rgba(245,158,11,0.05)", filter: "blur(60px)", pointerEvents: "none" }} />
                <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gap: 48, alignItems: "center" }} className="md:grid-cols-2">
                    <div style={{ animation: "fadeUp 0.8s ease both" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 999, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", color: "#fcd34d", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 20 }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fbbf24" }} /> আমাদের পরিচয়
                        </div>
                        <h1 style={{ ...bn, fontSize: "clamp(32px,5vw,54px)", fontWeight: 700, lineHeight: 1.15, marginBottom: 20 }}>
                            <span style={{ color: "#fff" }}>আনন্দমার্গ</span><br />
                            <span style={{ background: "linear-gradient(90deg,#f59e0b,#ea580c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>বাংলাদেশ</span>
                        </h1>
                        <p style={{ ...bn, color: "#a8a29e", fontSize: 15, lineHeight: 1.8, marginBottom: 28, maxWidth: 440 }}>
                            একটি আন্তর্জাতিক আধ্যাত্মিক ও সমাজসেবামূলক সংগঠন — ব্যক্তি থেকে সমাজ, আত্মা থেকে বিশ্ব।
                        </p>
                        <a href="#timeline" style={{ ...bn, display: "inline-block", padding: "10px 24px", borderRadius: 999, background: "linear-gradient(90deg,#f59e0b,#ea580c)", color: "#0d1f1e", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                            আমাদের ইতিহাস দেখুন
                        </a>
                    </div>

                    {/* Decorative ring */}
                    <div className="hidden md:flex" style={{ alignItems: "center", justifyContent: "center" }}>
                        <div style={{ position: "relative", width: 260, height: 260 }}>
                            {[260, 200, 140].map((s) => (
                                <div key={s} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: s, height: s, borderRadius: "50%", border: "1px solid rgba(245,158,11,0.1)" }} />
                            ))}
                            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
                                <span style={{ fontSize: 40 }}>🕉️</span>
                                <span style={{ ...bn, color: "#fbbf24", fontWeight: 700, fontSize: 18 }}>১৯৫৫</span>
                                <span style={{ color: "#78716c", fontSize: 11 }}>থেকে সেবায়</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Values ── */}
            <section ref={valRef} style={{ padding: "80px 24px", background: "#0f2218" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: 48, opacity: valVis ? 1 : 0, transform: valVis ? "none" : "translateY(20px)", transition: "all 0.7s" }}>
                        <div style={{ color: "rgba(245,158,11,0.6)", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>Our Values</div>
                        <h2 style={{ ...bn, fontSize: "clamp(26px,4vw,40px)", fontWeight: 700, color: "#fff" }}>লক্ষ্য ও <span style={{ color: "#fbbf24" }}>আদর্শ</span></h2>
                    </div>
                    <div style={{ display: "grid", gap: 16 }} className="sm:grid-cols-2 lg:grid-cols-4">
                        {VALUES.map((v, i) => (
                            <div key={v.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 24, opacity: valVis ? 1 : 0, transform: valVis ? "none" : "translateY(28px)", transition: `all 0.6s ease ${i * 0.1}s` }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${v.color}30`; e.currentTarget.style.transform = "translateY(-4px)"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(0)"; }}
                            >
                                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${v.color}15`, border: `1px solid ${v.color}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 }}>{v.icon}</div>
                                <h3 style={{ ...bn, color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{v.title}</h3>
                                <p style={{ ...bn, color: "#78716c", fontSize: 13, lineHeight: 1.7 }}>{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Timeline ── */}
            <section id="timeline" ref={tlRef} style={{ padding: "80px 24px", background: "linear-gradient(180deg,#0f2218,#0d1f1e)" }}>
                <div style={{ maxWidth: 800, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: 56, opacity: tlVis ? 1 : 0, transition: "all 0.7s" }}>
                        <div style={{ color: "rgba(20,184,166,0.6)", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>History</div>
                        <h2 style={{ ...bn, fontSize: "clamp(26px,4vw,40px)", fontWeight: 700, color: "#fff" }}>আমাদের <span style={{ color: "#fbbf24" }}>ইতিহাস</span></h2>
                    </div>

                    <div style={{ position: "relative" }}>
                        {/* center line */}
                        <div className="hidden sm:block" style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "linear-gradient(180deg,rgba(245,158,11,0.4),transparent)", transform: "translateX(-50%)" }} />
                        <div className="sm:hidden" style={{ position: "absolute", left: 20, top: 0, bottom: 0, width: 1, background: "rgba(245,158,11,0.3)" }} />

                        {TIMELINE.map((item, i) => {
                            const left = i % 2 === 0;
                            return (
                                <div key={item.year} style={{ position: "relative", display: "flex", alignItems: "center", marginBottom: 32, opacity: tlVis ? 1 : 0, transform: tlVis ? "none" : `translateX(${left ? -20 : 20}px)`, transition: `all 0.6s ease ${i * 0.1}s` }}
                                    className={`sm:${left ? "flex-row" : "flex-row-reverse"}`}
                                >
                                    {/* Card */}
                                    <div style={{ flex: 1, paddingLeft: 48, paddingRight: 0 }} className={`sm:pl-0 sm:${left ? "pr-12 text-right" : "pl-12"}`}>
                                        <div style={{ display: "inline-block", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "16px 20px", maxWidth: 300 }}
                                            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(245,158,11,0.2)")}
                                            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                                        >
                                            <div style={{ ...bn, color: "#fbbf24", fontWeight: 700, fontSize: 17, marginBottom: 4 }}>{item.year}</div>
                                            <div style={{ ...bn, color: "#f5f5f4", fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{item.title}</div>
                                            <p style={{ ...bn, color: "#78716c", fontSize: 12, lineHeight: 1.7 }}>{item.desc}</p>
                                        </div>
                                    </div>

                                    {/* Dot */}
                                    <div style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", width: 36, height: 36, borderRadius: "50%", background: "rgba(245,158,11,0.15)", border: "2px solid rgba(245,158,11,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, zIndex: 1 }}
                                        className="sm:static sm:transform-none sm:flex-shrink-0"
                                    >{item.icon}</div>

                                    <div className="hidden sm:block" style={{ flex: 1 }} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── Philosophy quote ── */}
            <section style={{ padding: "80px 24px", background: "#0d1f1e", textAlign: "center" }}>
                <div style={{ maxWidth: 640, margin: "0 auto" }}>
                    <div style={{ ...bn, fontSize: 64, color: "rgba(245,158,11,0.15)", lineHeight: 1, marginBottom: 8 }}>"</div>
                    <blockquote style={{ ...bn, fontSize: "clamp(20px,3vw,30px)", fontWeight: 700, color: "#fff", lineHeight: 1.5, marginBottom: 16 }}>
                        আত্মমোক্ষার্থং জগদ্ধিতায় চ
                    </blockquote>
                    <p style={{ ...bn, color: "rgba(94,234,212,0.7)", fontSize: 16, marginBottom: 24 }}>নিজের মুক্তির জন্য এবং জগতের কল্যাণের জন্য</p>
                    <div style={{ width: 60, height: 1, background: "linear-gradient(90deg,transparent,rgba(245,158,11,0.4),transparent)", margin: "0 auto 24px" }} />
                    <p style={{ ...bn, color: "#78716c", fontSize: 14, lineHeight: 1.8 }}>
                        এই মহাবাক্যটি আনন্দমার্গের দর্শনের মূলে। ব্যক্তির আধ্যাত্মিক উন্নতি ও সমাজের কল্যাণ — এই দুই লক্ষ্যকে একত্রে অর্জনই আমাদের জীবনদর্শন।
                    </p>
                </div>
            </section>

            <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}`}</style>
        </>
    );
}