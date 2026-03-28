// src/pages/ProfilePage.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";
import useAuthStore from "../store/authStore";

const bn = { fontFamily: "'Noto Serif Bengali', serif" };
const inp = (err) => ({
    width: "100%", boxSizing: "border-box",
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${err ? "rgba(248,113,113,0.4)" : "rgba(255,255,255,0.1)"}`,
    borderRadius: 12, padding: "11px 14px",
    color: "#e7e5e4", fontSize: 14,
    fontFamily: "'Noto Serif Bengali', serif", outline: "none",
});

function Field({ label, optional, children }) {
    return (
        <div>
            <label style={{ ...bn, display: "block", color: "#78716c", fontSize: 12, marginBottom: 6 }}>
                {label} {optional && <span style={{ color: "#57534e", fontSize: 11 }}>(ঐচ্ছিক)</span>}
            </label>
            {children}
        </div>
    );
}

function Toggle({ checked, onChange, label, desc }) {
    return (
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div>
                <div style={{ ...bn, color: "#e7e5e4", fontSize: 14 }}>{label}</div>
                {desc && <div style={{ ...bn, color: "#57534e", fontSize: 12, marginTop: 3 }}>{desc}</div>}
            </div>
            <button type="button" onClick={() => onChange(!checked)}
                style={{ width: 44, height: 24, borderRadius: 999, background: checked ? "#14b8a6" : "rgba(255,255,255,0.1)", position: "relative", border: "none", cursor: "pointer", transition: "background 0.3s", flexShrink: 0 }}>
                <div style={{ position: "absolute", top: 3, left: checked ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.3s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
            </button>
        </div>
    );
}

function MyBlogs({ userId }) {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.from("blogs").select("id,title,slug,status,views,created_at,category")
            .eq("author_id", userId).order("created_at", { ascending: false })
            .then(({ data }) => { setBlogs(data || []); setLoading(false); });
    }, [userId]);

    const del = async (id) => {
        if (!confirm("এই ব্লগটি মুছে ফেলবেন?")) return;
        await supabase.from("blogs").delete().eq("id", id);
        setBlogs((prev) => prev.filter((b) => b.id !== id));
    };

    if (loading) return <p style={{ ...bn, color: "#57534e", padding: "20px 0" }}>লোড হচ্ছে...</p>;
    if (!blogs.length) return (
        <div style={{ textAlign: "center", padding: "32px 0" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>📝</div>
            <p style={{ ...bn, color: "#57534e", fontSize: 14 }}>এখনো কোনো ব্লগ লেখা হয়নি।</p>
            <Link to="/blog/write" style={{ ...bn, display: "inline-block", marginTop: 12, padding: "9px 20px", borderRadius: 999, background: "linear-gradient(90deg,#f59e0b,#ea580c)", color: "#0d1f1e", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>প্রথম ব্লগ লিখুন</Link>
        </div>
    );

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {blogs.map((b) => {
                const date = new Date(b.created_at).toLocaleDateString("bn-BD", { year: "numeric", month: "short", day: "numeric" });
                return (
                    <div key={b.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, gap: 12, flexWrap: "wrap" }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4, flexWrap: "wrap" }}>
                                <span style={{ ...bn, fontSize: 11, padding: "2px 9px", borderRadius: 999, background: b.status === "published" ? "rgba(52,211,153,0.12)" : "rgba(245,158,11,0.1)", color: b.status === "published" ? "#34d399" : "#fbbf24", border: `1px solid ${b.status === "published" ? "rgba(52,211,153,0.2)" : "rgba(245,158,11,0.18)"}` }}>
                                    {b.status === "published" ? "প্রকাশিত" : "ড্রাফট"}
                                </span>
                                <span style={{ ...bn, fontSize: 11, color: "#57534e" }}>{b.category} · {date} · 👁 {b.views}</span>
                            </div>
                            <div style={{ ...bn, color: "#f5f5f4", fontSize: 14, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.title}</div>
                        </div>
                        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                            {b.status === "published" && (
                                <Link to={`/blog/${b.slug}`} style={{ ...bn, padding: "6px 14px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.1)", color: "#a8a29e", textDecoration: "none", fontSize: 12 }}>দেখুন</Link>
                            )}
                            <Link to={`/blog/edit/${b.id}`} style={{ ...bn, padding: "6px 14px", borderRadius: 999, border: "1px solid rgba(245,158,11,0.25)", color: "#fbbf24", textDecoration: "none", fontSize: 12 }}>সম্পাদনা</Link>
                            <button type="button" onClick={() => del(b.id)} style={{ ...bn, padding: "6px 14px", borderRadius: 999, border: "1px solid rgba(248,113,113,0.25)", background: "transparent", color: "#f87171", fontSize: 12, cursor: "pointer" }}>মুছুন</button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default function ProfilePage() {
    const navigate = useNavigate();
    const { user, profile, updateProfile, logout } = useAuthStore();

    const [tab, setTab] = useState("profile");
    const [form, setForm] = useState({ name: "", bio: "", avatar_url: "", mobile: "", address: "", acharja: "", bhukti: "" });
    const [priv, setPriv] = useState({ show_email: false, show_mobile: false });
    const [pwForm, setPwForm] = useState({ newPw: "", confirm: "" });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState({ type: "", text: "" });

    useEffect(() => { if (!user) navigate("/login"); }, [user]);

    useEffect(() => {
        if (profile) {
            setForm({ name: profile.name || "", bio: profile.bio || "", avatar_url: profile.avatar_url || "", mobile: profile.mobile || "", address: profile.address || "", acharja: profile.acharja || "", bhukti: profile.bhukti || "" });
            setPriv({ show_email: profile.show_email || false, show_mobile: profile.show_mobile || false });
        }
    }, [profile]);

    const toast = (type, text) => { setMsg({ type, text }); setTimeout(() => setMsg({ type: "", text: "" }), 3000); };
    const ch = (f) => (e) => setForm((d) => ({ ...d, [f]: e.target.value }));

    const saveProfile = async () => {
        setSaving(true);
        try { await updateProfile({ name: form.name, bio: form.bio, avatar_url: form.avatar_url || null, mobile: form.mobile || null, address: form.address || null, acharja: form.acharja || null, bhukti: form.bhukti || null }); toast("success", "প্রোফাইল সেভ হয়েছে!"); }
        catch (e) { toast("error", e.message); }
        setSaving(false);
    };

    const savePrivacy = async () => {
        setSaving(true);
        try { await updateProfile({ show_email: priv.show_email, show_mobile: priv.show_mobile }); toast("success", "সেটিংস সেভ হয়েছে!"); }
        catch (e) { toast("error", e.message); }
        setSaving(false);
    };

    const changePassword = async () => {
        if (pwForm.newPw !== pwForm.confirm) { toast("error", "পাসওয়ার্ড মিলছে না"); return; }
        if (pwForm.newPw.length < 6) { toast("error", "সর্বনিম্ন ৬ অক্ষর"); return; }
        setSaving(true);
        try { const { error } = await supabase.auth.updateUser({ password: pwForm.newPw }); if (error) throw error; toast("success", "পাসওয়ার্ড পরিবর্তন হয়েছে!"); setPwForm({ newPw: "", confirm: "" }); }
        catch (e) { toast("error", e.message); }
        setSaving(false);
    };

    if (!user) return null;

    const TABS = [
        { id: "profile", label: "প্রোফাইল", icon: "👤" },
        { id: "blogs", label: "আমার ব্লগ", icon: "📝" },
        { id: "privacy", label: "গোপনীয়তা", icon: "🔒" },
        { id: "password", label: "পাসওয়ার্ড", icon: "🔑" },
    ];

    const saveBtn = (label, action) => (
        <button type="button" disabled={saving} onClick={action}
            style={{ ...bn, padding: "12px 28px", borderRadius: 999, border: "none", background: saving ? "rgba(245,158,11,0.4)" : "linear-gradient(90deg,#f59e0b,#ea580c)", color: "#0d1f1e", fontWeight: 700, fontSize: 14, cursor: saving ? "not-allowed" : "pointer" }}>
            {saving ? "সেভ হচ্ছে..." : label}
        </button>
    );

    return (
        <>
            {/* Hero */}
            <section style={{ paddingTop: 90, background: "linear-gradient(180deg,#0d1f1e,#0f2218)", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 400, height: 180, borderRadius: "50%", background: "rgba(245,158,11,0.06)", filter: "blur(60px)", pointerEvents: "none" }} />
                <div style={{ position: "relative", maxWidth: 900, margin: "0 auto", padding: "40px 24px 28px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
                        <div style={{ width: 68, height: 68, borderRadius: "50%", background: "linear-gradient(135deg,#f59e0b,#ea580c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 700, color: "#0d1f1e", flexShrink: 0, overflow: "hidden", border: "3px solid rgba(245,158,11,0.3)" }}>
                            {profile?.avatar_url ? <img src={profile.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (profile?.name?.[0] || user.email?.[0])?.toUpperCase()}
                        </div>
                        <div>
                            <h1 style={{ ...bn, color: "#fff", fontWeight: 700, fontSize: 20, margin: 0 }}>{profile?.name || user.email?.split("@")[0]}</h1>
                            <p style={{ color: "#57534e", fontSize: 13, marginTop: 3 }}>{user.email}</p>
                            {profile?.acharja && <p style={{ ...bn, color: "#a8a29e", fontSize: 12, marginTop: 4 }}>🕉️ আচার্য: {profile.acharja}</p>}
                            {profile?.bhukti && <p style={{ ...bn, color: "#a8a29e", fontSize: 12, marginTop: 2 }}>📍 ভুক্তি: {profile.bhukti}</p>}
                        </div>
                    </div>
                </div>
            </section>

            {/* Tabs + Content */}
            <section style={{ padding: "0 24px 72px", background: "#0f2218" }}>
                <div style={{ maxWidth: 900, margin: "0 auto" }}>
                    {/* Tabs */}
                    <div style={{ display: "flex", gap: 0, borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 28, overflowX: "auto" }}>
                        {TABS.map((t) => (
                            <button key={t.id} type="button" onClick={() => setTab(t.id)}
                                style={{ ...bn, display: "flex", alignItems: "center", gap: 6, padding: "12px 18px", background: "transparent", border: "none", borderBottom: `2px solid ${tab === t.id ? "#fbbf24" : "transparent"}`, cursor: "pointer", fontSize: 14, color: tab === t.id ? "#fbbf24" : "#78716c", transition: "all 0.2s", whiteSpace: "nowrap", marginBottom: -1 }}>
                                <span>{t.icon}</span> {t.label}
                            </button>
                        ))}
                    </div>

                    {/* Toast */}
                    {msg.text && (
                        <div style={{ padding: "11px 16px", borderRadius: 12, marginBottom: 20, background: msg.type === "success" ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)", border: `1px solid ${msg.type === "success" ? "rgba(52,211,153,0.25)" : "rgba(248,113,113,0.25)"}` }}>
                            <p style={{ ...bn, color: msg.type === "success" ? "#34d399" : "#f87171", fontSize: 13, margin: 0 }}>{msg.type === "success" ? "✅" : "⚠️"} {msg.text}</p>
                        </div>
                    )}

                    {/* ── Profile Tab ── */}
                    {tab === "profile" && (
                        <div style={{ maxWidth: 580, display: "flex", flexDirection: "column", gap: 14 }}>
                            <Field label="পূর্ণ নাম">
                                <input type="text" placeholder="আপনার পূর্ণ নাম" value={form.name} onChange={ch("name")} style={inp(false)}
                                    onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
                                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
                            </Field>

                            <div style={{ display: "grid", gap: 14 }} className="sm:grid-cols-2">
                                <Field label="মোবাইল নম্বর" optional>
                                    <input type="tel" placeholder="+880 1X-XXXXXXXX" value={form.mobile} onChange={ch("mobile")} style={inp(false)}
                                        onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
                                        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
                                </Field>
                                <Field label="ঠিকানা" optional>
                                    <input type="text" placeholder="জেলা / উপজেলা" value={form.address} onChange={ch("address")} style={inp(false)}
                                        onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
                                        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
                                </Field>
                                <Field label="আচার্যের নাম" optional>
                                    <input type="text" placeholder="আধ্যাত্মিক গুরুর নাম" value={form.acharja} onChange={ch("acharja")} style={inp(false)}
                                        onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
                                        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
                                </Field>
                                <Field label="ভুক্তি" optional>
                                    <input type="text" placeholder="স্থানীয় শাখার নাম" value={form.bhukti} onChange={ch("bhukti")} style={inp(false)}
                                        onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
                                        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
                                </Field>
                            </div>

                            <Field label="বায়ো" optional>
                                <textarea rows={3} placeholder="নিজের সম্পর্কে সংক্ষেপে..." value={form.bio} onChange={ch("bio")} style={{ ...inp(false), resize: "vertical" }}
                                    onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
                                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
                            </Field>

                            <Field label="অ্যাভাটার URL" optional>
                                <input type="url" placeholder="https://..." value={form.avatar_url} onChange={ch("avatar_url")} style={inp(false)}
                                    onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
                                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
                                {form.avatar_url && (
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                                        <img src={form.avatar_url} alt="" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: "1px solid rgba(255,255,255,0.1)" }} onError={(e) => (e.target.style.display = "none")} />
                                        <span style={{ ...bn, color: "#57534e", fontSize: 12 }}>প্রিভিউ</span>
                                    </div>
                                )}
                            </Field>

                            {saveBtn("প্রোফাইল আপডেট করুন", saveProfile)}
                        </div>
                    )}

                    {/* ── Blogs Tab ── */}
                    {tab === "blogs" && (
                        <div>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
                                <h2 style={{ ...bn, color: "#fff", fontWeight: 700, fontSize: 18, margin: 0 }}>আমার ব্লগগুলো</h2>
                                <Link to="/blog/write" style={{ ...bn, padding: "9px 20px", borderRadius: 999, background: "linear-gradient(90deg,#f59e0b,#ea580c)", color: "#0d1f1e", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>+ নতুন ব্লগ</Link>
                            </div>
                            <MyBlogs userId={user.id} />
                        </div>
                    )}

                    {/* ── Privacy Tab ── */}
                    {tab === "privacy" && (
                        <div style={{ maxWidth: 520 }}>
                            <p style={{ ...bn, color: "#78716c", fontSize: 13, marginBottom: 20, lineHeight: 1.7 }}>আপনার তথ্য কে দেখতে পাবে তা নিয়ন্ত্রণ করুন।</p>
                            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "4px 20px 0", marginBottom: 20 }}>
                                <Toggle checked={priv.show_email} onChange={(v) => setPriv((p) => ({ ...p, show_email: v }))} label="ইমেইল প্রকাশ করুন" desc="ব্লগে আপনার ইমেইল দেখাবে।" />
                                <Toggle checked={priv.show_mobile} onChange={(v) => setPriv((p) => ({ ...p, show_mobile: v }))} label="মোবাইল প্রকাশ করুন" desc="ব্লগে আপনার মোবাইল নম্বর দেখাবে।" />
                            </div>
                            <div style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: 12, padding: "12px 16px", marginBottom: 20 }}>
                                <p style={{ ...bn, color: "#fbbf24", fontSize: 12, margin: 0, lineHeight: 1.6 }}>ℹ️ আচার্য ও ভুক্তির তথ্য সবসময় গোপন থাকে।</p>
                            </div>
                            {saveBtn("সেটিংস সেভ করুন", savePrivacy)}
                        </div>
                    )}

                    {/* ── Password Tab ── */}
                    {tab === "password" && (
                        <div style={{ maxWidth: 460, display: "flex", flexDirection: "column", gap: 14 }}>
                            <p style={{ ...bn, color: "#78716c", fontSize: 13, lineHeight: 1.7 }}>নতুন পাসওয়ার্ড দিন — সর্বনিম্ন ৬ অক্ষর।</p>
                            {[
                                { key: "newPw", label: "নতুন পাসওয়ার্ড", ph: "সর্বনিম্ন ৬ অক্ষর" },
                                { key: "confirm", label: "পাসওয়ার্ড নিশ্চিত করুন", ph: "আবার লিখুন" },
                            ].map((f) => (
                                <Field key={f.key} label={f.label}>
                                    <input type="password" placeholder={f.ph} value={pwForm[f.key]} onChange={(e) => setPwForm((d) => ({ ...d, [f.key]: e.target.value }))}
                                        style={inp(false)}
                                        onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
                                        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
                                </Field>
                            ))}
                            {saveBtn("পাসওয়ার্ড পরিবর্তন করুন", changePassword)}

                            {/* Logout */}
                            <div style={{ marginTop: 20, padding: "18px 20px", background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.18)", borderRadius: 14 }}>
                                <h3 style={{ ...bn, color: "#f87171", fontWeight: 700, fontSize: 15, marginBottom: 8 }}>লগআউট</h3>
                                <p style={{ ...bn, color: "#78716c", fontSize: 13, marginBottom: 14 }}>এই ডিভাইস থেকে বের হয়ে যাবেন।</p>
                                <button type="button" onClick={async () => { await logout(); navigate("/"); }}
                                    style={{ ...bn, padding: "10px 22px", borderRadius: 999, border: "1px solid rgba(248,113,113,0.35)", background: "transparent", color: "#f87171", fontSize: 14, cursor: "pointer", transition: "all 0.2s" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(248,113,113,0.1)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                                    🚪 লগআউট করুন
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}