// src/pages/blog/BlogListPage.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../utils/supabase";
import useAuthStore from "../../store/authStore";

const bn = { fontFamily: "'Noto Serif Bengali', serif" };
const CATEGORIES = ["সব", "আধ্যাত্মিকতা", "যোগ ও মেডিটেশন", "সমাজসেবা", "পরিবেশ", "শিক্ষা", "সাধারণ"];
const PER_PAGE = 9;

function BlogCard({ blog }) {
    const date = new Date(blog.created_at).toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" });
    return (
        <Link to={`/blog/${blog.slug}`} style={{ textDecoration: "none" }}>
            <article style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, overflow: "hidden", transition: "all 0.3s", height: "100%" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(245,158,11,0.25)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
                {blog.cover_image
                    ? <div style={{ height: 160, overflow: "hidden" }}><img src={blog.cover_image} alt={blog.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                    : <div style={{ height: 100, background: "linear-gradient(135deg,rgba(245,158,11,0.1),rgba(20,184,166,0.07))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>📝</div>
                }
                <div style={{ padding: 18 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 4 }}>
                        <span style={{ ...bn, fontSize: 11, padding: "3px 10px", borderRadius: 999, background: "rgba(245,158,11,0.1)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.18)" }}>{blog.category}</span>
                        <span style={{ color: "#57534e", fontSize: 11 }}>{date}</span>
                    </div>
                    <h3 style={{ ...bn, color: "#f5f5f4", fontWeight: 700, fontSize: 15, lineHeight: 1.5, marginBottom: 8 }}>{blog.title}</h3>
                    {blog.excerpt && <p style={{ ...bn, color: "#78716c", fontSize: 13, lineHeight: 1.7, marginBottom: 12, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{blog.excerpt}</p>}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                            <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, overflow: "hidden" }}>
                                {blog.profiles?.avatar_url ? <img src={blog.profiles.avatar_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "👤"}
                            </div>
                            <span style={{ ...bn, color: "#a8a29e", fontSize: 12 }}>{blog.profiles?.name || "অজ্ঞাত"}</span>
                        </div>
                        <span style={{ color: "#57534e", fontSize: 11 }}>👁 {blog.views || 0}</span>
                    </div>
                </div>
            </article>
        </Link>
    );
}

export default function BlogListPage() {
    const { user } = useAuthStore();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [cat, setCat] = useState("সব");
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => { fetchBlogs(); }, [cat, page]);

    const fetchBlogs = async () => {
        setLoading(true);
        let q = supabase
            .from("blogs")
            .select("*, profiles(name, avatar_url)", { count: "exact" })
            .eq("status", "published")
            .order("created_at", { ascending: false })
            .range((page - 1) * PER_PAGE, page * PER_PAGE - 1);
        if (cat !== "সব") q = q.eq("category", cat);
        const { data, count, error } = await q;
        if (!error) { setBlogs(data || []); setTotal(count || 0); }
        setLoading(false);
    };

    const filtered = search.trim()
        ? blogs.filter((b) => b.title.toLowerCase().includes(search.toLowerCase()) || b.excerpt?.toLowerCase().includes(search.toLowerCase()))
        : blogs;

    return (
        <>
            <section style={{ paddingTop: 100, paddingBottom: 40, padding: "100px 24px 40px", background: "linear-gradient(135deg,#0d1f1e,#0f2a28,#0d1a10)", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 500, height: 200, borderRadius: "50%", background: "rgba(245,158,11,0.07)", filter: "blur(60px)", pointerEvents: "none" }} />
                <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
                        <div>
                            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 999, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", color: "#fcd34d", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>
                                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#fbbf24" }} /> ব্লগ
                            </div>
                            <h1 style={{ ...bn, fontSize: "clamp(24px,4vw,40px)", fontWeight: 700, color: "#fff", margin: 0 }}>
                                আলোচনা ও <span style={{ color: "#fbbf24" }}>অনুপ্রেরণা</span>
                            </h1>
                        </div>
                        {user
                            ? <Link to="/blog/write" style={{ ...bn, padding: "10px 22px", borderRadius: 999, background: "linear-gradient(90deg,#f59e0b,#ea580c)", color: "#0d1f1e", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>+ নতুন ব্লগ লিখুন</Link>
                            : <Link to="/login" style={{ ...bn, padding: "10px 22px", borderRadius: 999, border: "1px solid rgba(245,158,11,0.3)", color: "#fbbf24", fontSize: 14, textDecoration: "none" }}>লগইন করে লিখুন</Link>
                        }
                    </div>
                    <div style={{ position: "relative", maxWidth: 480 }}>
                        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#57534e" }}>🔍</span>
                        <input type="text" placeholder="ব্লগ খুঁজুন..." value={search} onChange={(e) => setSearch(e.target.value)}
                            style={{ ...bn, width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "11px 14px 11px 40px", color: "#e7e5e4", fontSize: 14, outline: "none" }}
                            onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
                            onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
                    </div>
                </div>
            </section>

            <section style={{ padding: "36px 24px 72px" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}>
                        {CATEGORIES.map((c) => (
                            <button key={c} type="button" onClick={() => { setCat(c); setPage(1); }}
                                style={{ ...bn, padding: "7px 16px", borderRadius: 999, fontSize: 13, cursor: "pointer", transition: "all 0.2s", border: `1px solid ${cat === c ? "rgba(245,158,11,0.5)" : "rgba(255,255,255,0.1)"}`, background: cat === c ? "#f59e0b" : "transparent", color: cat === c ? "#0d1f1e" : "#a8a29e", fontWeight: cat === c ? 700 : 400 }}>
                                {c}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div style={{ textAlign: "center", padding: "60px 0", color: "#57534e" }}>
                            <p style={bn}>লোড হচ্ছে...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "60px 0" }}>
                            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                            <p style={{ ...bn, color: "#57534e", fontSize: 15 }}>কোনো ব্লগ পাওয়া যায়নি।</p>
                        </div>
                    ) : (
                        <div style={{ display: "grid", gap: 18 }} className="sm:grid-cols-2 lg:grid-cols-3">
                            {filtered.map((b) => <BlogCard key={b.id} blog={b} />)}
                        </div>
                    )}

                    {Math.ceil(total / PER_PAGE) > 1 && (
                        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 36 }}>
                            {Array.from({ length: Math.ceil(total / PER_PAGE) }, (_, i) => i + 1).map((p) => (
                                <button key={p} type="button" onClick={() => setPage(p)}
                                    style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${page === p ? "rgba(245,158,11,0.5)" : "rgba(255,255,255,0.1)"}`, background: page === p ? "rgba(245,158,11,0.15)" : "transparent", color: page === p ? "#fbbf24" : "#78716c", fontSize: 14, cursor: "pointer", fontFamily: "'Noto Serif Bengali', serif" }}>
                                    {p}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}