import { useState, useEffect, useRef } from "react";
import MusicPlayer from "../components/common/MusicPlayer";

// ─── Data ────────────────────────────────────────────────────────────────────

const CATEGORIES = ["সব", "যোগ", "শিক্ষা", "সেবা", "পরিবেশ"];

const PROGRAMS = [
    {
        id: 1,
        category: "যোগ",
        icon: "🧘",
        title: "আষ্টাঙ্গ যোগ সাধনা",
        subtitle: "Ashtanga Yoga Practice",
        desc: "আনন্দমার্গের বিশেষ আষ্টাঙ্গ যোগ পদ্ধতিতে শরীর, মন ও আত্মার সমন্বয়। প্রতিদিন সকাল ও সন্ধ্যায় ক্লাস পরিচালিত হয়।",
        details: ["সপ্তাহে ৬ দিন ক্লাস", "শিক্ষানবিস থেকে অগ্রবর্তী", "বিনামূল্যে অংশগ্রহণ", "সার্টিফিকেট প্রদান"],
        color: "#f59e0b",
        border: "border-amber-400/30",
        bg: "from-amber-500/15 to-orange-500/5",
        tag: "যোগ",
    },
    {
        id: 2,
        category: "যোগ",
        icon: "🕉️",
        title: "মেডিটেশন কোর্স",
        subtitle: "Meditation Course",
        desc: "মানসিক শান্তি ও আধ্যাত্মিক উন্নতির জন্য বিশেষ ধ্যান পদ্ধতি শেখানো হয়। ১০ দিনের নিবিড় কোর্স।",
        details: ["১০ দিনের নিবিড় প্রশিক্ষণ", "অভিজ্ঞ আচার্য দ্বারা পরিচালিত", "আবাসিক সুবিধা", "সকলের জন্য উন্মুক্ত"],
        color: "#a78bfa",
        border: "border-violet-400/30",
        bg: "from-violet-500/15 to-purple-500/5",
        tag: "যোগ",
    },
    {
        id: 3,
        category: "শিক্ষা",
        icon: "📚",
        title: "আনন্দ মার্গ স্কুল",
        subtitle: "Ananda Marga School",
        desc: "নৈতিক মূল্যবোধ ও আধুনিক শিক্ষার সমন্বয়ে পরিচালিত বিদ্যালয়। AMURT-এর তত্ত্বাবধানে পরিচালিত।",
        details: ["প্রাক-প্রাথমিক থেকে দশম শ্রেণি", "নৈতিক শিক্ষা বাধ্যতামূলক", "বৃত্তির সুযোগ", "যোগ ক্লাস অন্তর্ভুক্ত"],
        color: "#2dd4bf",
        border: "border-teal-400/30",
        bg: "from-teal-500/15 to-cyan-500/5",
        tag: "শিক্ষা",
    },
    {
        id: 4,
        category: "শিক্ষা",
        icon: "🎓",
        title: "বৃত্তিমূলক প্রশিক্ষণ",
        subtitle: "Vocational Training",
        desc: "দরিদ্র ও সুবিধাবঞ্চিত যুবকদের জন্য দক্ষতা উন্নয়ন প্রশিক্ষণ কর্মসূচি। কর্মসংস্থান নিশ্চিতকরণে সহায়তা।",
        details: ["সেলাই ও বুনন", "কম্পিউটার প্রশিক্ষণ", "কৃষি উন্নয়ন", "ক্ষুদ্র উদ্যোক্তা"],
        color: "#34d399",
        border: "border-emerald-400/30",
        bg: "from-emerald-500/15 to-green-500/5",
        tag: "শিক্ষা",
    },
    {
        id: 5,
        category: "সেবা",
        icon: "🏥",
        title: "বিনামূল্যে স্বাস্থ্যসেবা",
        subtitle: "Free Health Service",
        desc: "AMURT বাংলাদেশের উদ্যোগে প্রতি মাসে বিনামূল্যে স্বাস্থ্য শিবির আয়োজন করা হয়। প্রত্যন্ত অঞ্চলে সেবা পৌঁছানো।",
        details: ["মাসিক স্বাস্থ্য শিবির", "বিনামূল্যে ওষুধ বিতরণ", "প্রত্যন্ত এলাকায় সেবা", "বিশেষজ্ঞ চিকিৎসক"],
        color: "#fb7185",
        border: "border-rose-400/30",
        bg: "from-rose-500/15 to-pink-500/5",
        tag: "সেবা",
    },
    {
        id: 6,
        category: "সেবা",
        icon: "🆘",
        title: "দুর্যোগ ত্রাণ",
        subtitle: "Disaster Relief",
        desc: "বন্যা, ঘূর্ণিঝড় ও অন্যান্য প্রাকৃতিক দুর্যোগে তাৎক্ষণিক ত্রাণ ও পুনর্বাসন কার্যক্রম পরিচালনা।",
        details: ["তাৎক্ষণিক খাদ্য সহায়তা", "আশ্রয় নির্মাণ", "মানসিক পুনর্বাসন", "দীর্ঘমেয়াদী পুনর্গঠন"],
        color: "#f97316",
        border: "border-orange-400/30",
        bg: "from-orange-500/15 to-amber-500/5",
        tag: "সেবা",
    },
    {
        id: 7,
        category: "পরিবেশ",
        icon: "🌿",
        title: "বৃক্ষরোপণ অভিযান",
        subtitle: "Tree Plantation Drive",
        desc: "প্রতি বছর হাজার হাজার গাছ লাগানোর মাধ্যমে পরিবেশ সংরক্ষণ ও জলবায়ু পরিবর্তন মোকাবেলায় অবদান।",
        details: ["বার্ষিক ১০,০০০+ গাছ", "স্কুল ক্যাম্পেইন", "ফলজ ও বনজ গাছ", "পরিবেশ সচেতনতা"],
        color: "#4ade80",
        border: "border-green-400/30",
        bg: "from-green-500/15 to-emerald-500/5",
        tag: "পরিবেশ",
    },
    {
        id: 8,
        category: "পরিবেশ",
        icon: "♻️",
        title: "পরিবেশ সচেতনতা",
        subtitle: "Environmental Awareness",
        desc: "বিদ্যালয় ও সমাজে পরিবেশ সচেতনতামূলক কর্মসূচি, পুনর্ব্যবহারযোগ্য বর্জ্য ব্যবস্থাপনা প্রশিক্ষণ।",
        details: ["বিদ্যালয় ক্যাম্পেইন", "বর্জ্য ব্যবস্থাপনা", "জৈব কৃষি", "সোলার এনার্জি"],
        color: "#06b6d4",
        border: "border-cyan-400/30",
        bg: "from-cyan-500/15 to-blue-500/5",
        tag: "পরিবেশ",
    },
];

const STATS = [
    { val: "৮+", label: "সক্রিয় কার্যক্রম", icon: "📋" },
    { val: "৬৪", label: "জেলায় সেবা", icon: "🗺️" },
    { val: "১০K+", label: "উপকারভোগী", icon: "👥" },
    { val: "৫০+", label: "বছরের অভিজ্ঞতা", icon: "⭐" },
];

// ─── Hook ─────────────────────────────────────────────────────────────────────

function useReveal() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold: 0.1 }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return [ref, visible];
}

// ─── Program Card ─────────────────────────────────────────────────────────────

function ProgramCard({ program, index, visible }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div
            className={`group relative bg-gradient-to-br ${program.bg} border ${program.border} rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl`}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(28px)",
                transition: `opacity 0.6s ease ${index * 0.08}s, transform 0.6s ease ${index * 0.08}s`,
                boxShadow: expanded ? `0 20px 60px ${program.color}15` : undefined,
            }}
        >
            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                        style={{ background: program.color + "18", border: `1px solid ${program.color}30` }}
                    >
                        {program.icon}
                    </div>
                    <span
                        className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{
                            background: program.color + "15",
                            color: program.color,
                            border: `1px solid ${program.color}25`,
                            fontFamily: "'Noto Serif Bengali', serif",
                        }}
                    >
                        {program.tag}
                    </span>
                </div>

                <h3
                    className="text-white font-bold text-base sm:text-lg mb-1 leading-snug"
                    style={{ fontFamily: "'Noto Serif Bengali', serif" }}
                >
                    {program.title}
                </h3>
                <p className="text-stone-500 text-xs mb-3 font-mono tracking-wide">{program.subtitle}</p>
                <p
                    className="text-stone-400 text-sm leading-relaxed mb-4"
                    style={{ fontFamily: "'Noto Serif Bengali', serif" }}
                >
                    {program.desc}
                </p>

                {/* Expandable details */}
                <div
                    className="overflow-hidden transition-all duration-400"
                    style={{ maxHeight: expanded ? "200px" : "0px", opacity: expanded ? 1 : 0 }}
                >
                    <div className="border-t border-white/8 pt-4 mb-4">
                        <p
                            className="text-stone-500 text-xs mb-2"
                            style={{ fontFamily: "'Noto Serif Bengali', serif" }}
                        >
                            বিশেষত্ব:
                        </p>
                        <ul className="space-y-1.5">
                            {program.details.map((d) => (
                                <li
                                    key={d}
                                    className="flex items-center gap-2 text-xs"
                                    style={{ color: program.color, fontFamily: "'Noto Serif Bengali', serif" }}
                                >
                                    <span style={{ color: program.color }}>✓</span>
                                    <span className="text-stone-300">{d}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Toggle button */}
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="flex items-center gap-1.5 text-xs font-medium transition-all duration-200 hover:gap-2.5"
                    style={{ color: program.color, fontFamily: "'Noto Serif Bengali', serif" }}
                >
                    {expanded ? "কম দেখুন ↑" : "বিস্তারিত দেখুন ↓"}
                </button>
            </div>

            {/* Bottom accent line */}
            <div
                className="h-0.5 w-0 group-hover:w-full transition-all duration-500"
                style={{ background: `linear-gradient(90deg, ${program.color}, transparent)` }}
            />
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
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">🕉️</div>
                    <div>
                        <div className="text-amber-400 font-bold text-xs leading-tight" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>আনন্দমার্গ</div>
                        <div className="text-teal-300/70 text-[10px] tracking-widest uppercase">Bangladesh</div>
                    </div>
                </a>
                <div className="hidden md:flex items-center gap-6 lg:gap-8">
                    {NAV_LINKS.map((l) => (
                        <a key={l.label} href={l.href}
                            className={`text-sm transition-colors relative group ${l.href === "/programs" ? "text-amber-400" : "text-stone-300 hover:text-amber-400"}`}
                            style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                            {l.label}
                            <span className={`absolute -bottom-1 left-0 h-px bg-amber-400 transition-all duration-300 ${l.href === "/programs" ? "w-full" : "w-0 group-hover:w-full"}`} />
                        </a>
                    ))}
                    <a href="/donate" className="px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-[#0d1f1e] font-bold text-sm transition-all hover:scale-105" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>দান করুন</a>
                </div>
                <button className="md:hidden text-stone-300 p-1" onClick={() => setMenuOpen(!menuOpen)}>
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
                    <a href="/donate" className="mt-2 px-4 py-2.5 rounded-full bg-amber-500 text-[#0d1f1e] font-bold text-sm text-center" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>দান করুন</a>
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
                    <a href="/contact" className="hover:text-amber-400 transition-colors">যোগাযোগ</a>
                </div>
            </div>
        </footer>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProgramsPage() {
    const [scrolled, setScrolled] = useState(false);
    const [activeCategory, setActiveCategory] = useState("সব");
    const [gridRef, gridVisible] = useReveal();
    const [statsRef, statsVisible] = useReveal();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const filtered = activeCategory === "সব"
        ? PROGRAMS
        : PROGRAMS.filter((p) => p.category === activeCategory);

    return (
        <div className="min-h-screen" style={{ background: "#0d1f1e" }}>
            <link
                href="https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@400;600;700&display=swap"
                rel="stylesheet"
            />

            <Navbar scrolled={scrolled} />

            {/* ── Hero ── */}
            <section
                className="relative pt-28 sm:pt-32 pb-16 px-4 sm:px-6 overflow-hidden"
                style={{ background: "linear-gradient(135deg, #0d1f1e 0%, #0f2a28 60%, #0d1a10 100%)" }}
            >
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-teal-500/8 blur-3xl" />
                    <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
                        <defs><pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#2dd4bf" /></pattern></defs>
                        <rect width="100%" height="100%" fill="url(#dots)" />
                    </svg>
                </div>

                <div className="relative max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-400/20 text-teal-300 text-xs tracking-widest uppercase mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                        আমাদের কার্যক্রম
                    </div>
                    <h1
                        className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
                        style={{ fontFamily: "'Noto Serif Bengali', serif", animation: "fadeUp 0.7s ease both" }}
                    >
                        সেবা ও সাধনার
                        <br />
                        <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(90deg, #2dd4bf, #f59e0b)" }}>
                            কার্যক্রমসমূহ
                        </span>
                    </h1>
                    <p
                        className="text-stone-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed"
                        style={{ fontFamily: "'Noto Serif Bengali', serif", animation: "fadeUp 0.7s ease 0.2s both" }}
                    >
                        যোগ সাধনা থেকে সমাজসেবা — আনন্দমার্গ বাংলাদেশের বহুমুখী কার্যক্রমে আপনাকে স্বাগতম।
                    </p>
                </div>

                <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }`}</style>
            </section>

            {/* ── Stats ── */}
            <section className="py-10 px-4 sm:px-6 border-b border-white/5" style={{ background: "#0a1a12" }}>
                <div
                    ref={statsRef}
                    className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4"
                >
                    {STATS.map((s, i) => (
                        <div
                            key={s.label}
                            className="text-center py-4"
                            style={{
                                opacity: statsVisible ? 1 : 0,
                                transform: statsVisible ? "none" : "translateY(16px)",
                                transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`,
                            }}
                        >
                            <div className="text-2xl mb-1">{s.icon}</div>
                            <div className="text-amber-400 font-bold text-2xl sm:text-3xl" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>{s.val}</div>
                            <div className="text-stone-500 text-xs mt-0.5" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Programs Grid ── */}
            <section className="py-12 sm:py-20 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto">

                    {/* Category filter */}
                    <div className="flex flex-wrap gap-2 justify-center mb-10 sm:mb-14">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm transition-all duration-200 border ${activeCategory === cat
                                        ? "bg-amber-500 border-amber-400 text-[#0d1f1e] font-bold scale-105"
                                        : "border-white/10 text-stone-400 hover:border-white/20 hover:text-stone-300"
                                    }`}
                                style={{ fontFamily: "'Noto Serif Bengali', serif" }}
                            >
                                {cat}
                                {activeCategory === cat && (
                                    <span className="ml-1.5 text-xs opacity-70">
                                        ({activeCategory === "সব" ? PROGRAMS.length : PROGRAMS.filter(p => p.category === cat).length})
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Grid */}
                    <div
                        ref={gridRef}
                        className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6"
                    >
                        {filtered.map((program, i) => (
                            <ProgramCard
                                key={program.id}
                                program={program}
                                index={i}
                                visible={gridVisible}
                            />
                        ))}
                    </div>

                    {filtered.length === 0 && (
                        <div className="text-center py-20 text-stone-500" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                            এই বিভাগে কোনো কার্যক্রম নেই।
                        </div>
                    )}
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-16 sm:py-20 px-4 sm:px-6 relative overflow-hidden" style={{ background: "#0a1a12" }}>
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-teal-500/8 blur-3xl rounded-full" />
                </div>
                <div className="relative max-w-2xl mx-auto text-center">
                    <div className="text-4xl mb-4">🙏</div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                        কোনো কার্যক্রমে <span className="text-amber-400">যোগ দিন</span>
                    </h2>
                    <p className="text-stone-400 text-sm sm:text-base mb-8 leading-relaxed" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                        স্বেচ্ছাসেবক হিসেবে বা অংশগ্রহণকারী হিসেবে — যেকোনো ভূমিকায় আপনাকে স্বাগতম।
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <a
                            href="/contact"
                            className="px-7 py-3 rounded-full font-bold text-sm text-[#0d1f1e] hover:scale-105 transition-all hover:shadow-lg hover:shadow-amber-500/20 text-center"
                            style={{ background: "linear-gradient(90deg, #f59e0b, #ea580c)", fontFamily: "'Noto Serif Bengali', serif" }}
                        >
                            স্বেচ্ছাসেবক হন
                        </a>
                        <a
                            href="/donate"
                            className="px-7 py-3 rounded-full border border-teal-400/30 text-teal-300 hover:bg-teal-500/10 text-sm transition-all text-center"
                            style={{ fontFamily: "'Noto Serif Bengali', serif" }}
                        >
                            দান করুন
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
            <MusicPlayer src="/audio/baba-nam-kevalam.mp3" />
        </div>
    );
}