import { useState, useEffect, useRef } from "react";
import MusicPlayer from "../components/common/MusicPlayer";

// ─── Data ────────────────────────────────────────────────────────────────────

const TIMELINE = [
    {
        year: "১৯৫৫",
        title: "আনন্দমার্গের প্রতিষ্ঠা",
        desc: "শ্রী শ্রী আনন্দমূর্তি জী বিহার, ভারতে আনন্দমার্গ প্রচারক সংঘ প্রতিষ্ঠা করেন।",
        icon: "🕉️",
    },
    {
        year: "১৯৬৫",
        title: "বাংলাদেশে আগমন",
        desc: "তৎকালীন পূর্ব পাকিস্তানে আনন্দমার্গের প্রথম শাখা স্থাপিত হয়।",
        icon: "🌱",
    },
    {
        year: "১৯৭২",
        title: "স্বাধীন বাংলাদেশে প্রসার",
        desc: "মুক্তিযুদ্ধের পর স্বাধীন বাংলাদেশে সংগঠন পুনর্গঠিত হয় এবং সেবামূলক কার্যক্রম শুরু হয়।",
        icon: "🇧🇩",
    },
    {
        year: "১৯৮০",
        title: "শিক্ষা কার্যক্রম",
        desc: "AMURT বাংলাদেশে শিক্ষা ও স্বাস্থ্য কেন্দ্র স্থাপনের মাধ্যমে সমাজসেবা শুরু করে।",
        icon: "📚",
    },
    {
        year: "২০০০",
        title: "বিস্তার ও উন্নয়ন",
        desc: "৬৪ জেলায় কার্যক্রম সম্প্রসারিত হয়, যোগ ও মেডিটেশন কেন্দ্রের সংখ্যা দ্রুত বৃদ্ধি পায়।",
        icon: "📈",
    },
    {
        year: "আজ",
        title: "অব্যাহত যাত্রা",
        desc: "সারাদেশে ২০০+ সেবাকেন্দ্র ও ১০,০০০+ স্বেচ্ছাসেবক নিয়ে আনন্দমার্গ এগিয়ে চলেছে।",
        icon: "✨",
    },
];

const VALUES = [
    {
        icon: "🧘",
        title: "আত্মজ্ঞান",
        desc: "নিজেকে জানার মাধ্যমে পরমসত্তার সাথে সংযোগ স্থাপন — এটাই আনন্দমার্গের মূল শিক্ষা।",
        color: "#f59e0b",
    },
    {
        icon: "💛",
        title: "সর্বজনীন প্রেম",
        desc: "জাতি, ধর্ম, বর্ণ নির্বিশেষে সকল মানুষকে ভালোবাসা ও সেবা করা।",
        color: "#14b8a6",
    },
    {
        icon: "⚖️",
        title: "নৈতিকতা",
        desc: "ব্যক্তিগত ও সামাজিক জীবনে উচ্চ নৈতিক মানদণ্ড বজায় রাখা।",
        color: "#a78bfa",
    },
    {
        icon: "🌍",
        title: "বিশ্বভ্রাতৃত্ব",
        desc: "সমগ্র মানবজাতি একটি পরিবার — এই দর্শনে বিশ্বাসী আনন্দমার্গ।",
        color: "#34d399",
    },
];

const LEADERS = [
    {
        name: "শ্রী শ্রী আনন্দমূর্তি জী",
        role: "প্রতিষ্ঠাতা",
        desc: "১৯২১ সালে জন্মগ্রহণকারী এই মহান আধ্যাত্মিক নেতা ১৯৫৫ সালে আনন্দমার্গ প্রতিষ্ঠা করেন।",
        initial: "আ",
        color: "from-amber-500/30 to-orange-500/20",
        border: "border-amber-400/30",
        textColor: "#fbbf24",
    },
    {
        name: "দাদা রঞ্জিতানন্দ",
        role: "বাংলাদেশ সেক্রেটারি",
        desc: "দীর্ঘ তিন দশক ধরে বাংলাদেশে আনন্দমার্গের কার্যক্রম পরিচালনায় নিয়োজিত।",
        initial: "দ",
        color: "from-teal-500/30 to-cyan-500/20",
        border: "border-teal-400/30",
        textColor: "#2dd4bf",
    },
    {
        name: "দিদি আনন্দপ্রভা",
        role: "মহিলা কল্যাণ বিভাগ",
        desc: "নারী শিক্ষা ও ক্ষমতায়নে অগ্রণী ভূমিকা পালন করে আসছেন।",
        initial: "দি",
        color: "from-rose-500/30 to-pink-500/20",
        border: "border-rose-400/30",
        textColor: "#fb7185",
    },
];

// ─── Scroll Reveal Hook ───────────────────────────────────────────────────────

function useReveal() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold: 0.15 }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return [ref, visible];
}

// ─── Section Components ───────────────────────────────────────────────────────

function HeroBanner() {
    return (
        <section
            className="relative pt-28 sm:pt-32 pb-20 sm:pb-28 px-4 sm:px-6 overflow-hidden"
            style={{ background: "linear-gradient(135deg, #0d1f1e 0%, #0f2a28 50%, #0d1a10 100%)" }}
        >
            {/* BG decorations */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-amber-500/6 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-teal-500/8 blur-3xl" />
                <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
                            <circle cx="2" cy="2" r="1" fill="#f59e0b" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#dots)" />
                </svg>
                {/* Diagonal line accent */}
                <div
                    className="absolute top-0 right-0 w-px h-full opacity-10"
                    style={{ background: "linear-gradient(180deg, transparent, #f59e0b, transparent)", left: "60%" }}
                />
            </div>

            <div className="relative max-w-5xl mx-auto">
                <div className="grid md:grid-cols-2 gap-10 items-center">
                    <div>
                        <div
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-300 text-xs tracking-widest uppercase mb-6"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                            আমাদের পরিচয়
                        </div>

                        <h1
                            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
                            style={{
                                fontFamily: "'Noto Serif Bengali', serif",
                                animation: "fadeUp 0.8s ease both",
                            }}
                        >
                            <span className="text-white">আনন্দমার্গ</span>
                            <br />
                            <span
                                className="text-transparent bg-clip-text"
                                style={{ backgroundImage: "linear-gradient(90deg, #f59e0b, #ea580c)" }}
                            >
                                বাংলাদেশ
                            </span>
                        </h1>

                        <p
                            className="text-stone-400 text-sm sm:text-base leading-relaxed mb-8 max-w-lg"
                            style={{ fontFamily: "'Noto Serif Bengali', serif", animation: "fadeUp 0.8s ease 0.2s both" }}
                        >
                            একটি আন্তর্জাতিক আধ্যাত্মিক ও সমাজসেবামূলক সংগঠন, যা মানুষের সর্বাঙ্গীণ উন্নয়নে নিবেদিত — ব্যক্তি থেকে সমাজ, আত্মা থেকে বিশ্ব।
                        </p>

                        <div
                            className="flex flex-wrap gap-3"
                            style={{ animation: "fadeUp 0.8s ease 0.35s both" }}
                        >
                            <a
                                href="#timeline"
                                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-[#0d1f1e] font-bold text-sm hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/25"
                                style={{ fontFamily: "'Noto Serif Bengali', serif" }}
                            >
                                আমাদের ইতিহাস
                            </a>
                            <a
                                href="/"
                                className="px-5 py-2.5 rounded-full border border-teal-400/30 text-teal-300 hover:bg-teal-500/10 text-sm transition-all duration-200"
                                style={{ fontFamily: "'Noto Serif Bengali', serif" }}
                            >
                                ← হোমে ফিরুন
                            </a>
                        </div>
                    </div>

                    {/* Right — decorative stat ring */}
                    <div className="hidden md:flex items-center justify-center">
                        <div className="relative w-72 h-72">
                            {/* Outer ring */}
                            <div className="absolute inset-0 rounded-full border border-amber-400/15 animate-spin" style={{ animationDuration: "40s" }} />
                            <div className="absolute inset-4 rounded-full border border-teal-400/10 animate-spin" style={{ animationDuration: "25s", animationDirection: "reverse" }} />
                            <div className="absolute inset-8 rounded-full border border-amber-400/10" />

                            {/* Center */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-500/15 to-orange-500/10 border border-amber-400/20 flex flex-col items-center justify-center gap-1 backdrop-blur-sm">
                                    <span className="text-4xl">🕉️</span>
                                    <span className="text-amber-400/60 text-xs tracking-widest uppercase" style={{ fontFamily: "sans-serif" }}>Since</span>
                                    <span className="text-amber-400 font-bold text-lg" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>১৯৫৫</span>
                                </div>
                            </div>

                            {/* Floating stats */}
                            {[
                                { val: "৫০+", lbl: "বছর", deg: -60 },
                                { val: "৬৪", lbl: "জেলা", deg: 60 },
                                { val: "১০K+", lbl: "সদস্য", deg: 180 },
                            ].map(({ val, lbl, deg }) => (
                                <div
                                    key={lbl}
                                    className="absolute bg-[#0d1f1e]/90 border border-white/10 rounded-xl px-3 py-1.5 text-center backdrop-blur-sm"
                                    style={{
                                        transform: `rotate(${deg}deg) translateX(120px) rotate(${-deg}deg)`,
                                        top: "50%", left: "50%", marginTop: "-28px", marginLeft: "-36px",
                                    }}
                                >
                                    <div className="text-amber-400 font-bold text-sm" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>{val}</div>
                                    <div className="text-stone-500 text-[10px]" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>{lbl}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </section>
    );
}

function MissionSection() {
    const [ref, visible] = useReveal();
    return (
        <section
            ref={ref}
            className="py-16 sm:py-24 px-4 sm:px-6"
            style={{ background: "#0f2218" }}
        >
            <div className="max-w-6xl mx-auto">
                <div
                    className="text-center mb-12 sm:mb-16 transition-all duration-700"
                    style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)" }}
                >
                    <div className="text-amber-500/60 text-xs tracking-widest uppercase mb-3" style={{ fontFamily: "sans-serif" }}>Our Mission</div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                        আমাদের <span className="text-amber-400">লক্ষ্য ও আদর্শ</span>
                    </h2>
                    <p className="text-stone-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                        আনন্দমার্গ বিশ্বাস করে যে মানুষের শারীরিক, মানসিক ও আধ্যাত্মিক — এই তিন স্তরের সমন্বিত উন্নয়নই প্রকৃত অগ্রগতি।
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
                    {VALUES.map((v, i) => (
                        <div
                            key={v.title}
                            className="group bg-white/4 rounded-2xl border border-white/8 p-6 hover:border-white/15 hover:bg-white/6 hover:-translate-y-1 transition-all duration-300"
                            style={{
                                opacity: visible ? 1 : 0,
                                transform: visible ? "none" : "translateY(28px)",
                                transition: `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s, border-color 0.3s, background 0.3s, translateY 0.3s`,
                            }}
                        >
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                                style={{ background: `${v.color}18`, border: `1px solid ${v.color}30` }}
                            >
                                {v.icon}
                            </div>
                            <h3 className="font-bold text-base text-white mb-2" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>{v.title}</h3>
                            <p className="text-stone-400 text-sm leading-relaxed" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>{v.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function TimelineSection() {
    const [ref, visible] = useReveal();
    return (
        <section
            id="timeline"
            ref={ref}
            className="py-16 sm:py-24 px-4 sm:px-6"
            style={{ background: "linear-gradient(180deg, #0f2218 0%, #0d1f1e 100%)" }}
        >
            <div className="max-w-4xl mx-auto">
                <div
                    className="text-center mb-12 sm:mb-16 transition-all duration-700"
                    style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)" }}
                >
                    <div className="text-teal-400/60 text-xs tracking-widest uppercase mb-3" style={{ fontFamily: "sans-serif" }}>History</div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                        আমাদের <span className="text-amber-400">ইতিহাস</span>
                    </h2>
                </div>

                {/* Timeline */}
                <div className="relative">
                    {/* Center line */}
                    <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500/40 via-teal-500/30 to-transparent sm:-translate-x-px" />

                    <div className="space-y-8 sm:space-y-0">
                        {TIMELINE.map((item, i) => {
                            const isLeft = i % 2 === 0;
                            return (
                                <div
                                    key={item.year}
                                    className={`relative flex items-start sm:items-center gap-6 sm:gap-0 ${isLeft ? "sm:flex-row" : "sm:flex-row-reverse"
                                        }`}
                                    style={{
                                        opacity: visible ? 1 : 0,
                                        transform: visible ? "none" : `translateX(${isLeft ? -20 : 20}px)`,
                                        transition: `opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s`,
                                        marginBottom: "2rem",
                                    }}
                                >
                                    {/* Content card */}
                                    <div className={`flex-1 pl-14 sm:pl-0 ${isLeft ? "sm:pr-12 sm:text-right" : "sm:pl-12"}`}>
                                        <div
                                            className={`inline-block bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5 hover:border-amber-400/20 hover:bg-amber-500/5 transition-all duration-300 max-w-sm ${isLeft ? "sm:ml-auto" : ""
                                                }`}
                                        >
                                            <div
                                                className="text-amber-400 font-bold text-lg mb-1"
                                                style={{ fontFamily: "'Noto Serif Bengali', serif" }}
                                            >
                                                {item.year}
                                            </div>
                                            <div className="text-white font-semibold text-sm sm:text-base mb-2" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                                                {item.title}
                                            </div>
                                            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Center dot */}
                                    <div className="absolute left-6 sm:left-1/2 sm:-translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/10 border-2 border-amber-400/40 flex items-center justify-center text-lg z-10 shrink-0 top-4 sm:top-auto">
                                        {item.icon}
                                    </div>

                                    {/* Spacer for opposite side on desktop */}
                                    <div className="hidden sm:block flex-1" />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

function LeadershipSection() {
    const [ref, visible] = useReveal();
    return (
        <section
            ref={ref}
            className="py-16 sm:py-24 px-4 sm:px-6"
            style={{ background: "#0d1a10" }}
        >
            <div className="max-w-5xl mx-auto">
                <div
                    className="text-center mb-12 transition-all duration-700"
                    style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)" }}
                >
                    <div className="text-rose-400/60 text-xs tracking-widest uppercase mb-3" style={{ fontFamily: "sans-serif" }}>Leadership</div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                        নেতৃত্ব ও <span className="text-amber-400">অনুপ্রেরণা</span>
                    </h2>
                </div>

                <div className="grid sm:grid-cols-3 gap-6">
                    {LEADERS.map((l, i) => (
                        <div
                            key={l.name}
                            className={`relative bg-gradient-to-br ${l.color} border ${l.border} rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300`}
                            style={{
                                opacity: visible ? 1 : 0,
                                transform: visible ? "scale(1)" : "scale(0.95)",
                                transition: `opacity 0.6s ease ${i * 0.15}s, transform 0.6s ease ${i * 0.15}s`,
                            }}
                        >
                            {/* Avatar */}
                            <div
                                className="w-14 h-14 rounded-full border-2 flex items-center justify-center text-xl font-bold mb-4"
                                style={{
                                    borderColor: l.textColor + "50",
                                    background: l.textColor + "18",
                                    color: l.textColor,
                                    fontFamily: "'Noto Serif Bengali', serif",
                                }}
                            >
                                {l.initial}
                            </div>
                            <div className="font-bold text-white text-sm sm:text-base mb-1" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                                {l.name}
                            </div>
                            <div className="text-xs mb-3 font-medium" style={{ color: l.textColor, fontFamily: "'Noto Serif Bengali', serif" }}>
                                {l.role}
                            </div>
                            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                                {l.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function PhilosophySection() {
    const [ref, visible] = useReveal();
    return (
        <section
            ref={ref}
            className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden"
            style={{ background: "#0d1f1e" }}
        >
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-amber-500/4 blur-3xl" />
            </div>

            <div
                className="relative max-w-3xl mx-auto text-center transition-all duration-700"
                style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)" }}
            >
                <div className="text-5xl sm:text-7xl text-amber-400/20 mb-4 leading-none" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>"</div>
                <blockquote
                    className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-relaxed mb-6"
                    style={{ fontFamily: "'Noto Serif Bengali', serif", textShadow: "0 0 40px rgba(245,158,11,0.15)" }}
                >
                    আত্মমোক্ষার্থং জগদ্ধিতায় চ
                </blockquote>
                <p
                    className="text-teal-300/80 text-base sm:text-lg mb-8"
                    style={{ fontFamily: "'Noto Serif Bengali', serif" }}
                >
                    নিজের মুক্তির জন্য এবং জগতের কল্যাণের জন্য
                </p>
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent mx-auto mb-8" />
                <p
                    className="text-stone-400 text-sm sm:text-base leading-relaxed"
                    style={{ fontFamily: "'Noto Serif Bengali', serif" }}
                >
                    এই মহাবাক্যটি আনন্দমার্গের দর্শনের মূলে। ব্যক্তির আধ্যাত্মিক উন্নতি ও সমাজের সামগ্রিক কল্যাণ — এই দুই লক্ষ্যকে একত্রে অর্জনই আনন্দমার্গীদের জীবনদর্শন।
                </p>
            </div>
        </section>
    );
}

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
                <a href="/" className="flex items-center gap-2 sm:gap-3 group">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-base shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">🕉️</div>
                    <div>
                        <div className="text-amber-400 font-bold text-xs sm:text-sm leading-tight" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>আনন্দমার্গ</div>
                        <div className="text-teal-300/70 text-[10px] tracking-widest uppercase">Bangladesh</div>
                    </div>
                </a>
                <div className="hidden md:flex items-center gap-6 lg:gap-8">
                    {NAV_LINKS.map((l) => (
                        <a key={l.label} href={l.href} className="text-stone-300 hover:text-amber-400 text-sm transition-colors relative group" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                            {l.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-px bg-amber-400 group-hover:w-full transition-all duration-300" />
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

export default function AboutPage() {
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
            <HeroBanner />
            <MissionSection />
            <TimelineSection />
            <LeadershipSection />
            <PhilosophySection />
            <Footer />

            <MusicPlayer src="/audio/baba-nam-kevalam.mp3" />
        </div>
    );
}