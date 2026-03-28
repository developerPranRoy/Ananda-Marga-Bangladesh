// src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabase";
import useAuthStore from "../../store/authStore";


const bn = { fontFamily: "'Noto Serif Bengali', serif" };

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n) => "৳" + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const fdate = (d) => new Date(d).toLocaleDateString("bn-BD", { year: "numeric", month: "short", day: "numeric" });

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color, sub }) {
    return (
        <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${color}22`, borderRadius: 18, padding: "20px 22px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 13, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{icon}</div>
                {sub && <span style={{ ...bn, fontSize: 11, color: "#57534e" }}>{sub}</span>}
            </div>
            <div style={{ ...bn, color, fontWeight: 700, fontSize: 28, marginBottom: 4 }}>{value}</div>
            <div style={{ ...bn, color: "#78716c", fontSize: 13 }}>{label}</div>
        </div>
    );
}

// ── Table wrapper ─────────────────────────────────────────────────────────────
function Table({ headers, children, empty }) {
    return (
        <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        {headers.map((h) => (
                            <th key={h} style={{ ...bn, color: "#57534e", fontSize: 12, fontWeight: 600, padding: "10px 14px", textAlign: "left", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>{children}</tbody>
            </table>
            {empty && (
                <div style={{ textAlign: "center", padding: "32px 0", color: "#57534e" }}>
                    <p style={bn}>{empty}</p>
                </div>
            )}
        </div>
    );
}

// ── Badge ─────────────────────────────────────────────────────────────────────
function Badge({ label, color }) {
    return (
        <span style={{ ...bn, fontSize: 11, padding: "3px 10px", borderRadius: 999, background: `${color}18`, color, border: `1px solid ${color}28` }}>{label}</span>
    );
}

// ── Statistics Tab ────────────────────────────────────────────────────────────
function StatsTab({ stats }) {
    return (
        <div>
            <div style={{ display: "grid", gap: 14 }} className="sm:grid-cols-2 lg:grid-cols-4">
                <StatCard icon="👥" label="মোট ব্যবহারকারী" value={stats.users} color="#fbbf24" />
                <StatCard icon="📝" label="মোট ব্লগ" value={stats.blogs} color="#2dd4bf" />
                <StatCard icon="💰" label="মোট দান" value={fmt(stats.totalDonation)} color="#34d399" />
                <StatCard icon="✉️" label="নতুন বার্তা" value={stats.unreadMessages} color="#fb7185" sub="অপঠিত" />
            </div>

            <div style={{ marginTop: 24, display: "grid", gap: 14 }} className="sm:grid-cols-3">
                <StatCard icon="🚀" label="প্রকাশিত ব্লগ" value={stats.publishedBlogs} color="#a78bfa" />
                <StatCard icon="📋" label="ড্রাফট ব্লগ" value={stats.draftBlogs} color="#f97316" />
                <StatCard icon="👁" label="মোট ভিউ" value={stats.totalViews} color="#06b6d4" />
            </div>
        </div>
    );
}

// ── Users Tab ─────────────────────────────────────────────────────────────────
function UsersTab() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        supabase.from("profiles").select("*").order("created_at", { ascending: false })
            .then(({ data }) => { setUsers(data || []); setLoading(false); });
    }, []);

    const toggleAdmin = async (id, current) => {
        await supabase.from("profiles").update({ is_admin: !current }).eq("id", id);
        setUsers((prev) => prev.map((u) => u.id === id ? { ...u, is_admin: !current } : u));
    };

    const toggleActive = async (id, current) => {
        await supabase.from("profiles").update({ is_active: !current }).eq("id", id);
        setUsers((prev) => prev.map((u) => u.id === id ? { ...u, is_active: !current } : u));
    };

    const filtered = search ? users.filter((u) => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())) : users;

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
                <h2 style={{ ...bn, color: "#fff", fontWeight: 700, fontSize: 18, margin: 0 }}>ব্যবহারকারী ({users.length})</h2>
                <input type="text" placeholder="নাম বা ইমেইল খুঁজুন..." value={search} onChange={(e) => setSearch(e.target.value)}
                    style={{ ...bn, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 14px", color: "#e7e5e4", fontSize: 13, outline: "none", width: 220 }} />
            </div>

            {loading ? <p style={{ ...bn, color: "#57534e" }}>লোড হচ্ছে...</p> : (
                <Table headers={["নাম", "ইমেইল", "ভুক্তি", "আচার্য", "যোগদান", "অ্যাডমিন", "সক্রিয়", "একশন"]}
                    empty={filtered.length === 0 ? "কোনো ব্যবহারকারী নেই" : null}>
                    {filtered.map((u) => (
                        <tr key={u.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                            <td style={{ padding: "12px 14px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#f59e0b,#ea580c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#0d1f1e", fontWeight: 700, flexShrink: 0, overflow: "hidden" }}>
                                        {u.avatar_url ? <img src={u.avatar_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : u.name?.[0]?.toUpperCase() || "?"}
                                    </div>
                                    <span style={{ ...bn, color: "#f5f5f4", fontSize: 13 }}>{u.name || "—"}</span>
                                </div>
                            </td>
                            <td style={{ padding: "12px 14px" }}><span style={{ color: "#78716c", fontSize: 12 }}>{u.email}</span></td>
                            <td style={{ padding: "12px 14px" }}><span style={{ ...bn, color: "#78716c", fontSize: 12 }}>{u.bhukti || "—"}</span></td>
                            <td style={{ padding: "12px 14px" }}><span style={{ ...bn, color: "#78716c", fontSize: 12 }}>{u.acharja || "—"}</span></td>
                            <td style={{ padding: "12px 14px" }}><span style={{ color: "#57534e", fontSize: 12 }}>{fdate(u.created_at)}</span></td>
                            <td style={{ padding: "12px 14px" }}>
                                <Badge label={u.is_admin ? "অ্যাডমিন" : "সাধারণ"} color={u.is_admin ? "#fbbf24" : "#57534e"} />
                            </td>
                            <td style={{ padding: "12px 14px" }}>
                                <Badge label={u.is_active !== false ? "সক্রিয়" : "নিষ্ক্রিয়"} color={u.is_active !== false ? "#34d399" : "#f87171"} />
                            </td>
                            <td style={{ padding: "12px 14px" }}>
                                <div style={{ display: "flex", gap: 6 }}>
                                    <button type="button" onClick={() => toggleAdmin(u.id, u.is_admin)}
                                        style={{ ...bn, padding: "4px 10px", borderRadius: 8, border: "1px solid rgba(245,158,11,0.25)", background: "transparent", color: "#fbbf24", fontSize: 11, cursor: "pointer" }}>
                                        {u.is_admin ? "সরাও" : "অ্যাডমিন"}
                                    </button>
                                    <button type="button" onClick={() => toggleActive(u.id, u.is_active !== false)}
                                        style={{ ...bn, padding: "4px 10px", borderRadius: 8, border: `1px solid ${u.is_active !== false ? "rgba(248,113,113,0.25)" : "rgba(52,211,153,0.25)"}`, background: "transparent", color: u.is_active !== false ? "#f87171" : "#34d399", fontSize: 11, cursor: "pointer" }}>
                                        {u.is_active !== false ? "নিষ্ক্রিয়" : "সক্রিয়"}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </Table>
            )}
        </div>
    );
}

// ── Blogs Tab ─────────────────────────────────────────────────────────────────
function BlogsTab() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        supabase.from("blogs").select("*, profiles(name)").order("created_at", { ascending: false })
            .then(({ data }) => { setBlogs(data || []); setLoading(false); });
    }, []);

    const toggleStatus = async (id, current) => {
        const next = current === "published" ? "draft" : "published";
        await supabase.from("blogs").update({ status: next }).eq("id", id);
        setBlogs((prev) => prev.map((b) => b.id === id ? { ...b, status: next } : b));
    };

    const deleteBlog = async (id) => {
        if (!confirm("এই ব্লগটি মুছে ফেলবেন?")) return;
        await supabase.from("blogs").delete().eq("id", id);
        setBlogs((prev) => prev.filter((b) => b.id !== id));
    };

    const filtered = filter === "all" ? blogs : blogs.filter((b) => b.status === filter);

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
                <h2 style={{ ...bn, color: "#fff", fontWeight: 700, fontSize: 18, margin: 0 }}>ব্লগ ({blogs.length})</h2>
                <div style={{ display: "flex", gap: 6 }}>
                    {[["all", "সব"], ["published", "প্রকাশিত"], ["draft", "ড্রাফট"]].map(([val, label]) => (
                        <button key={val} type="button" onClick={() => setFilter(val)}
                            style={{ ...bn, padding: "6px 14px", borderRadius: 999, fontSize: 12, cursor: "pointer", border: `1px solid ${filter === val ? "rgba(245,158,11,0.5)" : "rgba(255,255,255,0.1)"}`, background: filter === val ? "rgba(245,158,11,0.1)" : "transparent", color: filter === val ? "#fbbf24" : "#78716c" }}>
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? <p style={{ ...bn, color: "#57534e" }}>লোড হচ্ছে...</p> : (
                <Table headers={["শিরোনাম", "লেখক", "বিভাগ", "ভিউ", "তারিখ", "স্ট্যাটাস", "একশন"]}
                    empty={filtered.length === 0 ? "কোনো ব্লগ নেই" : null}>
                    {filtered.map((b) => (
                        <tr key={b.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                            <td style={{ padding: "12px 14px", maxWidth: 240 }}>
                                <span style={{ ...bn, color: "#f5f5f4", fontSize: 13, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{b.title}</span>
                            </td>
                            <td style={{ padding: "12px 14px" }}><span style={{ ...bn, color: "#78716c", fontSize: 12 }}>{b.profiles?.name || "—"}</span></td>
                            <td style={{ padding: "12px 14px" }}><Badge label={b.category} color="#2dd4bf" /></td>
                            <td style={{ padding: "12px 14px" }}><span style={{ color: "#57534e", fontSize: 12 }}>👁 {b.views}</span></td>
                            <td style={{ padding: "12px 14px" }}><span style={{ color: "#57534e", fontSize: 12 }}>{fdate(b.created_at)}</span></td>
                            <td style={{ padding: "12px 14px" }}>
                                <Badge label={b.status === "published" ? "প্রকাশিত" : "ড্রাফট"} color={b.status === "published" ? "#34d399" : "#fbbf24"} />
                            </td>
                            <td style={{ padding: "12px 14px" }}>
                                <div style={{ display: "flex", gap: 6 }}>
                                    <button type="button" onClick={() => toggleStatus(b.id, b.status)}
                                        style={{ ...bn, padding: "4px 10px", borderRadius: 8, border: "1px solid rgba(245,158,11,0.25)", background: "transparent", color: "#fbbf24", fontSize: 11, cursor: "pointer" }}>
                                        {b.status === "published" ? "আনপাব" : "প্রকাশ"}
                                    </button>
                                    <button type="button" onClick={() => deleteBlog(b.id)}
                                        style={{ ...bn, padding: "4px 10px", borderRadius: 8, border: "1px solid rgba(248,113,113,0.25)", background: "transparent", color: "#f87171", fontSize: 11, cursor: "pointer" }}>
                                        মুছুন
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </Table>
            )}
        </div>
    );
}

// ── Donations Tab ─────────────────────────────────────────────────────────────
function DonationsTab() {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        supabase.from("donations").select("*").order("created_at", { ascending: false })
            .then(({ data }) => {
                setDonations(data || []);
                setTotal((data || []).reduce((sum, d) => sum + (d.amount || 0), 0));
                setLoading(false);
            });
    }, []);

    const updateStatus = async (id, status) => {
        await supabase.from("donations").update({ status }).eq("id", id);
        setDonations((prev) => prev.map((d) => d.id === id ? { ...d, status } : d));
    };

    const STATUS_COLORS = { pending: "#fbbf24", confirmed: "#34d399", rejected: "#f87171" };
    const STATUS_LABELS = { pending: "অপেক্ষমাণ", confirmed: "নিশ্চিত", rejected: "বাতিল" };

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
                <h2 style={{ ...bn, color: "#fff", fontWeight: 700, fontSize: 18, margin: 0 }}>দান ({donations.length})</h2>
                <div style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 12, padding: "8px 16px" }}>
                    <span style={{ ...bn, color: "#34d399", fontWeight: 700, fontSize: 16 }}>মোট: {fmt(total)}</span>
                </div>
            </div>

            {loading ? <p style={{ ...bn, color: "#57534e" }}>লোড হচ্ছে...</p> : (
                <Table headers={["দাতা", "পরিমাণ", "কারণ", "পেমেন্ট", "তারিখ", "স্ট্যাটাস", "একশন"]}
                    empty={donations.length === 0 ? "কোনো দান নেই" : null}>
                    {donations.map((d) => (
                        <tr key={d.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                            <td style={{ padding: "12px 14px" }}>
                                <div>
                                    <div style={{ ...bn, color: "#f5f5f4", fontSize: 13 }}>{d.anonymous ? "🕵️ গোপন" : (d.donor_name || "—")}</div>
                                    {!d.anonymous && d.phone && <div style={{ color: "#57534e", fontSize: 11, marginTop: 2 }}>{d.phone}</div>}
                                </div>
                            </td>
                            <td style={{ padding: "12px 14px" }}><span style={{ ...bn, color: "#fbbf24", fontWeight: 700, fontSize: 14 }}>{fmt(d.amount)}</span></td>
                            <td style={{ padding: "12px 14px" }}><Badge label={d.cause || "সাধারণ"} color="#2dd4bf" /></td>
                            <td style={{ padding: "12px 14px" }}><span style={{ ...bn, color: "#78716c", fontSize: 12 }}>{d.payment || "—"}</span></td>
                            <td style={{ padding: "12px 14px" }}><span style={{ color: "#57534e", fontSize: 12 }}>{fdate(d.created_at)}</span></td>
                            <td style={{ padding: "12px 14px" }}>
                                <Badge label={STATUS_LABELS[d.status] || d.status} color={STATUS_COLORS[d.status] || "#78716c"} />
                            </td>
                            <td style={{ padding: "12px 14px" }}>
                                <select value={d.status} onChange={(e) => updateStatus(d.id, e.target.value)}
                                    style={{ ...bn, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "4px 8px", color: "#e7e5e4", fontSize: 12, cursor: "pointer", outline: "none" }}>
                                    <option value="pending" style={{ background: "#0d1f1e" }}>অপেক্ষমাণ</option>
                                    <option value="confirmed" style={{ background: "#0d1f1e" }}>নিশ্চিত</option>
                                    <option value="rejected" style={{ background: "#0d1f1e" }}>বাতিল</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </Table>
            )}
        </div>
    );
}

// ── Messages Tab ──────────────────────────────────────────────────────────────
function MessagesTab() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        supabase.from("contact_messages").select("*").order("created_at", { ascending: false })
            .then(({ data }) => { setMessages(data || []); setLoading(false); });
    }, []);

    const markRead = async (id) => {
        await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
        setMessages((prev) => prev.map((m) => m.id === id ? { ...m, is_read: true } : m));
    };

    const deleteMsg = async (id) => {
        if (!confirm("এই বার্তাটি মুছে ফেলবেন?")) return;
        await supabase.from("contact_messages").delete().eq("id", id);
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (selected?.id === id) setSelected(null);
    };

    return (
        <div style={{ display: "grid", gap: 16 }} className="lg:grid-cols-[1fr_1.5fr]">
            {/* List */}
            <div>
                <h2 style={{ ...bn, color: "#fff", fontWeight: 700, fontSize: 18, marginBottom: 16 }}>
                    বার্তা ({messages.length})
                    {messages.filter((m) => !m.is_read).length > 0 && (
                        <span style={{ ...bn, fontSize: 12, padding: "2px 9px", borderRadius: 999, background: "rgba(251,113,133,0.15)", color: "#fb7185", border: "1px solid rgba(251,113,133,0.25)", marginLeft: 8 }}>
                            {messages.filter((m) => !m.is_read).length} অপঠিত
                        </span>
                    )}
                </h2>
                {loading ? <p style={{ ...bn, color: "#57534e" }}>লোড হচ্ছে...</p> : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {messages.length === 0 && <p style={{ ...bn, color: "#57534e", textAlign: "center", padding: "24px 0" }}>কোনো বার্তা নেই।</p>}
                        {messages.map((m) => (
                            <div key={m.id}
                                onClick={() => { setSelected(m); if (!m.is_read) markRead(m.id); }}
                                style={{ padding: "14px 16px", background: selected?.id === m.id ? "rgba(245,158,11,0.08)" : m.is_read ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)", border: `1px solid ${selected?.id === m.id ? "rgba(245,158,11,0.3)" : m.is_read ? "rgba(255,255,255,0.06)" : "rgba(245,158,11,0.15)"}`, borderRadius: 14, cursor: "pointer", transition: "all 0.2s" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                    <span style={{ ...bn, color: "#f5f5f4", fontSize: 13, fontWeight: m.is_read ? 400 : 600 }}>{m.name}</span>
                                    <span style={{ color: "#57534e", fontSize: 11 }}>{fdate(m.created_at)}</span>
                                </div>
                                {m.topic && <Badge label={m.topic} color="#2dd4bf" />}
                                <p style={{ ...bn, color: "#78716c", fontSize: 12, marginTop: 6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.6 }}>{m.message}</p>
                                {!m.is_read && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fbbf24", marginTop: 6 }} />}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Detail */}
            <div>
                {selected ? (
                    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: 22 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
                            <h3 style={{ ...bn, color: "#fff", fontWeight: 700, fontSize: 17, margin: 0 }}>{selected.name}</h3>
                            <button type="button" onClick={() => deleteMsg(selected.id)}
                                style={{ ...bn, padding: "5px 14px", borderRadius: 999, border: "1px solid rgba(248,113,113,0.25)", background: "transparent", color: "#f87171", fontSize: 12, cursor: "pointer" }}>
                                মুছুন
                            </button>
                        </div>
                        {[
                            { label: "ইমেইল", val: selected.email },
                            { label: "ফোন", val: selected.phone || "—" },
                            { label: "বিষয়", val: selected.topic || "—" },
                            { label: "তারিখ", val: fdate(selected.created_at) },
                        ].map((r) => (
                            <div key={r.label} style={{ display: "flex", gap: 12, marginBottom: 8 }}>
                                <span style={{ ...bn, color: "#57534e", fontSize: 13, minWidth: 60 }}>{r.label}:</span>
                                <span style={{ ...bn, color: "#a8a29e", fontSize: 13 }}>{r.val}</span>
                            </div>
                        ))}
                        <div style={{ marginTop: 16, padding: 16, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12 }}>
                            <p style={{ ...bn, color: "#d6d3d1", fontSize: 14, lineHeight: 1.8, margin: 0, whiteSpace: "pre-wrap" }}>{selected.message}</p>
                        </div>
                        <a href={`mailto:${selected.email}`}
                            style={{ ...bn, display: "inline-block", marginTop: 14, padding: "9px 20px", borderRadius: 999, background: "linear-gradient(90deg,#f59e0b,#ea580c)", color: "#0d1f1e", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
                            ✉️ উত্তর দিন
                        </a>
                    </div>
                ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "200px", color: "#57534e" }}>
                        <p style={bn}>বাম থেকে একটি বার্তা বেছে নিন</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, profile } = useAuthStore();
  const [tab, setTab] = useState("stats");
  const [stats, setStats] = useState({ users: 0, blogs: 0, publishedBlogs: 0, draftBlogs: 0, totalViews: 0, totalDonation: 0, unreadMessages: 0 });

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
  }, [user]);

  // Fetch stats
  useEffect(() => {
    if (!profile?.is_admin) return;
    const load = async () => {
      const [users, blogs, donations, messages] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact" }),
        supabase.from("blogs").select("status, views"),
        supabase.from("donations").select("amount, status"),
        supabase.from("contact_messages").select("is_read").eq("is_read", false),
      ]);
      const blogData = blogs.data || [];
      setStats({
        users: users.count || 0,
        blogs: blogData.length,
        publishedBlogs: blogData.filter((b) => b.status === "published").length,
        draftBlogs: blogData.filter((b) => b.status === "draft").length,
        totalViews: blogData.reduce((s, b) => s + (b.views || 0), 0),
        totalDonation: (donations.data || []).reduce((s, d) => s + (d.amount || 0), 0),
        unreadMessages: messages.count || 0,
      });
    };
    load();
  }, [profile]);

  // Loading state
  if (!user || !profile) return (
    <div style={{ minHeight: "100vh", background: "#0d1f1e", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#78716c", fontFamily: "'Noto Serif Bengali', serif" }}>লোড হচ্ছে...</p>
    </div>
  );

  if (!profile.is_admin) return <Navigate to="/" replace />;

    const TABS = [
        { id: "stats", label: "পরিসংখ্যান", icon: "📊" },
        { id: "users", label: "ব্যবহারকারী", icon: "👥" },
        { id: "blogs", label: "ব্লগ", icon: "📝" },
        { id: "donations", label: "দান", icon: "💰" },
        { id: "messages", label: "বার্তা", icon: "✉️" },
    ];

    return (
        <div style={{ minHeight: "100vh", background: "#0d1f1e" }}>
            <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@400;600;700&display=swap" rel="stylesheet" />

            {/* Top bar */}
            <div style={{ background: "rgba(13,31,30,0.98)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 40 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 22 }}>🕉️</span>
                    <div>
                        <div style={{ ...bn, color: "#fbbf24", fontWeight: 700, fontSize: 14 }}>Admin Dashboard</div>
                        <div style={{ ...bn, color: "#57534e", fontSize: 11 }}>আনন্দমার্গ বাংলাদেশ</div>
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ ...bn, color: "#78716c", fontSize: 13 }}>{profile?.name}</span>
                    <a href="/" style={{ ...bn, padding: "6px 14px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.1)", color: "#a8a29e", textDecoration: "none", fontSize: 13 }}>← সাইটে যান</a>
                </div>
            </div>

            <div style={{ display: "flex", minHeight: "calc(100vh - 57px)" }}>
                {/* Sidebar */}
                <div style={{ width: 200, background: "rgba(255,255,255,0.02)", borderRight: "1px solid rgba(255,255,255,0.05)", padding: "20px 12px", flexShrink: 0 }} className="hidden md:block">
                    {TABS.map((t) => (
                        <button key={t.id} type="button" onClick={() => setTab(t.id)}
                            style={{ ...bn, width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 12, border: "none", background: tab === t.id ? "rgba(245,158,11,0.1)" : "transparent", color: tab === t.id ? "#fbbf24" : "#78716c", fontSize: 14, cursor: "pointer", marginBottom: 4, textAlign: "left", transition: "all 0.2s" }}>
                            <span>{t.icon}</span> {t.label}
                        </button>
                    ))}
                </div>

                {/* Mobile tab bar */}
                <div className="md:hidden" style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(13,31,30,0.98)", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", zIndex: 40 }}>
                    {TABS.map((t) => (
                        <button key={t.id} type="button" onClick={() => setTab(t.id)}
                            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "10px 4px", border: "none", background: "transparent", color: tab === t.id ? "#fbbf24" : "#57534e", fontSize: 10, cursor: "pointer", fontFamily: "'Noto Serif Bengali', serif" }}>
                            <span style={{ fontSize: 18 }}>{t.icon}</span>
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div style={{ flex: 1, padding: "28px 24px 80px", overflowY: "auto" }}>
                    {tab === "stats" && <StatsTab stats={stats} />}
                    {tab === "users" && <UsersTab />}
                    {tab === "blogs" && <BlogsTab />}
                    {tab === "donations" && <DonationsTab />}
                    {tab === "messages" && <MessagesTab />}
                </div>
            </div>
        </div>
    );
}