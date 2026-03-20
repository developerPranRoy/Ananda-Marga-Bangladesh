import { useState, useEffect } from "react";

const bn = { fontFamily: "'Noto Serif Bengali', serif" };

const STATS = [
  { value: "৫০+", label: "বছরের যাত্রা" },
  { value: "২০০+", label: "সেবা কেন্দ্র" },
  { value: "১০K+", label: "স্বেচ্ছাসেবক" },
  { value: "৬৪", label: "জেলায় উপস্থিতি" },
];

const PROGRAMS = [
  { icon: "🕉️", title: "যোগ ও মেডিটেশন", desc: "আষ্টাঙ্গ যোগ পদ্ধতিতে মন ও শরীরের সমন্বয়।", color: "#f59e0b" },
  { icon: "📚", title: "শিক্ষা ও প্রশিক্ষণ", desc: "নৈতিক মূল্যবোধ ভিত্তিক শিক্ষা কার্যক্রম।", color: "#2dd4bf" },
  { icon: "🤝", title: "সমাজসেবা", desc: "দুর্যোগ ব্যবস্থাপনা ও স্বাস্থ্যসেবা কার্যক্রম।", color: "#fb7185" },
  { icon: "🌿", title: "পরিবেশ সংরক্ষণ", desc: "প্রাকৃতিক সম্পদ সংরক্ষণ ও পরিবেশ সচেতনতা।", color: "#34d399" },
];

const QUOTES = [
  { text: "আত্মমোক্ষার্থং জগদ্ধিতায় চ", sub: "নিজের মুক্তির জন্য ও জগতের কল্যাণের জন্য" },
  { text: "সকলের মঙ্গল হোক, কেউ যেন কষ্ট না পায়", sub: "আনন্দমার্গের মূল আদর্শ" },
];

export default function HomePage() {
  const [qIdx, setQIdx] = useState(0);
  const [qShow, setQShow] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setQShow(false);
      setTimeout(() => { setQIdx((i) => (i + 1) % QUOTES.length); setQShow(true); }, 400);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      {/* ── Hero ── */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg,#0d1f1e 0%,#0f2a28 40%,#1a1a0e 100%)",
        padding: "100px 24px 60px", position: "relative", overflow: "hidden", textAlign: "center",
      }}>
        {/* BG glows */}
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 700, height: 350, borderRadius: "50%", background: "rgba(245,158,11,0.07)", filter: "blur(60px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 0, right: 0, width: 400, height: 400, borderRadius: "50%", background: "rgba(20,184,166,0.07)", filter: "blur(60px)", pointerEvents: "none" }} />
        {/* Mandala rings */}
        {[600, 450, 300].map((s) => (
          <div key={s} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: s, height: s, borderRadius: "50%", border: "1px solid rgba(245,158,11,0.06)", pointerEvents: "none" }} />
        ))}

        <div style={{ position: "relative", zIndex: 1, maxWidth: 800, width: "100%" }}>
          {/* Om badge */}
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 72, height: 72, borderRadius: "50%", background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)", fontSize: 34, marginBottom: 20, boxShadow: "0 0 0 0 rgba(245,158,11,0.4)", animation: "pulse 3s ease-in-out infinite" }}>🕉️</div>

          {/* Tag */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 999, background: "rgba(20,184,166,0.1)", border: "1px solid rgba(20,184,166,0.2)", color: "#5eead4", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 24 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#2dd4bf" }} />
            আনন্দমার্গ প্রচারক সংঘ — বাংলাদেশ
          </div>

          {/* Title */}
          <h1 style={{ ...bn, fontSize: "clamp(36px,6vw,68px)", fontWeight: 700, color: "#fbbf24", lineHeight: 1.15, marginBottom: 8, textShadow: "0 0 60px rgba(245,158,11,0.25)", animation: "fadeUp 0.8s ease both" }}>
            আত্মমোক্ষ ও<br /><span style={{ color: "#fff" }}>জগৎকল্যাণ</span>
          </h1>

          {/* Rotating quote */}
          <div style={{ height: 64, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "24px 0" }}>
            <p style={{ ...bn, fontSize: "clamp(14px,2vw,19px)", color: "#d6d3d1", fontStyle: "italic", opacity: qShow ? 1 : 0, transform: qShow ? "translateY(0)" : "translateY(-8px)", transition: "opacity 0.4s, transform 0.4s" }}>
              "{QUOTES[qIdx].text}"
            </p>
            <p style={{ ...bn, color: "rgba(94,234,212,0.6)", fontSize: 13, opacity: qShow ? 1 : 0, transition: "opacity 0.4s 0.1s" }}>
              — {QUOTES[qIdx].sub}
            </p>
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 48 }}>
            <a href="/about" style={{ ...bn, padding: "12px 28px", borderRadius: 999, background: "linear-gradient(90deg,#f59e0b,#ea580c)", color: "#0d1f1e", fontWeight: 700, fontSize: 15, textDecoration: "none", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(245,158,11,0.3)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
            >আমাদের সম্পর্কে জানুন</a>
            <a href="/programs" style={{ ...bn, padding: "12px 28px", borderRadius: 999, border: "1px solid rgba(94,234,212,0.35)", color: "#5eead4", fontSize: 15, textDecoration: "none", transition: "all 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(20,184,166,0.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >কার্যক্রম দেখুন</a>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }} className="sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "14px 10px", transition: "all 0.3s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(245,158,11,0.3)"; e.currentTarget.style.background = "rgba(245,158,11,0.05)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              >
                <div style={{ ...bn, color: "#fbbf24", fontWeight: 700, fontSize: 28 }}>{s.value}</div>
                <div style={{ ...bn, color: "#78716c", fontSize: 13 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: "#57534e", fontSize: 12, animation: "bounce 2s infinite" }}>
          <span style={bn}>নিচে স্ক্রল করুন</span>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </div>
      </section>

      {/* ── About strip ── */}
      <section style={{ padding: "80px 24px", background: "#0f2218" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gap: 48 }} className="md:grid-cols-2">
          <div>
            <div style={{ color: "rgba(245,158,11,0.6)", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>About Us</div>
            <h2 style={{ ...bn, fontSize: "clamp(28px,4vw,44px)", fontWeight: 700, color: "#fff", marginBottom: 20, lineHeight: 1.2 }}>
              আমাদের <span style={{ color: "#fbbf24" }}>পরিচয়</span>
            </h2>
            {["আনন্দমার্গ প্রচারক সংঘ ১৯৫৫ সালে শ্রী শ্রী আনন্দমূর্তি জী কর্তৃক প্রতিষ্ঠিত একটি আন্তর্জাতিক আধ্যাত্মিক ও সমাজসেবামূলক সংগঠন।",
              "বাংলাদেশে আনন্দমার্গ দীর্ঘ পঞ্চাশ বছরেরও বেশি সময় ধরে যোগ, মেডিটেশন, শিক্ষা ও মানবসেবার মাধ্যমে সমাজের উন্নয়নে অবদান রেখে আসছে।"
            ].map((t) => <p key={t} style={{ ...bn, color: "#a8a29e", fontSize: 15, lineHeight: 1.8, marginBottom: 16 }}>{t}</p>)}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["যোগ সাধনা", "নৈতিক শিক্ষা", "সমাজকল্যাণ", "পরিবেশ সংরক্ষণ"].map((t) => (
                <span key={t} style={{ ...bn, padding: "5px 14px", borderRadius: 999, background: "rgba(20,184,166,0.08)", border: "1px solid rgba(20,184,166,0.2)", color: "#5eead4", fontSize: 13 }}>{t}</span>
              ))}
            </div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: 32 }}>
            <div style={{ ...bn, fontSize: 60, color: "rgba(245,158,11,0.2)", lineHeight: 1 }}>"</div>
            <p style={{ ...bn, color: "#fff", fontSize: 18, lineHeight: 1.8, marginBottom: 24 }}>
              মানুষের সেবায় ঈশ্বরের সেবা — এই আদর্শেই আনন্দমার্গের প্রতিটি কর্মী তার জীবন উৎসর্গ করেছেন।
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🕉️</div>
              <div>
                <div style={{ ...bn, color: "#fcd34d", fontSize: 13, fontWeight: 600 }}>শ্রী শ্রী আনন্দমূর্তি জী</div>
                <div style={{ color: "#57534e", fontSize: 12 }}>প্রতিষ্ঠাতা, আনন্দমার্গ</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Programs ── */}
      <section style={{ padding: "80px 24px", background: "linear-gradient(180deg,#0f2218 0%,#0d1f1e 100%)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ color: "rgba(245,158,11,0.6)", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>Our Programs</div>
            <h2 style={{ ...bn, fontSize: "clamp(28px,4vw,44px)", fontWeight: 700, color: "#fff" }}>আমাদের <span style={{ color: "#fbbf24" }}>কার্যক্রম</span></h2>
          </div>
          <div style={{ display: "grid", gap: 16 }} className="sm:grid-cols-2 lg:grid-cols-4">
            {PROGRAMS.map((p) => (
              <div key={p.title} style={{ background: `${p.color}0d`, border: `1px solid ${p.color}30`, borderRadius: 20, padding: 24, transition: "all 0.3s", cursor: "pointer" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 16px 40px ${p.color}18`; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ fontSize: 36, marginBottom: 14 }}>{p.icon}</div>
                <h3 style={{ ...bn, color: "#fff", fontWeight: 700, fontSize: 17, marginBottom: 10 }}>{p.title}</h3>
                <p style={{ ...bn, color: "#78716c", fontSize: 13, lineHeight: 1.7 }}>{p.desc}</p>
                <div style={{ ...bn, color: p.color, fontSize: 13, marginTop: 12 }}>আরও জানুন →</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "80px 24px", background: "#0d1a10", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 500, height: 200, borderRadius: "50%", background: "rgba(245,158,11,0.08)", filter: "blur(60px)", pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 640, margin: "0 auto" }}>
          <div style={{ fontSize: 44, marginBottom: 16 }}>🙏</div>
          <h2 style={{ ...bn, fontSize: "clamp(24px,3.5vw,36px)", fontWeight: 700, color: "#fff", marginBottom: 14 }}>
            আমাদের সাথে <span style={{ color: "#fbbf24" }}>যোগ দিন</span>
          </h2>
          <p style={{ ...bn, color: "#78716c", fontSize: 15, lineHeight: 1.8, marginBottom: 32 }}>
            আধ্যাত্মিক সাধনা ও সমাজসেবার এই মহান যাত্রায় আপনাকে স্বাগতম।
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            <a href="/contact" style={{ ...bn, padding: "12px 28px", borderRadius: 999, background: "linear-gradient(90deg,#f59e0b,#ea580c)", color: "#0d1f1e", fontWeight: 700, fontSize: 15, textDecoration: "none", transition: "all 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >যোগাযোগ করুন</a>
            <a href="/donate" style={{ ...bn, padding: "12px 28px", borderRadius: 999, border: "1px solid rgba(245,158,11,0.35)", color: "#fcd34d", fontSize: 15, textDecoration: "none", transition: "all 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(245,158,11,0.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >দান করুন</a>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)} }
        @keyframes pulse  { 0%,100%{box-shadow:0 0 0 0 rgba(245,158,11,0.4)}50%{box-shadow:0 0 0 14px rgba(245,158,11,0)} }
        @keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(-6px)} }
      `}</style>
    </>
  );
}