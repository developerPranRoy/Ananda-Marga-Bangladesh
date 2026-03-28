// src/pages/blog/BlogDetailPage.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabase";
import useAuthStore from "../../store/authStore";

const bn = { fontFamily: "'Noto Serif Bengali', serif" };

export default function BlogDetailPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => { fetchBlog(); }, [slug]);

    const fetchBlog = async () => {
        console.log("Fetching slug:", slug); // যোগ করো
        setLoading(true);
        const { data, error } = await supabase
            .from("blogs")
            .select("*, profiles(id, name, avatar_url, bio, show_email)")
            .eq("slug", slug)
            .eq("status", "published")
            .single();
        console.log("Blog data:", data, "Error:", error); // যোগ করো
        if (error || !data) { setError("ব্লগটি পাওয়া যায়নি।"); setLoading(false); return; }
        setBlog(data);
        setLoading(false);
        // Increment view count
        supabase.rpc("increment_views", { blog_id: data.id });
    };

    const handleDelete = async () => {
        if (!confirm("এই ব্লগটি মুছে ফেলবেন?")) return;
        await supabase.from("blogs").delete().eq("id", blog.id);
        navigate("/blog");
    };

    if (loading) return (
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ ...bn, color: "#57534e" }}>লোড হচ্ছে...</p>
        </div>
    );

    if (error) return (
        <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <div style={{ fontSize: 48 }}>😕</div>
            <p style={{ ...bn, color: "#78716c", fontSize: 16 }}>{error}</p>
            <Link to="/blog" style={{ ...bn, padding: "9px 20px", borderRadius: 999, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", color: "#fbbf24", textDecoration: "none", fontSize: 14 }}>← ব্লগ লিস্টে ফিরুন</Link>
        </div>
    );

    const isAuthor = user?.id === blog.author_id;
    const date = new Date(blog.created_at).toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" });

    return (
        <>
            {/* Hero */}
            <section style={{ paddingTop: 100, paddingBottom: 0, background: "linear-gradient(180deg,#0d1f1e,#0f2218)", position: "relative", overflow: "hidden" }}>
                {blog.cover_image && (
                    <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
                        <img src={blog.cover_image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.15 }} />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(13,31,30,0.6),#0f2218)" }} />
                    </div>
                )}
                <div style={{ position: "relative", zIndex: 1, maxWidth: 760, margin: "0 auto", padding: "48px 24px 40px" }}>
                    <Link to="/blog" style={{ ...bn, display: "inline-flex", alignItems: "center", gap: 6, color: "#78716c", textDecoration: "none", fontSize: 13, marginBottom: 20, transition: "color 0.2s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#fbbf24")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#78716c")}>
                        ← সব ব্লগ
                    </Link>

                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                        <span style={{ ...bn, fontSize: 12, padding: "3px 12px", borderRadius: 999, background: "rgba(245,158,11,0.1)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.2)" }}>{blog.category}</span>
                        <span style={{ color: "#57534e", fontSize: 12 }}>{date}</span>
                        <span style={{ color: "#57534e", fontSize: 12 }}>👁 {blog.views} বার পড়া হয়েছে</span>
                    </div>

                    <h1 style={{ ...bn, fontSize: "clamp(24px,4vw,38px)", fontWeight: 700, color: "#fff", lineHeight: 1.4, marginBottom: 20 }}>{blog.title}</h1>

                    {/* Author */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, overflow: "hidden", flexShrink: 0 }}>
                                {blog.profiles?.avatar_url ? <img src={blog.profiles.avatar_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "👤"}
                            </div>
                            <div>
                                <div style={{ ...bn, color: "#f5f5f4", fontSize: 14, fontWeight: 600 }}>
                                    {blog.profiles?.name || "অজ্ঞাত লেখক"}
                                </div>
                                {blog.profiles?.bio && (
                                    <div style={{ ...bn, color: "#78716c", fontSize: 12, marginTop: 1 }}>{blog.profiles.bio.slice(0, 60)}{blog.profiles.bio.length > 60 ? "..." : ""}</div>
                                )}
                            </div>
                        </div>

                        {/* Author actions */}
                        {isAuthor && (
                            <div style={{ display: "flex", gap: 8 }}>
                                <Link to={`/blog/edit/${blog.id}`} style={{ ...bn, padding: "7px 16px", borderRadius: 999, border: "1px solid rgba(245,158,11,0.3)", color: "#fbbf24", textDecoration: "none", fontSize: 13 }}>সম্পাদনা</Link>
                                <button type="button" onClick={handleDelete}
                                    style={{ ...bn, padding: "7px 16px", borderRadius: 999, border: "1px solid rgba(248,113,113,0.3)", color: "#f87171", background: "transparent", fontSize: 13, cursor: "pointer" }}>
                                    মুছুন
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Content */}
            <section style={{ padding: "40px 24px 80px", background: "#0f2218" }}>
                <div style={{ maxWidth: 760, margin: "0 auto" }}>
                    {blog.excerpt && (
                        <p style={{ ...bn, color: "#a8a29e", fontSize: 17, lineHeight: 1.8, marginBottom: 32, paddingBottom: 32, borderBottom: "1px solid rgba(255,255,255,0.06)", fontStyle: "italic" }}>
                            {blog.excerpt}
                        </p>
                    )}

                    {/* Blog content */}
                    <div style={{ ...bn, color: "#d6d3d1", fontSize: 16, lineHeight: 1.9, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                        {blog.content}
                    </div>

                    {/* Tags */}
                    {blog.tags?.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 40, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                            {blog.tags.map((tag) => (
                                <span key={tag} style={{ ...bn, padding: "4px 12px", borderRadius: 999, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#78716c", fontSize: 12 }}>
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Back link */}
                    <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                        <Link to="/blog" style={{ ...bn, display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.1)", color: "#a8a29e", textDecoration: "none", fontSize: 14, transition: "all 0.2s" }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(245,158,11,0.3)"; e.currentTarget.style.color = "#fbbf24"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#a8a29e"; }}>
                            ← সব ব্লগ দেখুন
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}