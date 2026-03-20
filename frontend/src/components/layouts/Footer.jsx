import { Link } from "react-router-dom";

const bn = { fontFamily: "'Noto Serif Bengali', serif" };

const LINKS = [
    { label: "হোম", to: "/" },
    { label: "আমাদের পরিচয়", to: "/about" },
    { label: "কার্যক্রম", to: "/programs" },
    { label: "যোগাযোগ", to: "/contact" },
    { label: "দান করুন", to: "/donate" },
];

const CONTACTS = [
    { icon: "📞", text: "+880 2-9876543" },
    { icon: "✉️", text: "info@anandamarga.org.bd" },
    { icon: "📍", text: "ধানমন্ডি, ঢাকা-১২০৫" },
];

export default function Footer() {
    return (
        <footer style={{ background: "#080f0e", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "40px 24px 24px" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 32, marginBottom: 32 }}>

                    {/* Brand */}
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                            <span style={{ fontSize: 24 }}>🕉️</span>
                            <div>
                                <div style={{ ...bn, color: "#fbbf24", fontWeight: 700, fontSize: 14 }}>আনন্দমার্গ প্রচারক সংঘ</div>
                                <div style={{ color: "#57534e", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>Bangladesh</div>
                            </div>
                        </div>
                        <p style={{ ...bn, color: "#57534e", fontSize: 12, maxWidth: 220, lineHeight: 1.7 }}>
                            আত্মমোক্ষ ও জগৎকল্যাণের পথে।
                        </p>
                    </div>

                    {/* Nav links */}
                    <div>
                        <div style={{ color: "#78716c", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>পেজসমূহ</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {LINKS.map((l) => (
                                <Link key={l.to} to={l.to} style={{ ...bn, color: "#78716c", fontSize: 13, textDecoration: "none", transition: "color 0.2s" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = "#fbbf24")}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = "#78716c")}
                                >{l.label}</Link>
                            ))}
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <div style={{ color: "#78716c", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>যোগাযোগ</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {CONTACTS.map((c) => (
                                <div key={c.text} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ fontSize: 13 }}>{c.icon}</span>
                                    <span style={{ ...bn, color: "#78716c", fontSize: 12 }}>{c.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 16, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                    <p style={{ ...bn, color: "#44403c", fontSize: 12 }}>© ২০২৫ আনন্দমার্গ বাংলাদেশ। সর্বস্বত্ব সংরক্ষিত।</p>
                    <div style={{ display: "flex", gap: 16 }}>
                        {["গোপনীয়তা নীতি", "ব্যবহারের শর্ত"].map((t) => (
                            <a key={t} href="#" style={{ ...bn, color: "#44403c", fontSize: 12, textDecoration: "none", transition: "color 0.2s" }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "#fbbf24")}
                                onMouseLeave={(e) => (e.currentTarget.style.color = "#44403c")}
                            >{t}</a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}