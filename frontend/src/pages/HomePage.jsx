import { useState, useEffect } from "react";
import MusicPlayer from "../components/common/MusicPlayer";

// ─── Data ───────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "হোম", href: "#home" },
  { label: "আমাদের পরিচয়", href: "#about" },
  { label: "কার্যক্রম", href: "#programs" },
  { label: "সেবামূলক", href: "#service" },
  { label: "যোগাযোগ", href: "#contact" },
];

const HERO_STATS = [
  { value: "৫০+", label: "বছরের যাত্রা" },
  { value: "২০০+", label: "সেবা কেন্দ্র" },
  { value: "১০K+", label: "স্বেচ্ছাসেবক" },
  { value: "৬৪", label: "জেলায় উপস্থিতি" },
];

const PROGRAMS = [
  {
    icon: "🕉️",
    title: "যোগ ও মেডিটেশন",
    desc: "আনন্দমার্গের বিশেষ আষ্টাঙ্গ যোগ পদ্ধতিতে মন ও শরীরের সমন্বয়।",
    color: "from-amber-500/20 to-orange-400/10",
    border: "border-amber-500/30",
  },
  {
    icon: "📚",
    title: "শিক্ষা ও প্রশিক্ষণ",
    desc: "AMURT ও AMURTEL-এর মাধ্যমে নৈতিক মূল্যবোধ ভিত্তিক শিক্ষা কার্যক্রম।",
    color: "from-teal-500/20 to-cyan-400/10",
    border: "border-teal-500/30",
  },
  {
    icon: "🤝",
    title: "সমাজসেবা",
    desc: "দুর্যোগ ব্যবস্থাপনা, স্বাস্থ্যসেবা ও দরিদ্র জনগোষ্ঠীর পুনর্বাসন।",
    color: "from-rose-500/20 to-pink-400/10",
    border: "border-rose-500/30",
  },
  {
    icon: "🌿",
    title: "পরিবেশ সংরক্ষণ",
    desc: "প্রাকৃতিক সম্পদ সংরক্ষণ ও পরিবেশ সচেতনতামূলক কর্মসূচি।",
    color: "from-emerald-500/20 to-green-400/10",
    border: "border-emerald-500/30",
  },
];

const QUOTES = [
  { text: "আত্মমোক্ষার্থং জগদ্ধিতায় চ", sub: "নিজের মুক্তির জন্য ও জগতের কল্যাণের জন্য" },
  { text: "সকলের মঙ্গল হোক, কেউ যেন কষ্ট না পায়", sub: "আনন্দমার্গের মূল আদর্শ" },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function Navbar({ scrolled }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0d1f1e]/95 backdrop-blur-md shadow-lg shadow-black/30"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 sm:gap-3 group cursor-pointer">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-base sm:text-lg shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
            🕉️
          </div>
          <div>
            <div
              className="text-amber-400 font-bold text-xs sm:text-sm leading-tight tracking-wide"
              style={{ fontFamily: "'Noto Serif Bengali', serif" }}
            >
              আনন্দমার্গ
            </div>
            <div className="text-teal-300/70 text-[10px] tracking-widest uppercase">Bangladesh</div>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-stone-300 hover:text-amber-400 text-sm transition-colors duration-200 relative group"
              style={{ fontFamily: "'Noto Serif Bengali', serif" }}
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-amber-400 group-hover:w-full transition-all duration-300" />
            </a>
          ))}
          <a
            href="#donate"
            className="px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-[#0d1f1e] font-bold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/30 hover:scale-105"
            style={{ fontFamily: "'Noto Serif Bengali', serif" }}
          >
            দান করুন
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-stone-300 hover:text-amber-400 transition-colors p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile Menu — animated slide */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-[#0d1f1e]/98 backdrop-blur-md border-t border-amber-500/20 px-6 py-4 flex flex-col gap-3">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="text-stone-300 hover:text-amber-400 transition-colors py-1.5 text-sm border-b border-white/5 last:border-0"
              style={{ fontFamily: "'Noto Serif Bengali', serif" }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#donate"
            onClick={() => setMenuOpen(false)}
            className="mt-2 px-4 py-2.5 rounded-full bg-amber-500 text-[#0d1f1e] font-bold text-sm text-center"
            style={{ fontFamily: "'Noto Serif Bengali', serif" }}
          >
            দান করুন
          </a>
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [quoteVisible, setQuoteVisible] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setQuoteVisible(false);
      setTimeout(() => {
        setQuoteIdx((i) => (i + 1) % QUOTES.length);
        setQuoteVisible(true);
      }, 400);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4"
      style={{ background: "linear-gradient(135deg, #0d1f1e 0%, #0f2a28 40%, #1a1a0e 100%)" }}
    >
      {/* Decorative BG */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] sm:w-[600px] lg:w-[800px] h-[200px] sm:h-[400px] rounded-full bg-amber-500/8 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[200px] sm:w-[500px] h-[200px] sm:h-[400px] rounded-full bg-teal-500/10 blur-3xl" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#f59e0b" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] sm:w-[500px] lg:w-[600px] h-[260px] sm:h-[500px] lg:h-[600px] rounded-full border border-amber-500/6" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] sm:w-[360px] lg:w-[450px] h-[180px] sm:h-[360px] lg:h-[450px] rounded-full border border-teal-500/6" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center w-full">
        {/* Om Symbol */}
        <div
          className="mb-5 inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/10 border border-amber-400/30 text-3xl sm:text-4xl shadow-2xl shadow-amber-500/20"
          style={{ animation: "pulseBadge 3s ease-in-out infinite" }}
        >
          🕉️
        </div>

        {/* Tag */}
        <div className="mb-5 sm:mb-6 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-400/20 text-teal-300 text-[10px] sm:text-xs tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
          <span className="hidden sm:inline">আনন্দমার্গ প্রচারক সংঘ — বাংলাদেশ</span>
          <span className="sm:hidden" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>আনন্দমার্গ বাংলাদেশ</span>
        </div>

        {/* Main heading */}
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-amber-400 mb-4 leading-tight"
          style={{
            fontFamily: "'Noto Serif Bengali', serif",
            textShadow: "0 0 60px rgba(245,158,11,0.25)",
            animation: "fadeUp 0.8s ease both",
          }}
        >
          আত্মমোক্ষ ও
          <br />
          <span className="text-white">জগৎকল্যাণ</span>
        </h1>

        {/* Animated quote */}
        <div className="my-6 sm:my-8 h-16 flex flex-col items-center justify-center px-2">
          <p
            className="text-sm sm:text-lg md:text-xl text-stone-300 italic mb-1"
            style={{
              fontFamily: "'Noto Serif Bengali', serif",
              opacity: quoteVisible ? 1 : 0,
              transform: quoteVisible ? "translateY(0)" : "translateY(-8px)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
            }}
          >
            "{QUOTES[quoteIdx].text}"
          </p>
          <p
            className="text-teal-400/70 text-xs sm:text-sm"
            style={{
              fontFamily: "'Noto Serif Bengali', serif",
              opacity: quoteVisible ? 1 : 0,
              transition: "opacity 0.4s ease 0.1s",
            }}
          >
            — {QUOTES[quoteIdx].sub}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-4 sm:mt-8">
          <a
            href="#about"
            className="px-6 sm:px-8 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-[#0d1f1e] font-bold text-sm sm:text-base hover:scale-105 hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-200 text-center"
            style={{ fontFamily: "'Noto Serif Bengali', serif" }}
          >
            আমাদের সম্পর্কে জানুন
          </a>
          <a
            href="#programs"
            className="px-6 sm:px-8 py-3 rounded-full border border-teal-400/40 text-teal-300 hover:bg-teal-500/10 hover:border-teal-400 font-medium text-sm sm:text-base transition-all duration-200 text-center"
            style={{ fontFamily: "'Noto Serif Bengali', serif" }}
          >
            কার্যক্রম দেখুন
          </a>
        </div>

        {/* Stats */}
        <div className="mt-10 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
          {HERO_STATS.map((s, i) => (
            <div
              key={s.label}
              className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 p-3 sm:p-4 hover:border-amber-400/30 hover:bg-amber-500/5 transition-all duration-300"
              style={{ animation: `fadeUp 0.6s ease ${0.1 * (i + 1)}s both` }}
            >
              <div
                className="text-2xl sm:text-3xl font-bold text-amber-400 mb-1"
                style={{ fontFamily: "'Noto Serif Bengali', serif" }}
              >
                {s.value}
              </div>
              <div
                className="text-stone-400 text-xs sm:text-sm"
                style={{ fontFamily: "'Noto Serif Bengali', serif" }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-stone-500 text-xs animate-bounce">
        <span style={{ fontFamily: "'Noto Serif Bengali', serif" }}>নিচে স্ক্রল করুন</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseBadge {
          0%, 100% { box-shadow: 0 0 0 0 rgba(245,158,11,0.35); }
          50%       { box-shadow: 0 0 0 14px rgba(245,158,11,0); }
        }
      `}</style>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="py-16 sm:py-24 px-4 sm:px-6" style={{ background: "#0f2218" }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 sm:gap-16 items-center">
          <div>
            <div className="text-amber-500/70 text-xs tracking-widest uppercase mb-3" style={{ fontFamily: "sans-serif" }}>
              About Us
            </div>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-5 leading-tight"
              style={{ fontFamily: "'Noto Serif Bengali', serif" }}
            >
              আমাদের <span className="text-amber-400">পরিচয়</span>
            </h2>
            <p className="text-stone-400 text-sm sm:text-base leading-relaxed mb-4" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
              আনন্দমার্গ প্রচারক সংঘ ১৯৫৫ সালে শ্রী শ্রী আনন্দমূর্তি জী কর্তৃক প্রতিষ্ঠিত একটি আন্তর্জাতিক আধ্যাত্মিক ও সমাজসেবামূলক সংগঠন।
            </p>
            <p className="text-stone-400 text-sm sm:text-base leading-relaxed mb-8" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
              বাংলাদেশে আনন্দমার্গ দীর্ঘ পঞ্চাশ বছরেরও বেশি সময় ধরে যোগ, মেডিটেশন, শিক্ষা ও মানবসেবার মাধ্যমে সমাজের উন্নয়নে অবদান রেখে আসছে।
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {["যোগ সাধনা", "নৈতিক শিক্ষা", "সমাজকল্যাণ", "পরিবেশ সংরক্ষণ"].map((tag) => (
                <span key={tag} className="px-3 sm:px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs sm:text-sm" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mt-4 md:mt-0">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-amber-500/10 to-teal-500/5 blur-2xl" />
            <div className="relative bg-white/5 backdrop-blur rounded-2xl sm:rounded-3xl border border-white/10 p-6 sm:p-8">
              <div className="text-5xl sm:text-6xl text-amber-400/30 mb-4 leading-none" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>"</div>
              <p className="text-white text-base sm:text-xl leading-relaxed mb-6" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                মানুষের সেবায় ঈশ্বরের সেবা — এই আদর্শেই আনন্দমার্গের প্রতিটি কর্মী তার জীবন উৎসর্গ করেছেন।
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-500/20 border border-amber-400/30 flex items-center justify-content text-amber-400 text-base sm:text-lg flex justify-center items-center">🕉️</div>
                <div>
                  <div className="text-amber-300 text-xs sm:text-sm font-medium" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>শ্রী শ্রী আনন্দমূর্তি জী</div>
                  <div className="text-stone-500 text-xs">প্রতিষ্ঠাতা, আনন্দমার্গ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProgramsSection() {
  return (
    <section id="programs" className="py-16 sm:py-24 px-4 sm:px-6" style={{ background: "linear-gradient(180deg, #0f2218 0%, #0d1f1e 100%)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <div className="text-amber-500/70 text-xs tracking-widest uppercase mb-3">Our Programs</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
            আমাদের <span className="text-amber-400">কার্যক্রম</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {PROGRAMS.map((p) => (
            <div key={p.title} className={`group relative bg-gradient-to-br ${p.color} border ${p.border} rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer`}>
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{p.icon}</div>
              <h3 className="text-white font-bold text-base sm:text-lg mb-2 leading-snug" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>{p.title}</h3>
              <p className="text-stone-400 text-xs sm:text-sm leading-relaxed" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>{p.desc}</p>
              <div className="mt-3 text-amber-400 text-xs sm:text-sm group-hover:translate-x-1 transition-transform duration-200 inline-flex items-center gap-1" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                আরও জানুন →
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 relative overflow-hidden" style={{ background: "#0d1a10" }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] sm:w-[600px] h-[150px] sm:h-[200px] bg-amber-500/10 blur-3xl rounded-full" />
      </div>
      <div className="relative max-w-3xl mx-auto text-center">
        <div className="text-4xl sm:text-5xl mb-4">🙏</div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
          আমাদের সাথে <span className="text-amber-400">যোগ দিন</span>
        </h2>
        <p className="text-stone-400 text-sm sm:text-base mb-6 sm:mb-8 max-w-xl mx-auto leading-relaxed" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
          আধ্যাত্মিক সাধনা ও সমাজসেবার এই মহান যাত্রায় আপনাকে স্বাগতম। একসাথে গড়ি এক সুন্দর আগামী।
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <a href="#contact" className="px-6 sm:px-8 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-[#0d1f1e] font-bold hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/30 text-sm sm:text-base text-center" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
            যোগাযোগ করুন
          </a>
          <a href="#donate" className="px-6 sm:px-8 py-3 rounded-full border border-amber-400/40 text-amber-300 hover:bg-amber-500/10 transition-all duration-200 text-sm sm:text-base text-center" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
            দান করুন
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#080f0e] border-t border-white/5 py-8 sm:py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🕉️</span>
          <div>
            <div className="text-amber-400 font-bold text-sm" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>আনন্দমার্গ প্রচারক সংঘ</div>
            <div className="text-stone-500 text-xs">Bangladesh</div>
          </div>
        </div>
        <p className="text-stone-600 text-xs text-center" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
          © ২০২৫ আনন্দমার্গ বাংলাদেশ। সর্বস্বত্ব সংরক্ষিত।
        </p>
        <div className="flex gap-4 text-stone-500 text-xs" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
          <a href="#" className="hover:text-amber-400 transition-colors">গোপনীয়তা নীতি</a>
          <a href="#" className="hover:text-amber-400 transition-colors">যোগাযোগ</a>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen font-sans">
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@400;600;700&family=Hind+Siliguri:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <Navbar scrolled={scrolled} />
      <HeroSection />
      <AboutSection />
      <ProgramsSection />
      <CTASection />
      <Footer />

      {/* 🎵 Background Music Player */}
      <MusicPlayer src="/audio/baba-nam-kevalam.mp3" />
    </div>
  );
}