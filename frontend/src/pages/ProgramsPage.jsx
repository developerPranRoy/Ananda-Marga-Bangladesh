import { useState, useRef, useEffect } from "react";

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

const CATS = ["সব", "যোগ", "শিক্ষা", "সেবা", "পরিবেশ"];

const PROGRAMS = [
    { id: 1, cat: "যোগ", icon: "🧘", title: "আষ্টাঙ্গ যোগ সাধনা", desc: "আনন্দমার্গের বিশেষ যোগ পদ্ধতিতে শরীর, মন ও আত্মার সমন্বয়।", details: ["সপ্তাহে ৬ দিন", "শিক্ষানবিস থেকে অগ্রবর্তী", "বিনামূল্যে", "সার্টিফিকেট প্রদান"], color: "#f59e0b" },
    { id: 2, cat: "যোগ", icon: "🕉️", title: "মেডিটেশন কোর্স", desc: "মানসিক শান্তি ও আধ্যাত্মিক উন্নতির জন্য ১০ দিনের নিবিড় কোর্স।", details: ["১০ দিন নিবিড়", "অভিজ্ঞ আচার্য", "আবাসিক সুবিধা", "সকলের জন্য"], color: "#a78bfa" },
    { id: 3, cat: "শিক্ষা", icon: "📚", title: "আনন্দ মার্গ স্কুল", desc: "নৈতিক মূল্যবোধ ও আধুনিক শিক্ষার সমন্বয়ে পরিচালিত বিদ্যালয়।", details: ["প্রাক-প্রাথমিক থেকে ১০ম", "নৈতিক শিক্ষা বাধ্যতামূলক", "বৃত্তি সুযোগ", "যোগ ক্লাস"], color: "#2dd4bf" },
    { id: 4, cat: "শিক্ষা", icon: "🎓", title: "বৃত্তিমূলক প্রশিক্ষণ", desc: "সুবিধাবঞ্চিত যুবকদের জন্য দক্ষতা উন্নয়ন প্রশিক্ষণ কর্মসূচি।", details: ["সেলাই ও বুনন", "কম্পিউটার", "কৃষি উন্নয়ন", "ক্ষুদ্র উদ্যোক্তা"], color: "#34d399" },
    { id: 5, cat: "সেবা", icon: "🏥", title: "বিনামূল্যে স্বাস্থ্যসেবা", desc: "প্রতি মাসে বিনামূল্যে স্বাস্থ্য শিবির আয়োজন করা হয়।", details: ["মাসিক শিবির", "বিনামূল্যে ওষুধ", "প্রত্যন্ত এলাকা", "বিশেষজ্ঞ চিকিৎসক"], color: "#fb7185" },
    { id: 6, cat: "সেবা", icon: "🆘", title: "দুর্যোগ ত্রাণ", desc: "বন্যা ও ঘূর্ণিঝড়ে তাৎক্ষণিক ত্রাণ ও পুনর্বাসন কার্যক্রম।", details: ["তাৎক্ষণিক খাদ্য", "আশ্রয় নির্মাণ", "মানসিক পুনর্বাসন", "দীর্ঘমেয়াদী পুনর্গঠন"], color: "#f97316" },
    { id: 7, cat: "পরিবেশ", icon: "🌿", title: "বৃক্ষরোপণ অভিযান", desc: "প্রতি বছর হাজার হাজার গাছ লাগানোর মাধ্যমে পরিবেশ সংরক্ষণ।", details: ["বার্ষিক ১০,০০০+ গাছ", "স্কুল ক্যাম্পেইন", "ফলজ ও বনজ", "সচেতনতা কর্মসূচি"], color: "#4ade80" },
    { id: 8, cat: "পরিবেশ", icon: "♻️", title: "পরিবেশ সচেতনতা", desc: "বিদ্যালয় ও সমাজে পরিবেশ সচেতনতামূলক কর্মসূচি।", details: ["বিদ্যালয় ক্যাম্পেইন", "বর্জ্য ব্যবস্থাপনা", "জৈব কৃষি", "সোলার এনার্জি"], color: "#06b6d4" },
];

function ProgramCard({ p, i, vis }) {
    const [open, setOpen] = useState(false);
    return (
        <div style={{ background: `${p.color}0c`, border: `1px solid ${p.color}28`, borderRadius: 20, overflow: "hidden", opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(28px)", transition: `opacity 0.6s ease ${i * 0.08}s, transform 0.6s ease ${i * 0.08}s` }}>
            <div style={{ padding: 22 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div style={{ width: 46, height: 46, borderRadius: 13, background: `${p.color}18`, border: `1px solid ${p.color}28`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{p.icon}</div>
                    <span style={{ ...bn, fontSize: 11, padding: "4px 10px", borderRadius: 999, background: `${p.color}15`, color: p.color, border: `1px solid ${p.color}22` }}>{p.cat}</span>
                </div>
                <h3 style={{ ...bn, color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{p.title}</h3>
                <p style={{ ...bn, color: "#78716c", fontSize: 13, lineHeight: 1.7, marginBottom: 12 }}>{p.desc}</p>

                {/* Expandable details */}
                <div style={{ overflow: "hidden", maxHeight: open ? 200 : 0, opacity: open ? 1 : 0, transition: "all 0.4s ease" }}>
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12, marginBottom: 12 }}>
                        {p.details.map((d) => (
                            <div key={d} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                <span style={{ color: p.color, fontSize: 12 }}>✓</span>
                                <span style={{ ...bn, color: "#a8a29e", fontSize: 12 }}>{d}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <button type="button" onClick={() => setOpen(!open)}
                    style={{ ...bn, background: "none", border: "none", cursor: "pointer", color: p.color, fontSize: 12, padding: 0 }}>
                    {open ? "কম দেখুন ↑" : "বিস্তারিত দেখুন ↓"}
                </button>
            </div>
            {/* Bottom accent */}
            <div style={{ height: 2, background: `linear-gradient(90deg,${p.color},transparent)`, opacity: 0.4 }} />
        </div>
    );
}

export default function ProgramsPage() {
    const [cat, setCat] = useState("সব");
    const [gridRef, gridVis] = useReveal();
    const filtered = cat === "সব" ? PROGRAMS : PROGRAMS.filter((p) => p.cat === cat);

    return (
        <>
            {/* Hero */}
            <section style={{ paddingTop: 120, paddingBottom: 60, padding: "120px 24px 60px", background: "linear-gradient(135deg,#0d1f1e,#0f2a28,#0d1a10)", textAlign: "center", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 500, height: 220, borderRadius: "50%", background: "rgba(20,184,166,0.07)", filter: "blur(60px)", pointerEvents: "none" }} />
                <div style={{ position: "relative", maxWidth: 600, margin: "0 auto" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 999, background: "rgba(20,184,166,0.1)", border: "1px solid rgba(20,184,166,0.2)", color: "#5eead4", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 20 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#2dd4bf" }} /> আমাদের কার্যক্রম
                    </div>
                    <h1 style={{ ...bn, fontSize: "clamp(30px,5vw,52px)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 14 }}>
                        সেবা ও সাধনার<br />
                        <span style={{ background: "linear-gradient(90deg,#2dd4bf,#f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>কার্যক্রমসমূহ</span>
                    </h1>
                    <p style={{ ...bn, color: "#a8a29e", fontSize: 15, lineHeight: 1.7 }}>যোগ সাধনা থেকে সমাজসেবা — আনন্দমার্গের বহুমুখী কার্যক্রম।</p>
                </div>
            </section>

            {/* Filter + Grid */}
            <section style={{ padding: "60px 24px 80px" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    {/* Category filter */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 48 }}>
                        {CATS.map((c) => (
                            <button key={c} type="button" onClick={() => setCat(c)}
                                style={{ ...bn, padding: "8px 18px", borderRadius: 999, fontSize: 14, cursor: "pointer", transition: "all 0.2s", border: `1px solid ${cat === c ? "rgba(245,158,11,0.5)" : "rgba(255,255,255,0.1)"}`, background: cat === c ? "#f59e0b" : "transparent", color: cat === c ? "#0d1f1e" : "#a8a29e", fontWeight: cat === c ? 700 : 400, transform: cat === c ? "scale(1.05)" : "scale(1)" }}>
                                {c}
                            </button>
                        ))}
                    </div>

                    {/* Grid */}
                    <div ref={gridRef} style={{ display: "grid", gap: 16 }} className="sm:grid-cols-2 lg:grid-cols-4">
                        {filtered.map((p, i) => <ProgramCard key={p.id} p={p} i={i} vis={gridVis} />)}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ padding: "60px 24px", background: "#0a1a12", textAlign: "center" }}>
                <h2 style={{ ...bn, fontSize: "clamp(22px,3vw,32px)", fontWeight: 700, color: "#fff", marginBottom: 12 }}>কোনো কার্যক্রমে <span style={{ color: "#fbbf24" }}>যোগ দিন</span></h2>
                <p style={{ ...bn, color: "#78716c", fontSize: 14, marginBottom: 28 }}>স্বেচ্ছাসেবক বা অংশগ্রহণকারী — যেকোনো ভূমিকায় স্বাগতম।</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
                    <a href="/contact" style={{ ...bn, padding: "11px 26px", borderRadius: 999, background: "linear-gradient(90deg,#f59e0b,#ea580c)", color: "#0d1f1e", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>স্বেচ্ছাসেবক হন</a>
                    <a href="/donate" style={{ ...bn, padding: "11px 26px", borderRadius: 999, border: "1px solid rgba(20,184,166,0.3)", color: "#5eead4", fontSize: 14, textDecoration: "none" }}>দান করুন</a>
                </div>
            </section>
        </>
    );
}