import { useState, useEffect, useRef } from "react";
import MusicPlayer from "../components/common/MusicPlayer";

// ─── Data ────────────────────────────────────────────────────────────────────

const DONATION_TIERS = [
    {
        amount: 500,
        label: "সহযোগী",
        icon: "🌱",
        desc: "একটি শিশুর এক সপ্তাহের পাঠ্যপুস্তকের খরচ",
        color: "#2dd4bf",
        border: "border-teal-400/30",
        bg: "from-teal-500/15 to-cyan-500/5",
    },
    {
        amount: 1500,
        label: "সেবক",
        icon: "🤝",
        desc: "একটি পরিবারের এক মাসের খাদ্য সহায়তা",
        color: "#fbbf24",
        border: "border-amber-400/40",
        bg: "from-amber-500/20 to-orange-500/5",
        popular: true,
    },
    {
        amount: 5000,
        label: "দাতা",
        icon: "💛",
        desc: "একটি যোগ কেন্দ্র পরিচালনার মাসিক ব্যয়",
        color: "#a78bfa",
        border: "border-violet-400/30",
        bg: "from-violet-500/15 to-purple-500/5",
    },
    {
        amount: 10000,
        label: "মহাদাতা",
        icon: "🕉️",
        desc: "দশজন শিশুর এক মাসের শিক্ষা কার্যক্রম",
        color: "#f97316",
        border: "border-orange-400/30",
        bg: "from-orange-500/15 to-amber-500/5",
    },
];

const CAUSES = [
    { id: "education", label: "শিক্ষা কার্যক্রম", icon: "📚" },
    { id: "health", label: "স্বাস্থ্যসেবা", icon: "🏥" },
    { id: "yoga", label: "যোগ কেন্দ্র", icon: "🧘" },
    { id: "disaster", label: "দুর্যোগ ত্রাণ", icon: "🆘" },
    { id: "general", label: "সাধারণ তহবিল", icon: "🌿" },
];

const PAYMENT_METHODS = [
    { id: "bkash", label: "bKash", icon: "📱", number: "01XXXXXXXXX", color: "#e2136e" },
    { id: "nagad", label: "Nagad", icon: "💳", number: "01XXXXXXXXX", color: "#f7941d" },
    { id: "bank", label: "ব্যাংক ট্রান্সফার", icon: "🏦", number: "AC: XXXX-XXXX-XXXX", color: "#3b82f6" },
];

const IMPACT_STATS = [
    { val: "৫০০+", label: "পরিবার উপকৃত", icon: "👨‍👩‍👧‍👦" },
    { val: "১২০০+", label: "শিশু শিক্ষার্থী", icon: "📖" },
    { val: "৩০+", label: "স্বাস্থ্য শিবির", icon: "🏥" },
    { val: "১০০%", label: "স্বচ্ছতা", icon: "✅" },
];

// ─── Hook ─────────────────────────────────────────────────────────────────────

function useReveal() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold: 0.12 }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return [ref, visible];
}

// ─── Donation Form ────────────────────────────────────────────────────────────

function DonationForm() {
    const [ref, visible] = useReveal();
    const [selectedTier, setSelectedTier] = useState(1); // default: সেবক
    const [customAmount, setCustomAmount] = useState("");
    const [useCustom, setUseCustom] = useState(false);
    const [selectedCause, setSelectedCause] = useState("general");
    const [selectedPayment, setSelectedPayment] = useState("bkash");
    const [donorInfo, setDonorInfo] = useState({ name: "", phone: "", email: "", anonymous: false });
    const [step, setStep] = useState(1); // 1: amount, 2: info, 3: payment, 4: success
    const [errors, setErrors] = useState({});

    const finalAmount = useCustom
        ? parseInt(customAmount) || 0
        : DONATION_TIERS[selectedTier].amount;

    const validateStep2 = () => {
        if (donorInfo.anonymous) return {};
        const e = {};
        if (!donorInfo.name.trim()) e.name = "নাম লিখুন";
        if (!donorInfo.phone.trim()) e.phone = "ফোন নম্বর লিখুন";
        return e;
    };

    const nextStep = () => {
        if (step === 1 && finalAmount < 10) {
            setErrors({ amount: "সর্বনিম্ন ১০ টাকা দান করুন" });
            return;
        }
        if (step === 2) {
            const e = validateStep2();
            if (Object.keys(e).length > 0) { setErrors(e); return; }
        }
        setErrors({});
        setStep((s) => s + 1);
    };

    const inputStyle = {
        width: "100%",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "12px",
        padding: "11px 16px",
        color: "#e7e5e4",
        fontSize: "14px",
        fontFamily: "'Noto Serif Bengali', serif",
        outline: "none",
        transition: "border-color 0.2s",
    };

    return (
        <div
            ref={ref}
            className="bg-white/4 backdrop-blur rounded-2xl sm:rounded-3xl border border-white/8 overflow-hidden"
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(28px)",
                transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
        >
            {/* Step indicator */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/6 bg-white/2">
                {["পরিমাণ", "তথ্য", "পেমেন্ট"].map((label, i) => (
                    <div key={label} className="flex items-center gap-2 flex-1">
                        <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                            style={{
                                background: step > i + 1 ? "#f59e0b" : step === i + 1 ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.05)",
                                border: step >= i + 1 ? "1px solid rgba(245,158,11,0.5)" : "1px solid rgba(255,255,255,0.1)",
                                color: step >= i + 1 ? "#fbbf24" : "#57534e",
                                fontFamily: "'Noto Serif Bengali', serif",
                            }}
                        >
                            {step > i + 1 ? "✓" : i + 1}
                        </div>
                        <span
                            className="text-xs hidden sm:inline transition-colors"
                            style={{
                                color: step >= i + 1 ? "#fbbf24" : "#57534e",
                                fontFamily: "'Noto Serif Bengali', serif",
                            }}
                        >
                            {label}
                        </span>
                        {i < 2 && <div className="flex-1 h-px bg-white/8 mx-2 hidden sm:block" />}
                    </div>
                ))}
            </div>

            <div className="p-6 sm:p-8">
                {/* ── Step 1: Amount ── */}
                {step === 1 && (
                    <div style={{ animation: "fadeUp 0.4s ease both" }}>
                        <h3 className="text-xl font-bold text-white mb-1" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                            দানের পরিমাণ
                        </h3>
                        <p className="text-stone-500 text-sm mb-6" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                            আপনার সাধ্যমতো দান করুন — ছোট দানও বড় পরিবর্তন আনে।
                        </p>

                        {/* Tiers */}
                        <div className="grid grid-cols-2 gap-3 mb-5">
                            {DONATION_TIERS.map((tier, i) => (
                                <button
                                    key={tier.amount}
                                    onClick={() => { setSelectedTier(i); setUseCustom(false); setErrors({}); }}
                                    className={`relative rounded-xl p-4 text-left transition-all duration-200 border bg-gradient-to-br ${tier.bg} ${!useCustom && selectedTier === i ? tier.border : "border-white/8"
                                        } hover:scale-[1.02]`}
                                >
                                    {tier.popular && (
                                        <div
                                            className="absolute -top-2.5 right-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                                            style={{ background: "#f59e0b", color: "#0d1f1e", fontFamily: "sans-serif" }}
                                        >
                                            জনপ্রিয়
                                        </div>
                                    )}
                                    <div className="text-xl mb-1.5">{tier.icon}</div>
                                    <div className="font-bold text-base mb-0.5" style={{ color: tier.color, fontFamily: "'Noto Serif Bengali', serif" }}>
                                        ৳{tier.amount.toLocaleString("bn-BD")}
                                    </div>
                                    <div className="text-stone-400 text-xs leading-snug" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                                        {tier.label}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Custom amount */}
                        <div className="mb-5">
                            <button
                                onClick={() => { setUseCustom(true); setErrors({}); }}
                                className={`w-full rounded-xl p-3.5 border text-sm transition-all duration-200 text-left ${useCustom ? "border-amber-400/40 bg-amber-500/5" : "border-white/8 hover:border-white/15"
                                    }`}
                                style={{ fontFamily: "'Noto Serif Bengali', serif", color: useCustom ? "#fbbf24" : "#78716c" }}
                            >
                                {useCustom ? (
                                    <input
                                        type="number"
                                        placeholder="নিজে পরিমাণ লিখুন (৳)"
                                        value={customAmount}
                                        onChange={(e) => setCustomAmount(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        autoFocus
                                        style={{ background: "transparent", border: "none", outline: "none", color: "#fbbf24", width: "100%", fontFamily: "'Noto Serif Bengali', serif", fontSize: "14px" }}
                                    />
                                ) : (
                                    "+ নিজে পরিমাণ লিখুন"
                                )}
                            </button>
                            {errors.amount && <p className="text-red-400 text-xs mt-1 ml-1" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>{errors.amount}</p>}
                        </div>

                        {/* Cause selection */}
                        <div className="mb-6">
                            <p className="text-stone-400 text-xs mb-3 ml-1" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>কোন কাজে ব্যবহার করতে চান?</p>
                            <div className="flex flex-wrap gap-2">
                                {CAUSES.map((c) => (
                                    <button
                                        key={c.id}
                                        onClick={() => setSelectedCause(c.id)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all duration-200 border ${selectedCause === c.id
                                            ? "border-amber-400/50 bg-amber-500/10 text-amber-300"
                                            : "border-white/8 text-stone-500 hover:border-white/15 hover:text-stone-400"
                                            }`}
                                        style={{ fontFamily: "'Noto Serif Bengali', serif" }}
                                    >
                                        {c.icon} {c.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Summary */}
                        {finalAmount > 0 && (
                            <div className="bg-amber-500/8 border border-amber-400/20 rounded-xl p-4 mb-6 flex items-center justify-between">
                                <span className="text-stone-400 text-sm" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>মোট দান</span>
                                <span className="text-amber-400 font-bold text-xl" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                                    ৳{finalAmount.toLocaleString("bn-BD")}
                                </span>
                            </div>
                        )}

                        <button
                            onClick={nextStep}
                            className="w-full py-3.5 rounded-full font-bold text-sm text-[#0d1f1e] transition-all hover:scale-[1.01] hover:shadow-lg hover:shadow-amber-500/20"
                            style={{ background: "linear-gradient(90deg, #f59e0b, #ea580c)", fontFamily: "'Noto Serif Bengali', serif" }}
                        >
                            পরবর্তী ধাপ →
                        </button>
                    </div>
                )}

                {/* ── Step 2: Donor Info ── */}
                {step === 2 && (
                    <div style={{ animation: "fadeUp 0.4s ease both" }}>
                        <h3 className="text-xl font-bold text-white mb-1" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>দাতার তথ্য</h3>
                        <p className="text-stone-500 text-sm mb-6" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>রসিদ পাঠানোর জন্য তথ্য দিন।</p>

                        {/* Anonymous toggle */}
                        <button
                            onClick={() => setDonorInfo((d) => ({ ...d, anonymous: !d.anonymous }))}
                            className={`w-full flex items-center justify-between p-4 rounded-xl border mb-5 transition-all ${donorInfo.anonymous ? "border-teal-400/30 bg-teal-500/8" : "border-white/8 hover:border-white/15"
                                }`}
                        >
                            <span className="text-sm" style={{ color: donorInfo.anonymous ? "#2dd4bf" : "#78716c", fontFamily: "'Noto Serif Bengali', serif" }}>
                                🕵️ পরিচয় গোপন রেখে দান করুন
                            </span>
                            <div
                                className={`w-10 h-5 rounded-full transition-all duration-300 relative ${donorInfo.anonymous ? "bg-teal-500" : "bg-white/10"}`}
                            >
                                <div
                                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300"
                                    style={{ left: donorInfo.anonymous ? "calc(100% - 18px)" : "2px" }}
                                />
                            </div>
                        </button>

                        {!donorInfo.anonymous && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-stone-400 text-xs mb-1.5 ml-1" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                                        নাম <span className="text-amber-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="আপনার পূর্ণ নাম"
                                        value={donorInfo.name}
                                        onChange={(e) => { setDonorInfo((d) => ({ ...d, name: e.target.value })); setErrors((er) => ({ ...er, name: "" })); }}
                                        style={{ ...inputStyle, borderColor: errors.name ? "rgba(248,113,113,0.5)" : undefined }}
                                        onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
                                        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                                    />
                                    {errors.name && <p className="text-red-400 text-xs mt-1 ml-1" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-stone-400 text-xs mb-1.5 ml-1" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                                        ফোন নম্বর <span className="text-amber-400">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="+880 1X-XXXXXXXX"
                                        value={donorInfo.phone}
                                        onChange={(e) => { setDonorInfo((d) => ({ ...d, phone: e.target.value })); setErrors((er) => ({ ...er, phone: "" })); }}
                                        style={{ ...inputStyle, borderColor: errors.phone ? "rgba(248,113,113,0.5)" : undefined }}
                                        onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
                                        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                                    />
                                    {errors.phone && <p className="text-red-400 text-xs mt-1 ml-1" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>{errors.phone}</p>}
                                </div>
                                <div>
                                    <label className="block text-stone-400 text-xs mb-1.5 ml-1" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>ইমেইল (ঐচ্ছিক)</label>
                                    <input
                                        type="email"
                                        placeholder="example@email.com"
                                        value={donorInfo.email}
                                        onChange={(e) => setDonorInfo((d) => ({ ...d, email: e.target.value }))}
                                        style={inputStyle}
                                        onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.4)")}
                                        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setStep(1)}
                                className="flex-1 py-3 rounded-full border border-white/10 text-stone-400 text-sm hover:border-white/20 transition-all"
                                style={{ fontFamily: "'Noto Serif Bengali', serif" }}
                            >
                                ← আগে
                            </button>
                            <button
                                onClick={nextStep}
                                className="flex-[2] py-3 rounded-full font-bold text-sm text-[#0d1f1e] hover:scale-[1.01] transition-all"
                                style={{ background: "linear-gradient(90deg, #f59e0b, #ea580c)", fontFamily: "'Noto Serif Bengali', serif" }}
                            >
                                পেমেন্ট পদ্ধতি →
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Step 3: Payment ── */}
                {step === 3 && (
                    <div style={{ animation: "fadeUp 0.4s ease both" }}>
                        <h3 className="text-xl font-bold text-white mb-1" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>পেমেন্ট পদ্ধতি</h3>
                        <p className="text-stone-500 text-sm mb-6" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>আপনার পছন্দের পদ্ধতি বেছে নিন।</p>

                        <div className="space-y-3 mb-6">
                            {PAYMENT_METHODS.map((pm) => (
                                <button
                                    key={pm.id}
                                    onClick={() => setSelectedPayment(pm.id)}
                                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left ${selectedPayment === pm.id ? "border-amber-400/40 bg-amber-500/8" : "border-white/8 hover:border-white/15"
                                        }`}
                                >
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                                        style={{ background: pm.color + "20", border: `1px solid ${pm.color}30` }}
                                    >
                                        {pm.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-white font-medium text-sm" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>{pm.label}</div>
                                        <div className="text-stone-500 text-xs font-mono mt-0.5">{pm.number}</div>
                                    </div>
                                    <div
                                        className={`w-4 h-4 rounded-full border-2 transition-all ${selectedPayment === pm.id ? "border-amber-400 bg-amber-400" : "border-stone-600"}`}
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Summary box */}
                        <div className="bg-white/4 rounded-xl border border-white/8 p-4 mb-6 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-stone-400" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>দানের পরিমাণ</span>
                                <span className="text-white font-bold" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>৳{finalAmount.toLocaleString("bn-BD")}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-stone-400" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>কারণ</span>
                                <span className="text-teal-300 text-xs" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                                    {CAUSES.find((c) => c.id === selectedCause)?.label}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-stone-400" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>পেমেন্ট</span>
                                <span className="text-amber-300 text-xs" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                                    {PAYMENT_METHODS.find((p) => p.id === selectedPayment)?.label}
                                </span>
                            </div>
                            <div className="border-t border-white/6 pt-2 flex justify-between">
                                <span className="text-white font-bold text-sm" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>মোট</span>
                                <span className="text-amber-400 font-bold text-lg" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>৳{finalAmount.toLocaleString("bn-BD")}</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep(2)}
                                className="flex-1 py-3 rounded-full border border-white/10 text-stone-400 text-sm hover:border-white/20 transition-all"
                                style={{ fontFamily: "'Noto Serif Bengali', serif" }}
                            >
                                ← আগে
                            </button>
                            <button
                                onClick={() => setStep(4)}
                                className="flex-[2] py-3 rounded-full font-bold text-sm text-[#0d1f1e] hover:scale-[1.01] hover:shadow-lg hover:shadow-amber-500/20 transition-all"
                                style={{ background: "linear-gradient(90deg, #f59e0b, #ea580c)", fontFamily: "'Noto Serif Bengali', serif" }}
                            >
                                🙏 দান নিশ্চিত করুন
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Step 4: Success ── */}
                {step === 4 && (
                    <div className="py-10 flex flex-col items-center text-center gap-4" style={{ animation: "fadeUp 0.5s ease both" }}>
                        <div
                            className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
                            style={{ background: "rgba(245,158,11,0.15)", border: "2px solid rgba(245,158,11,0.3)", animation: "pulseBadge 2s ease-in-out 3" }}
                        >
                            🙏
                        </div>
                        <h4 className="text-2xl font-bold text-white" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                            অনেক ধন্যবাদ!
                        </h4>
                        <p className="text-stone-400 text-sm max-w-xs leading-relaxed" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                            আপনার ৳{finalAmount.toLocaleString("bn-BD")} দান সফলভাবে নিবন্ধিত হয়েছে। আমরা শীঘ্রই রসিদ পাঠাব।
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center mt-2">
                            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-300 text-xs" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                                {CAUSES.find((c) => c.id === selectedCause)?.icon} {CAUSES.find((c) => c.id === selectedCause)?.label}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-teal-500/10 border border-teal-400/20 text-teal-300 text-xs" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                                {PAYMENT_METHODS.find((p) => p.id === selectedPayment)?.label}
                            </span>
                        </div>
                        <button
                            onClick={() => { setStep(1); setSelectedTier(1); setUseCustom(false); setCustomAmount(""); }}
                            className="mt-4 px-6 py-2.5 rounded-full border border-amber-400/30 text-amber-300 text-sm hover:bg-amber-500/10 transition-all"
                            style={{ fontFamily: "'Noto Serif Bengali', serif" }}
                        >
                            আরেকটি দান করুন
                        </button>
                    </div>
                )}
            </div>

            <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulseBadge { 0%,100% { box-shadow:0 0 0 0 rgba(245,158,11,0.4); } 50% { box-shadow:0 0 0 16px rgba(245,158,11,0); } }
      `}</style>
        </div>
    );
}

// ─── Impact Stats ─────────────────────────────────────────────────────────────

function ImpactStats() {
    const [ref, visible] = useReveal();
    return (
        <div ref={ref} className="grid grid-cols-2 gap-4 mb-6">
            {IMPACT_STATS.map((s, i) => (
                <div
                    key={s.label}
                    className="bg-white/4 rounded-2xl border border-white/8 p-4 text-center hover:border-amber-400/20 transition-all duration-300"
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? "none" : "translateY(20px)",
                        transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`,
                    }}
                >
                    <div className="text-2xl mb-1">{s.icon}</div>
                    <div className="text-amber-400 font-bold text-xl" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>{s.val}</div>
                    <div className="text-stone-500 text-xs" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>{s.label}</div>
                </div>
            ))}
        </div>
    );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({ scrolled }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const NAV_LINKS = [
        { label: "হোম", href: "/" },
        { label: "আমাদের পরিচয়", href: "/about" },
        { label: "কার্যক্রম", href: "/programs" },
        { label: "সেবামূলক", href: "/service" },
        { label: "যোগাযোগ", href: "/contact" },
    ];
    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#0d1f1e]/95 backdrop-blur-md shadow-lg shadow-black/30" : "bg-transparent"}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                <a href="/" className="flex items-center gap-2 group">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">🕉️</div>
                    <div>
                        <div className="text-amber-400 font-bold text-xs leading-tight" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>আনন্দমার্গ</div>
                        <div className="text-teal-300/70 text-[10px] tracking-widest uppercase">Bangladesh</div>
                    </div>
                </a>
                <div className="hidden md:flex items-center gap-6 lg:gap-8">
                    {NAV_LINKS.map((l) => (
                        <a key={l.label} href={l.href} className="text-stone-300 hover:text-amber-400 text-sm transition-colors relative group" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                            {l.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-px bg-amber-400 group-hover:w-full transition-all duration-300" />
                        </a>
                    ))}
                    <a href="/donate" className="px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-[#0d1f1e] font-bold text-sm transition-all hover:scale-105" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>দান করুন</a>
                </div>
                <button className="md:hidden text-stone-300 p-1" onClick={() => setMenuOpen(!menuOpen)}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                    </svg>
                </button>
            </div>
            <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="bg-[#0d1f1e]/98 backdrop-blur-md border-t border-amber-500/20 px-6 py-4 flex flex-col gap-3">
                    {NAV_LINKS.map((l) => (
                        <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)} className="text-stone-300 hover:text-amber-400 py-1.5 text-sm border-b border-white/5 last:border-0" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>{l.label}</a>
                    ))}
                    <a href="/donate" className="mt-2 px-4 py-2.5 rounded-full bg-amber-500 text-[#0d1f1e] font-bold text-sm text-center" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>দান করুন</a>
                </div>
            </div>
        </nav>
    );
}

function Footer() {
    return (
        <footer className="bg-[#080f0e] border-t border-white/5 py-8 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">🕉️</span>
                    <div>
                        <div className="text-amber-400 font-bold text-sm" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>আনন্দমার্গ প্রচারক সংঘ</div>
                        <div className="text-stone-500 text-xs">Bangladesh</div>
                    </div>
                </div>
                <p className="text-stone-600 text-xs text-center" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>© ২০২৫ আনন্দমার্গ বাংলাদেশ। সর্বস্বত্ব সংরক্ষিত।</p>
                <div className="flex gap-4 text-stone-500 text-xs" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                    <a href="#" className="hover:text-amber-400 transition-colors">গোপনীয়তা নীতি</a>
                    <a href="/contact" className="hover:text-amber-400 transition-colors">যোগাযোগ</a>
                </div>
            </div>
        </footer>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DonationPage() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="min-h-screen" style={{ background: "#0d1f1e" }}>
            <link
                href="https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@400;600;700&display=swap"
                rel="stylesheet"
            />

            <Navbar scrolled={scrolled} />

            {/* Hero */}
            <section
                className="relative pt-28 sm:pt-32 pb-16 px-4 sm:px-6 overflow-hidden"
                style={{ background: "linear-gradient(135deg, #0d1f1e 0%, #0f2a28 60%, #1a1205 100%)" }}
            >
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-amber-500/8 blur-3xl" />
                    <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
                        <defs><pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#f59e0b" /></pattern></defs>
                        <rect width="100%" height="100%" fill="url(#dots)" />
                    </svg>
                </div>
                <div className="relative max-w-2xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-300 text-xs tracking-widest uppercase mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        দান ও অনুদান
                    </div>
                    <h1
                        className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight"
                        style={{ fontFamily: "'Noto Serif Bengali', serif", animation: "fadeUp 0.7s ease both" }}
                    >
                        আপনার দানে
                        <br />
                        <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(90deg, #f59e0b, #ea580c)" }}>
                            বদলাবে জীবন
                        </span>
                    </h1>
                    <p
                        className="text-stone-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed"
                        style={{ fontFamily: "'Noto Serif Bengali', serif", animation: "fadeUp 0.7s ease 0.2s both" }}
                    >
                        আপনার ছোট্ট অবদান একটি পরিবারের মুখে হাসি ফোটাতে পারে। আজই দান করুন।
                    </p>
                </div>
                <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }`}</style>
            </section>

            {/* Main content */}
            <section className="py-12 sm:py-20 px-4 sm:px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
                        {/* Left — form */}
                        <div className="lg:col-span-3">
                            <DonationForm />
                        </div>

                        {/* Right — impact */}
                        <div className="lg:col-span-2">
                            <div className="sticky top-24">
                                <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                                    আপনার দানের প্রভাব
                                </h3>
                                <ImpactStats />

                                {/* Trust badges */}
                                <div className="bg-white/4 rounded-2xl border border-white/8 p-5 space-y-3">
                                    <p className="text-stone-500 text-xs mb-3" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>আমরা বিশ্বাসযোগ্য কারণ</p>
                                    {[
                                        { icon: "🔒", text: "১০০% নিরাপদ পেমেন্ট" },
                                        { icon: "📊", text: "সম্পূর্ণ আর্থিক স্বচ্ছতা" },
                                        { icon: "🧾", text: "প্রতিটি দানের রসিদ" },
                                        { icon: "🏛️", text: "সরকার অনুমোদিত সংগঠন" },
                                    ].map((b) => (
                                        <div key={b.text} className="flex items-center gap-3">
                                            <span className="text-base">{b.icon}</span>
                                            <span className="text-stone-400 text-xs" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>{b.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
            <MusicPlayer src="/audio/baba-nam-kevalam.mp3" />
        </div>
    );
}