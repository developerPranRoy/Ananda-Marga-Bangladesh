import { useState, useEffect, useRef } from "react";
import MusicPlayer from "../components/common/MusicPlayer";

// ─── Data ────────────────────────────────────────────────────────────────────

const OFFICES = [
    {
        city: "ঢাকা",
        role: "প্রধান কার্যালয়",
        address: "১২৩, মিরপুর রোড, ধানমন্ডি, ঢাকা-১২০৫",
        phone: "+880 2-9876543",
        email: "dhaka@anandamarga.org.bd",
        icon: "🏛️",
        color: "border-amber-400/30",
        accent: "#fbbf24",
    },
    {
        city: "চট্টগ্রাম",
        role: "আঞ্চলিক কার্যালয়",
        address: "৪৫, আগ্রাবাদ বাণিজ্যিক এলাকা, চট্টগ্রাম",
        phone: "+880 31-654321",
        email: "ctg@anandamarga.org.bd",
        icon: "🌊",
        color: "border-teal-400/30",
        accent: "#2dd4bf",
    },
    {
        city: "রাজশাহী",
        role: "উত্তরাঞ্চল কার্যালয়",
        address: "৭৮, শাহ মখদুম এভিনিউ, রাজশাহী",
        phone: "+880 721-234567",
        email: "raj@anandamarga.org.bd",
        icon: "🌿",
        color: "border-emerald-400/30",
        accent: "#34d399",
    },
];

const TOPICS = [
    "যোগ ও মেডিটেশন",
    "সমাজসেবা কার্যক্রম",
    "শিক্ষা কার্যক্রম",
    "স্বেচ্ছাসেবক হওয়া",
    "দান ও অনুদান",
    "অন্যান্য",
];

const SOCIAL = [
    { icon: "📘", label: "Facebook", handle: "@AnandaMargaBD", color: "#3b82f6" },
    { icon: "📸", label: "Instagram", handle: "@anandamarga_bd", color: "#ec4899" },
    { icon: "🐦", label: "YouTube", handle: "Ananda Marga BD", color: "#ef4444" },
];

// ─── Scroll Reveal Hook ───────────────────────────────────────────────────────

function useReveal(delay = 0) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold: 0.12 }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return [ref, visible];
}

// ─── Contact Form ─────────────────────────────────────────────────────────────

function ContactForm() {
    const [ref, visible] = useReveal();
    const [form, setForm] = useState({ name: "", email: "", phone: "", topic: "", message: "" });
    const [status, setStatus] = useState("idle"); // idle | sending | success | error
    const [errors, setErrors] = useState({});

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = "নাম লিখুন";
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "সঠিক ইমেইল লিখুন";
        if (!form.topic) e.topic = "বিষয় বেছে নিন";
        if (!form.message.trim() || form.message.length < 10) e.message = "অন্তত ১০ অক্ষর লিখুন";
        return e;
    };

    const handleChange = (field) => (e) => {
        setForm((f) => ({ ...f, [field]: e.target.value }));
        if (errors[field]) setErrors((er) => ({ ...er, [field]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setStatus("sending");
        // Simulate API call — replace with real endpoint
        await new Promise((r) => setTimeout(r, 1800));
        setStatus("success");
        setForm({ name: "", email: "", phone: "", topic: "", message: "" });
    };

    const inputBase = {
        width: "100%",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "12px",
        padding: "12px 16px",
        color: "#e7e5e4",
        fontSize: "14px",
        fontFamily: "'Noto Serif Bengali', serif",
        outline: "none",
        transition: "border-color 0.2s, background 0.2s",
    };

    return (
        <div
            ref={ref}
            className="bg-white/4 backdrop-blur rounded-2xl sm:rounded-3xl border border-white/8 p-6 sm:p-8"
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(28px)",
                transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
        >
            <div className="mb-6">
                <h3
                    className="text-xl sm:text-2xl font-bold text-white mb-1"
                    style={{ fontFamily: "'Noto Serif Bengali', serif" }}
                >
                    বার্তা পাঠান
                </h3>
                <p className="text-stone-500 text-sm" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                    আমরা ২৪ ঘণ্টার মধ্যে সাড়া দেওয়ার চেষ্টা করি।
                </p>
            </div>

            {status === "success" ? (
                <div
                    className="flex flex-col items-center justify-center py-16 text-center gap-4"
                    style={{ animation: "fadeUp 0.5s ease both" }}
                >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-3xl">
                        ✅
                    </div>
                    <h4 className="text-white font-bold text-lg" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                        বার্তা পাঠানো হয়েছে!
                    </h4>
                    <p className="text-stone-400 text-sm max-w-xs" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                        ধন্যবাদ। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।
                    </p>
                    <button
                        onClick={() => setStatus("idle")}
                        className="mt-2 px-6 py-2.5 rounded-full border border-amber-400/30 text-amber-300 text-sm hover:bg-amber-500/10 transition-all"
                        style={{ fontFamily: "'Noto Serif Bengali', serif" }}
                    >
                        আরেকটি বার্তা পাঠান
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} noValidate>
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                        {/* Name */}
                        <div>
                            <label className="block text-stone-400 text-xs mb-1.5 ml-1" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                                নাম <span className="text-amber-400">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="আপনার পূর্ণ নাম"
                                value={form.name}
                                onChange={handleChange("name")}
                                style={{
                                    ...inputBase,
                                    borderColor: errors.name ? "rgba(248,113,113,0.5)" : undefined,
                                }}
                                onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
                                onBlur={(e) => (e.target.style.borderColor = errors.name ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.1)")}
                            />
                            {errors.name && <p className="text-red-400 text-xs mt-1 ml-1" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-stone-400 text-xs mb-1.5 ml-1" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                                ইমেইল <span className="text-amber-400">*</span>
                            </label>
                            <input
                                type="email"
                                placeholder="example@email.com"
                                value={form.email}
                                onChange={handleChange("email")}
                                style={{
                                    ...inputBase,
                                    borderColor: errors.email ? "rgba(248,113,113,0.5)" : undefined,
                                }}
                                onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
                                onBlur={(e) => (e.target.style.borderColor = errors.email ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.1)")}
                            />
                            {errors.email && <p className="text-red-400 text-xs mt-1 ml-1" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>{errors.email}</p>}
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                        {/* Phone */}
                        <div>
                            <label className="block text-stone-400 text-xs mb-1.5 ml-1" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                                ফোন নম্বর
                            </label>
                            <input
                                type="tel"
                                placeholder="+880 1X-XXXXXXXX"
                                value={form.phone}
                                onChange={handleChange("phone")}
                                style={inputBase}
                                onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
                                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                            />
                        </div>

                        {/* Topic */}
                        <div>
                            <label className="block text-stone-400 text-xs mb-1.5 ml-1" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                                বিষয় <span className="text-amber-400">*</span>
                            </label>
                            <select
                                value={form.topic}
                                onChange={handleChange("topic")}
                                style={{
                                    ...inputBase,
                                    borderColor: errors.topic ? "rgba(248,113,113,0.5)" : undefined,
                                    cursor: "pointer",
                                }}
                                onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
                                onBlur={(e) => (e.target.style.borderColor = errors.topic ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.1)")}
                            >
                                <option value="" style={{ background: "#0d1f1e" }}>বিষয় বেছে নিন</option>
                                {TOPICS.map((t) => (
                                    <option key={t} value={t} style={{ background: "#0d1f1e" }}>{t}</option>
                                ))}
                            </select>
                            {errors.topic && <p className="text-red-400 text-xs mt-1 ml-1" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>{errors.topic}</p>}
                        </div>
                    </div>

                    {/* Message */}
                    <div className="mb-6">
                        <label className="block text-stone-400 text-xs mb-1.5 ml-1" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                            বার্তা <span className="text-amber-400">*</span>
                        </label>
                        <textarea
                            rows={5}
                            placeholder="আপনার বার্তা এখানে লিখুন..."
                            value={form.message}
                            onChange={handleChange("message")}
                            style={{
                                ...inputBase,
                                resize: "vertical",
                                minHeight: "120px",
                                borderColor: errors.message ? "rgba(248,113,113,0.5)" : undefined,
                            }}
                            onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
                            onBlur={(e) => (e.target.style.borderColor = errors.message ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.1)")}
                        />
                        <div className="flex justify-between items-center mt-1 px-1">
                            {errors.message
                                ? <p className="text-red-400 text-xs" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>{errors.message}</p>
                                : <span />
                            }
                            <span className="text-stone-600 text-xs">{form.message.length} অক্ষর</span>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={status === "sending"}
                        className="w-full py-3.5 rounded-full font-bold text-sm transition-all duration-200 relative overflow-hidden"
                        style={{
                            background: status === "sending"
                                ? "rgba(245,158,11,0.4)"
                                : "linear-gradient(90deg, #f59e0b, #ea580c)",
                            color: "#0d1f1e",
                            fontFamily: "'Noto Serif Bengali', serif",
                            cursor: status === "sending" ? "not-allowed" : "pointer",
                            transform: status === "sending" ? "none" : undefined,
                        }}
                        onMouseEnter={(e) => { if (status !== "sending") e.currentTarget.style.transform = "scale(1.01)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                    >
                        {status === "sending" ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                পাঠানো হচ্ছে...
                            </span>
                        ) : (
                            "বার্তা পাঠান →"
                        )}
                    </button>
                </form>
            )}
        </div>
    );
}

// ─── Office Cards ─────────────────────────────────────────────────────────────

function OfficeCards() {
    const [ref, visible] = useReveal();
    return (
        <div ref={ref} className="space-y-4">
            {OFFICES.map((o, i) => (
                <div
                    key={o.city}
                    className={`bg-white/4 rounded-2xl border ${o.color} p-5 hover:bg-white/6 transition-all duration-300`}
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? "none" : "translateX(24px)",
                        transition: `opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s`,
                    }}
                >
                    <div className="flex items-start gap-4">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                            style={{ background: o.accent + "15", border: `1px solid ${o.accent}30` }}
                        >
                            {o.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="text-white font-bold text-sm" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>{o.city}</span>
                                <span
                                    className="text-xs px-2 py-0.5 rounded-full"
                                    style={{
                                        background: o.accent + "18",
                                        color: o.accent,
                                        fontFamily: "'Noto Serif Bengali', serif",
                                        border: `1px solid ${o.accent}25`,
                                    }}
                                >
                                    {o.role}
                                </span>
                            </div>
                            <p className="text-stone-500 text-xs mb-2 leading-relaxed" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>{o.address}</p>
                            <div className="flex flex-col gap-1">
                                <a href={`tel:${o.phone}`} className="text-teal-400/80 text-xs hover:text-teal-300 transition-colors flex items-center gap-1.5">
                                    📞 {o.phone}
                                </a>
                                <a href={`mailto:${o.email}`} className="text-amber-400/70 text-xs hover:text-amber-300 transition-colors flex items-center gap-1.5 break-all">
                                    ✉️ {o.email}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Social */}
            <div className="bg-white/4 rounded-2xl border border-white/8 p-5 mt-2">
                <p className="text-stone-500 text-xs mb-3" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>সোশ্যাল মিডিয়া</p>
                <div className="flex flex-wrap gap-3">
                    {SOCIAL.map((s) => (
                        <a
                            key={s.label}
                            href="#"
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all duration-200 hover:scale-105"
                            style={{
                                background: s.color + "15",
                                border: `1px solid ${s.color}30`,
                                color: s.color,
                                fontFamily: "sans-serif",
                            }}
                        >
                            <span>{s.icon}</span>
                            <span>{s.handle}</span>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Map placeholder ──────────────────────────────────────────────────────────

function MapPlaceholder() {
    return (
        <div
            className="rounded-2xl border border-white/8 overflow-hidden"
            style={{ background: "#0a1a15", height: "220px", position: "relative" }}
        >
            {/* Stylized map grid */}
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", inset: 0 }}>
                <defs>
                    <pattern id="mapgrid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(245,158,11,0.06)" strokeWidth="1" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#mapgrid)" />
                {/* Stylized Bangladesh outline hint */}
                <ellipse cx="50%" cy="45%" rx="80" ry="70" fill="none" stroke="rgba(245,158,11,0.12)" strokeWidth="1.5" strokeDasharray="6 4" />
                <circle cx="50%" cy="45%" r="6" fill="#f59e0b" opacity="0.8" />
                <circle cx="50%" cy="45%" r="14" fill="none" stroke="#f59e0b" strokeWidth="1" opacity="0.3" />
                <circle cx="50%" cy="45%" r="24" fill="none" stroke="#f59e0b" strokeWidth="0.5" opacity="0.15" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <span className="text-2xl">🗺️</span>
                <span className="text-stone-500 text-xs" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                    Google Maps এখানে embed করুন
                </span>
                <code className="text-stone-600 text-[10px] bg-white/5 px-3 py-1 rounded-full">
                    &lt;iframe src="google-maps-url" /&gt;
                </code>
            </div>
        </div>
    );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({ scrolled }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const NAV_LINKS = [
        { label: "হোম", href: "/" },
        { label: "আমাদের পরিচয়", href: "/about" },
        { label: "কার্যক্রম", href: "/programs" },
        { label: "সেবামূলক", href: "/service" },
        { label: "যোগাযোগ", href: "/contact" },
    ];
    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#0d1f1e]/95 backdrop-blur-md shadow-lg shadow-black/30" : "bg-transparent"}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                <a href="/" className="flex items-center gap-2 group">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-base shadow-lg group-hover:scale-110 transition-transform">🕉️</div>
                    <div>
                        <div className="text-amber-400 font-bold text-xs leading-tight" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>আনন্দমার্গ</div>
                        <div className="text-teal-300/70 text-[10px] tracking-widest uppercase">Bangladesh</div>
                    </div>
                </a>
                <div className="hidden md:flex items-center gap-6 lg:gap-8">
                    {NAV_LINKS.map((l) => (
                        <a key={l.label} href={l.href}
                            className={`text-sm transition-colors relative group ${l.href === "/contact" ? "text-amber-400" : "text-stone-300 hover:text-amber-400"}`}
                            style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                            {l.label}
                            <span className={`absolute -bottom-1 left-0 h-px bg-amber-400 transition-all duration-300 ${l.href === "/contact" ? "w-full" : "w-0 group-hover:w-full"}`} />
                        </a>
                    ))}
                    <a href="#donate" className="px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-[#0d1f1e] font-bold text-sm transition-all hover:scale-105" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>দান করুন</a>
                </div>
                <button className="md:hidden text-stone-300 hover:text-amber-400 p-1" onClick={() => setMenuOpen(!menuOpen)}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                    </svg>
                </button>
            </div>
            <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="bg-[#0d1f1e]/98 backdrop-blur-md border-t border-amber-500/20 px-6 py-4 flex flex-col gap-3">
                    {NAV_LINKS.map((l) => (
                        <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)} className="text-stone-300 hover:text-amber-400 py-1.5 text-sm border-b border-white/5 last:border-0" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>{l.label}</a>
                    ))}
                    <a href="#donate" className="mt-2 px-4 py-2.5 rounded-full bg-amber-500 text-[#0d1f1e] font-bold text-sm text-center" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>দান করুন</a>
                </div>
            </div>
        </nav>
    );
}

function Footer() {
    return (
        <footer className="bg-[#080f0e] border-t border-white/5 py-8 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">🕉️</span>
                    <div>
                        <div className="text-amber-400 font-bold text-sm" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>আনন্দমার্গ প্রচারক সংঘ</div>
                        <div className="text-stone-500 text-xs">Bangladesh</div>
                    </div>
                </div>
                <p className="text-stone-600 text-xs text-center" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>© ২০২৫ আনন্দমার্গ বাংলাদেশ। সর্বস্বত্ব সংরক্ষিত।</p>
                <div className="flex gap-4 text-stone-500 text-xs" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                    <a href="#" className="hover:text-amber-400 transition-colors">গোপনীয়তা নীতি</a>
                    <a href="#" className="hover:text-amber-400 transition-colors">যোগাযোগ</a>
                </div>
            </div>
        </footer>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ContactPage() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="min-h-screen" style={{ background: "#0d1f1e" }}>
            <link
                href="https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@400;600;700&family=Hind+Siliguri:wght@400;500&display=swap"
                rel="stylesheet"
            />

            <Navbar scrolled={scrolled} />

            {/* Hero */}
            <section
                className="relative pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 overflow-hidden"
                style={{ background: "linear-gradient(135deg, #0d1f1e 0%, #0f2a28 60%, #0d1a10 100%)" }}
            >
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] rounded-full bg-amber-500/6 blur-3xl" />
                    <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
                                <circle cx="2" cy="2" r="1" fill="#f59e0b" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#dots)" />
                    </svg>
                </div>
                <div className="relative max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-400/20 text-teal-300 text-xs tracking-widest uppercase mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                        যোগাযোগ
                    </div>
                    <h1
                        className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
                        style={{ fontFamily: "'Noto Serif Bengali', serif", animation: "fadeUp 0.7s ease both" }}
                    >
                        আমাদের সাথে
                        <br />
                        <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(90deg, #f59e0b, #ea580c)" }}>
                            কথা বলুন
                        </span>
                    </h1>
                    <p
                        className="text-stone-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed"
                        style={{ fontFamily: "'Noto Serif Bengali', serif", animation: "fadeUp 0.7s ease 0.2s both" }}
                    >
                        আপনার যেকোনো প্রশ্ন, মতামত বা সহযোগিতার আগ্রহ নিয়ে আমাদের সাথে যোগাযোগ করুন।
                    </p>
                </div>
                <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(24px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
            </section>

            {/* Main content */}
            <section className="py-12 sm:py-20 px-4 sm:px-6" style={{ background: "#0d1f1e" }}>
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
                        {/* Left — form (3 cols) */}
                        <div className="lg:col-span-3">
                            <ContactForm />
                        </div>

                        {/* Right — info (2 cols) */}
                        <div className="lg:col-span-2 space-y-6">
                            <MapPlaceholder />
                            <OfficeCards />
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ strip */}
            <section className="py-12 sm:py-16 px-4 sm:px-6" style={{ background: "#0a1a12" }}>
                <div className="max-w-4xl mx-auto text-center">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                        দ্রুত যোগাযোগ
                    </h3>
                    <p className="text-stone-500 text-sm mb-8" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                        সরাসরি কথা বলতে চান?
                    </p>
                    <div className="grid sm:grid-cols-3 gap-4">
                        {[
                            { icon: "📞", label: "ফোন করুন", val: "+880 2-9876543", color: "#2dd4bf" },
                            { icon: "✉️", label: "ইমেইল করুন", val: "info@anandamarga.org.bd", color: "#fbbf24" },
                            { icon: "💬", label: "WhatsApp", val: "+880 1X-XXXXXXXX", color: "#34d399" },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="bg-white/4 rounded-2xl border border-white/8 p-5 hover:border-white/15 hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="text-2xl mb-2">{item.icon}</div>
                                <div className="text-stone-400 text-xs mb-1" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>{item.label}</div>
                                <div className="font-medium text-sm break-all" style={{ color: item.color, fontFamily: "monospace" }}>{item.val}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
            <MusicPlayer src="/audio/baba-nam-kevalam.mp3" />
        </div>
    );
}