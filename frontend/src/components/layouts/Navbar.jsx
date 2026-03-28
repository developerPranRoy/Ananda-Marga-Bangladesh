// src/components/layouts/Navbar.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const NAV_LINKS = [
    { label: "হোম", to: "/" },
    { label: "আমাদের পরিচয়", to: "/about" },
    { label: "কার্যক্রম", to: "/programs" },
    { label: "সেবামূলক", to: "/service" },
    { label: "ব্লগ", to: "/blog" },
    { label: "যোগাযোগ", to: "/contact" },
];

const bn = { fontFamily: "'Noto Serif Bengali', serif" };

function UserDropdown({ user, profile, logout }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const navigate = useNavigate();

    // Close on outside click
    useEffect(() => {
        const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener("mousedown", fn);
        return () => document.removeEventListener("mousedown", fn);
    }, []);

    const handleLogout = async () => {
        setOpen(false);
        await logout();
        navigate("/");
    };

    const displayName = profile?.display_name || user?.email?.split("@")[0] || "User";
    const avatar = profile?.avatar_url;

    return (
        <div ref={ref} style={{ position: "relative" }}>
            {/* Avatar button */}
            <button type="button" onClick={() => setOpen(!open)}
                style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "5px 12px 5px 6px", cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(245,158,11,0.4)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = open ? "rgba(245,158,11,0.4)" : "rgba(255,255,255,0.1)")}
            >
                {/* Avatar circle */}
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#f59e0b,#ea580c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, overflow: "hidden", flexShrink: 0 }}>
                    {avatar
                        ? <img src={avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <span style={{ color: "#0d1f1e", fontWeight: 700 }}>{displayName[0]?.toUpperCase()}</span>
                    }
                </div>
                <span style={{ ...bn, color: "#e7e5e4", fontSize: 13, maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {displayName}
                </span>
                <svg width="12" height="12" fill="none" stroke="#78716c" viewBox="0 0 24 24"
                    style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", flexShrink: 0 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown menu */}
            {open && (
                <div style={{
                    position: "absolute", top: "calc(100% + 10px)", right: 0, minWidth: 200,
                    background: "#0f1e1d", border: "1px solid rgba(245,158,11,0.2)",
                    borderRadius: 16, overflow: "hidden", zIndex: 100,
                    boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
                    animation: "dropIn 0.15s ease both",
                }}>
                    {/* User info header */}
                    <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(245,158,11,0.05)" }}>
                        <div style={{ ...bn, color: "#f5f5f4", fontWeight: 600, fontSize: 14 }}>{displayName}</div>
                        <div style={{ color: "#57534e", fontSize: 11, marginTop: 2, wordBreak: "break-all" }}>{user?.email}</div>
                    </div>

                    {/* Menu items */}
                    {[
                        { icon: "✍️", label: "নতুন ব্লগ লিখুন", to: "/blog/write" },
                        { icon: "📋", label: "আমার ব্লগগুলো", to: "/blog" },
                        { icon: "👤", label: "প্রোফাইল", to: "/profile" },
                    ].map((item) => (
                        <Link key={item.to} to={item.to} onClick={() => setOpen(false)}
                            style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", textDecoration: "none", transition: "background 0.15s" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                            <span style={{ fontSize: 15 }}>{item.icon}</span>
                            <span style={{ ...bn, color: "#a8a29e", fontSize: 13 }}>{item.label}</span>
                        </Link>
                    ))}

                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                        <button type="button" onClick={handleLogout}
                            style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", transition: "background 0.15s" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(248,113,113,0.08)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                            <span style={{ fontSize: 15 }}>🚪</span>
                            <span style={{ ...bn, color: "#f87171", fontSize: 13 }}>লগআউট</span>
                        </button>
                    </div>
                </div>
            )}

            <style>{`@keyframes dropIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
        </div>
    );
}

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { pathname } = useLocation();
    const { user, profile, logout } = useAuthStore();

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", fn, { passive: true });
        return () => window.removeEventListener("scroll", fn);
    }, []);

    // Close mobile menu on route change
    useEffect(() => { setMenuOpen(false); }, [pathname]);

    return (
        <nav style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
            background: scrolled ? "rgba(13,31,30,0.96)" : "transparent",
            backdropFilter: scrolled ? "blur(12px)" : "none",
            boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.3)" : "none",
            transition: "all 0.4s ease",
        }}>
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>

                {/* Logo */}
                <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#fbbf24,#ea580c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: "0 4px 12px rgba(245,158,11,0.3)", transition: "transform 0.2s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    >🕉️</div>
                    <div>
                        <div style={{ ...bn, color: "#fbbf24", fontWeight: 700, fontSize: 13 }}>আনন্দমার্গ</div>
                        <div style={{ color: "rgba(94,234,212,0.7)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase" }}>Bangladesh</div>
                    </div>
                </Link>

                {/* Desktop nav */}
                <div className="hidden md:flex" style={{ alignItems: "center", gap: 24, flex: 1, justifyContent: "center" }}>
                    {NAV_LINKS.map((l) => (
                        <Link key={l.to} to={l.to} style={{
                            ...bn, color: pathname === l.to ? "#fbbf24" : "#a8a29e",
                            fontSize: 14, textDecoration: "none",
                            position: "relative", paddingBottom: 2, transition: "color 0.2s",
                        }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "#fbbf24")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = pathname === l.to ? "#fbbf24" : "#a8a29e")}
                        >
                            {l.label}
                            <span style={{ position: "absolute", bottom: -2, left: 0, height: 1, background: "#fbbf24", width: pathname === l.to ? "100%" : 0, transition: "width 0.3s" }} />
                        </Link>
                    ))}
                </div>

                {/* Desktop right side */}
                <div className="hidden md:flex" style={{ alignItems: "center", gap: 10, flexShrink: 0 }}>
                    <Link to="/donate" style={{
                        ...bn, padding: "8px 18px", borderRadius: 999,
                        background: "linear-gradient(90deg,#f59e0b,#ea580c)",
                        color: "#0d1f1e", fontWeight: 700, fontSize: 13, textDecoration: "none",
                        transition: "all 0.2s", boxShadow: "0 2px 12px rgba(245,158,11,0.25)",
                    }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    >দান করুন</Link>

                    {user
                        ? <UserDropdown user={user} profile={profile} logout={logout} />
                        : <Link to="/login" style={{
                            ...bn, padding: "8px 18px", borderRadius: 999,
                            border: "1px solid rgba(255,255,255,0.12)",
                            color: "#a8a29e", fontSize: 13, textDecoration: "none", transition: "all 0.2s",
                        }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(245,158,11,0.4)"; e.currentTarget.style.color = "#fbbf24"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#a8a29e"; }}
                        >লগইন</Link>
                    }
                </div>

                {/* Mobile hamburger */}
                <button className="md:hidden" type="button" onClick={() => setMenuOpen(!menuOpen)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#a8a29e", padding: 4, flexShrink: 0 }}>
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {menuOpen
                            ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                    </svg>
                </button>
            </div>

            {/* Mobile menu */}
            <div style={{ overflow: "hidden", maxHeight: menuOpen ? 500 : 0, opacity: menuOpen ? 1 : 0, transition: "max-height 0.35s ease, opacity 0.3s ease" }}>
                <div style={{ background: "rgba(13,31,30,0.98)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(245,158,11,0.15)", padding: "16px 24px 20px", display: "flex", flexDirection: "column", gap: 4 }}>
                    {NAV_LINKS.map((l) => (
                        <Link key={l.to} to={l.to} style={{
                            ...bn, color: pathname === l.to ? "#fbbf24" : "#a8a29e",
                            fontSize: 15, textDecoration: "none", padding: "10px 0",
                            borderBottom: "1px solid rgba(255,255,255,0.05)",
                        }}>{l.label}</Link>
                    ))}

                    <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                        <Link to="/donate" style={{ ...bn, flex: 1, padding: "11px", borderRadius: 999, textAlign: "center", background: "linear-gradient(90deg,#f59e0b,#ea580c)", color: "#0d1f1e", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                            দান করুন
                        </Link>
                        {user
                            ? <button type="button" onClick={async () => { await logout(); setMenuOpen(false); }}
                                style={{ ...bn, flex: 1, padding: "11px", borderRadius: 999, border: "1px solid rgba(248,113,113,0.3)", background: "transparent", color: "#f87171", fontSize: 14, cursor: "pointer" }}>
                                লগআউট
                            </button>
                            : <Link to="/login" style={{ ...bn, flex: 1, padding: "11px", borderRadius: 999, textAlign: "center", border: "1px solid rgba(255,255,255,0.12)", color: "#a8a29e", fontSize: 14, textDecoration: "none" }}>
                                লগইন
                            </Link>
                        }
                    </div>

                    {user && (
                        <div style={{ marginTop: 8, padding: "10px 14px", background: "rgba(245,158,11,0.06)", borderRadius: 12, border: "1px solid rgba(245,158,11,0.12)" }}>
                            <div style={{ ...bn, color: "#fbbf24", fontSize: 13, fontWeight: 600 }}>{profile?.display_name || user.email?.split("@")[0]}</div>
                            <div style={{ color: "#57534e", fontSize: 11, marginTop: 2 }}>{user.email}</div>
                            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                                <Link to="/blog/write" onClick={() => setMenuOpen(false)} style={{ ...bn, color: "#a8a29e", fontSize: 12, textDecoration: "none" }}>✍️ ব্লগ লিখুন</Link>
                                <Link to="/profile" onClick={() => setMenuOpen(false)} style={{ ...bn, color: "#a8a29e", fontSize: 12, textDecoration: "none" }}>👤 প্রোফাইল</Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}