// src/pages/blog/BlogWritePage.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../utils/supabase";
import useAuthStore from "../../store/authStore";

const bn = { fontFamily: "'Noto Serif Bengali', serif" };
const CATEGORIES = ["আধ্যাত্মিকতা", "যোগ ও মেডিটেশন", "সমাজসেবা", "পরিবেশ", "শিক্ষা", "সাধারণ"];

const inp = (err) => ({
    width: "100%", boxSizing: "border-box",
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${err ? "rgba(248,113,113,0.4)" : "rgba(255,255,255,0.1)"}`,
    borderRadius: 12, padding: "11px 14px",
    color: "#e7e5e4", fontSize: 14,
    fontFamily: "'Noto Serif Bengali', serif", outline: "none",
});

// Slug generator
const toSlug = (text) => text.toLowerCase().replace(/[^a-z0-9\u0980-\u09FF]+/gi, "-").replace(/^-|-$/g, "") + "-" + Date.now().toString(36);

export default function BlogWritePage() {
    const navigate = useNavigate();
    const { id } = useParams(); // if editing
    const { user } = useAuthStore();

    const [form, setForm] = useState({
        title: "", excerpt: "", content: "", category: "সাধারণ",
        cover_image: "", tags: "", status: "draft",
    });
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [blogId, setBlogId] = useState(null);

    // Redirect if not logged in
    useEffect(() => {
        if (!user) navigate("/login");
    }, [user]);

    // Load blog if editing
    useEffect(() => {
        if (id) loadBlog(id);
    }, [id]);

    const loadBlog = async (blogId) => {
        const { data, error } = await supabase.from("blogs").select("*").eq("id", blogId).eq("author_id", user?.id).single();
        if (error || !data) { navigate("/blog"); return; }
        setForm({
            title: data.title, excerpt: data.excerpt || "",
            content: data.content, category: data.category,
            cover_image: data.cover_image || "",
            tags: data.tags?.join(", ") || "",
            status: data.status,
        });
        setIsEdit(true);
        setBlogId(data.id);
    };

    const change = (f) => (e) => { setForm((d) => ({ ...d, [f]: e.target.value })); setErrors((er) => ({ ...er, [f]: "" })); };

    const validate = () => {
        const e = {};
        if (!form.title.trim()) e.title = "শিরোনাম লিখুন";
        if (!form.content.trim()) e.content = "বিষয়বস্তু লিখুন";
        return e;
    };

    const save = async (status) => {
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setSaving(true);

        const payload = {
            title: form.title.trim(),
            excerpt: form.excerpt.trim() || null,
            content: form.content.trim(),
            category: form.category,
            cover_image: form.cover_image.trim() || null,
            tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
            status,
            author_id: user.id,
        };

        try {
            if (isEdit) {
                const { error } = await supabase.from("blogs").update({ ...payload, updated_at: new Date().toISOString() }).eq("id", blogId);
                if (error) throw error;
                navigate(`/blog`);
            } else {
                const slug = toSlug(form.title);
                const { data, error } = await supabase.from("blogs").insert({ ...payload, slug }).select().single();
                if (error) throw error;
                navigate(status === "published" ? `/blog/${data.slug}` : "/blog");
            }
        } catch (err) {
            setErrors({ submit: err.message });
        }
        setSaving(false);
    };

    return (
        <>
            <section style={{ paddingTop: 90, paddingBottom: 60, padding: "90px 24px 60px", background: "#0d1f1e" }}>
                <div style={{ maxWidth: 800, margin: "0 auto" }}>

                    {/* Header */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
                        <div>
                            <h1 style={{ ...bn, color: "#fff", fontWeight: 700, fontSize: 24, margin: 0 }}>
                                {isEdit ? "ব্লগ সম্পাদনা" : "নতুন ব্লগ লিখুন"}
                            </h1>
                            <p style={{ ...bn, color: "#78716c", fontSize: 13, marginTop: 4 }}>আপনার চিন্তা ও অভিজ্ঞতা শেয়ার করুন।</p>
                        </div>
                    </div>

                    {/* Form */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

                        {/* Title */}
                        <div>
                            <label style={{ ...bn, display: "block", color: "#78716c", fontSize: 12, marginBottom: 6 }}>শিরোনাম <span style={{ color: "#fbbf24" }}>*</span></label>
                            <input type="text" placeholder="ব্লগের শিরোনাম লিখুন" value={form.title} onChange={change("title")}
                                style={{ ...inp(errors.title), fontSize: 18, fontWeight: 600 }}
                                onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
                                onBlur={(e) => (e.target.style.borderColor = errors.title ? "rgba(248,113,113,0.4)" : "rgba(255,255,255,0.1)")} />
                            {errors.title && <p style={{ ...bn, color: "#f87171", fontSize: 11, marginTop: 3 }}>{errors.title}</p>}
                        </div>

                        {/* Excerpt */}
                        <div>
                            <label style={{ ...bn, display: "block", color: "#78716c", fontSize: 12, marginBottom: 6 }}>সারসংক্ষেপ <span style={{ color: "#57534e", fontSize: 11 }}>(ঐচ্ছিক)</span></label>
                            <textarea rows={2} placeholder="ব্লগের সংক্ষিপ্ত বিবরণ — লিস্ট পেজে দেখাবে" value={form.excerpt} onChange={change("excerpt")}
                                style={{ ...inp(false), resize: "vertical" }}
                                onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
                                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
                        </div>

                        {/* Category + cover in row */}
                        <div style={{ display: "grid", gap: 14 }} className="sm:grid-cols-2">
                            <div>
                                <label style={{ ...bn, display: "block", color: "#78716c", fontSize: 12, marginBottom: 6 }}>বিভাগ</label>
                                <select value={form.category} onChange={change("category")}
                                    style={{ ...inp(false), cursor: "pointer" }}
                                    onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
                                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}>
                                    {CATEGORIES.map((c) => <option key={c} value={c} style={{ background: "#0d1f1e" }}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ ...bn, display: "block", color: "#78716c", fontSize: 12, marginBottom: 6 }}>কভার ইমেজ URL <span style={{ color: "#57534e", fontSize: 11 }}>(ঐচ্ছিক)</span></label>
                                <input type="url" placeholder="https://..." value={form.cover_image} onChange={change("cover_image")}
                                    style={inp(false)}
                                    onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
                                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
                            </div>
                        </div>

                        {/* Content */}
                        <div>
                            <label style={{ ...bn, display: "block", color: "#78716c", fontSize: 12, marginBottom: 6 }}>বিষয়বস্তু <span style={{ color: "#fbbf24" }}>*</span></label>
                            <textarea rows={16} placeholder="এখানে আপনার ব্লগ লিখুন..." value={form.content} onChange={change("content")}
                                style={{ ...inp(errors.content), resize: "vertical", lineHeight: 1.8 }}
                                onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
                                onBlur={(e) => (e.target.style.borderColor = errors.content ? "rgba(248,113,113,0.4)" : "rgba(255,255,255,0.1)")} />
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                                {errors.content && <p style={{ ...bn, color: "#f87171", fontSize: 11 }}>{errors.content}</p>}
                                <span style={{ color: "#57534e", fontSize: 11, marginLeft: "auto" }}>{form.content.length} অক্ষর</span>
                            </div>
                        </div>

                        {/* Tags */}
                        <div>
                            <label style={{ ...bn, display: "block", color: "#78716c", fontSize: 12, marginBottom: 6 }}>ট্যাগ <span style={{ color: "#57534e", fontSize: 11 }}>(কমা দিয়ে আলাদা করুন)</span></label>
                            <input type="text" placeholder="যোগ, মেডিটেশন, আধ্যাত্মিকতা" value={form.tags} onChange={change("tags")}
                                style={inp(false)}
                                onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
                                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
                        </div>

                        {errors.submit && (
                            <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 10, padding: "10px 14px" }}>
                                <p style={{ ...bn, color: "#f87171", fontSize: 13, margin: 0 }}>⚠️ {errors.submit}</p>
                            </div>
                        )}

                        {/* Action buttons */}
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", paddingTop: 8 }}>
                            <button type="button" disabled={saving} onClick={() => save("draft")}
                                style={{ ...bn, flex: 1, minWidth: 120, padding: "12px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.12)", background: "transparent", color: "#a8a29e", fontSize: 14, cursor: saving ? "not-allowed" : "pointer", transition: "all 0.2s" }}
                                onMouseEnter={(e) => { if (!saving) e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}>
                                💾 ড্রাফট সেভ
                            </button>
                            <button type="button" disabled={saving} onClick={() => save("published")}
                                style={{ ...bn, flex: 2, minWidth: 160, padding: "12px", borderRadius: 999, border: "none", background: saving ? "rgba(245,158,11,0.4)" : "linear-gradient(90deg,#f59e0b,#ea580c)", color: "#0d1f1e", fontWeight: 700, fontSize: 14, cursor: saving ? "not-allowed" : "pointer" }}>
                                {saving ? "সেভ হচ্ছে..." : "🚀 প্রকাশ করুন"}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}