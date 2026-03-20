import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const LINKS = [
    { label: "হোম", to: "/" },
    { label: "আমাদের পরিচয়", to: "/about" },
    { label: "কার্যক্রম", to: "/programs" },
    { label: "যোগাযোগ", to: "/contact" },
];

const bn = { fontFamily: "'Noto Serif Bengali', serif" };

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { pathname } = useLocation();

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", fn, { passive: true });
        return () => window.removeEventListener("scroll", fn);
    }, []);

    return (
        <nav style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
            background: scrolled ? "rgba(13,31,30,0.96)" : "transparent",
            backdropFilter: scrolled ? "blur(12px)" : "none",
            boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.3)" : "none",
            transition: "all 0.4s ease",
        }}>
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

                {/* Logo */}
                <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#fbbf24,#ea580c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: "0 4px 12px rgba(245,158,11,0.3)" }}>🕉️</div>
                    <div>
                        <div style={{ ...bn, color: "#fbbf24", fontWeight: 700, fontSize: 13 }}>আনন্দমার্গ</div>
                        <div style={{ color: "rgba(94,234,212,0.7)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase" }}>Bangladesh</div>
                    </div>
                </Link>

                {/* Desktop links */}
                <div className="hidden md:flex" style={{ alignItems: "center", gap: 28 }}>
                    {LINKS.map((l) => (
                        <Link key={l.to} to={l.to} style={{
                            ...bn, color: pathname === l.to ? "#fbbf24" : "#a8a29e",
                            fontSize: 14, textDecoration: "none", position: "relative", paddingBottom: 2, transition: "color 0.2s",
                        }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "#fbbf24")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = pathname === l.to ? "#fbbf24" : "#a8a29e")}
                        >
                            {l.label}
                            <span style={{ position: "absolute", bottom: -2, left: 0, height: 1, background: "#fbbf24", width: pathname === l.to ? "100%" : 0, transition: "width 0.3s" }} />
                        </Link>
                    ))}
                    <Link to="/donate" style={{
                        ...bn, padding: "8px 20px", borderRadius: 999,
                        background: "linear-gradient(90deg,#f59e0b,#ea580c)",
                        color: "#0d1f1e", fontWeight: 700, fontSize: 13, textDecoration: "none",
                        boxShadow: "0 2px 12px rgba(245,158,11,0.25)", transition: "all 0.2s",
                    }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                    >দান করুন</Link>
                </div>

                {/* Mobile toggle */}
                <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#a8a29e", padding: 4 }}>
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {menuOpen
                            ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                    </svg>
                </button>
            </div>

            {/* Mobile menu */}
            <div style={{ overflow: "hidden", maxHeight: menuOpen ? 400 : 0, opacity: menuOpen ? 1 : 0, transition: "max-height 0.35s ease, opacity 0.3s ease" }}>
                <div style={{ background: "rgba(13,31,30,0.98)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(245,158,11,0.15)", padding: "16px 24px 20px", display: "flex", flexDirection: "column", gap: 4 }}>
                    {LINKS.map((l) => (
                        <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)} style={{
                            ...bn, color: pathname === l.to ? "#fbbf24" : "#a8a29e",
                            fontSize: 15, textDecoration: "none", padding: "10px 0",
                            borderBottom: "1px solid rgba(255,255,255,0.05)",
                        }}>{l.label}</Link>
                    ))}
                    <Link to="/donate" onClick={() => setMenuOpen(false)} style={{
                        ...bn, marginTop: 12, padding: 12, borderRadius: 999, textAlign: "center",
                        background: "linear-gradient(90deg,#f59e0b,#ea580c)",
                        color: "#0d1f1e", fontWeight: 700, fontSize: 14, textDecoration: "none",
                    }}>দান করুন</Link>
                </div>
            </div>
        </nav>
    );
}