import { useState, useEffect, useRef } from "react";

export default function MusicPlayer({ src = "/audio/baba-nam-kevalam.mp3" }) {
    const audioRef = useRef(null);
    const interacted = useRef(false);
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(0.3);
    const [showVol, setShowVol] = useState(false);

    useEffect(() => {
        const start = () => {
            if (interacted.current || !audioRef.current) return;
            interacted.current = true;
            audioRef.current.volume = volume;
            audioRef.current.play().then(() => setPlaying(true)).catch(() => { });
            ["click", "keydown", "touchstart"].forEach((e) => document.removeEventListener(e, start));
        };
        ["click", "keydown", "touchstart"].forEach((e) => document.addEventListener(e, start));
        return () => ["click", "keydown", "touchstart"].forEach((e) => document.removeEventListener(e, start));
    }, []);

    const toggle = (e) => {
        e.stopPropagation();
        if (!audioRef.current) return;
        if (playing) { audioRef.current.pause(); setPlaying(false); }
        else { audioRef.current.volume = volume; audioRef.current.play().then(() => setPlaying(true)).catch(() => { }); }
    };

    const changeVolume = (e) => {
        const v = parseFloat(e.target.value);
        setVolume(v);
        if (audioRef.current) audioRef.current.volume = v;
    };

    return (
        <>
            <audio ref={audioRef} src={src} loop preload="auto" />
            <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 999, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>

                {/* Volume slider */}
                {showVol && (
                    <div style={{ background: "rgba(13,31,30,0.95)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 12, padding: "12px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, backdropFilter: "blur(10px)" }}>
                        <span style={{ color: "#fbbf24", fontSize: 10, letterSpacing: 1 }}>VOL</span>
                        <input type="range" min="0" max="1" step="0.05" value={volume} onChange={changeVolume}
                            onClick={(e) => e.stopPropagation()}
                            style={{ writingMode: "vertical-lr", direction: "rtl", width: 4, height: 70, accentColor: "#f59e0b", cursor: "pointer" }} />
                        <span style={{ color: "#78716c", fontSize: 10 }}>{Math.round(volume * 100)}%</span>
                    </div>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {/* Volume btn */}
                    <button type="button" onClick={(e) => { e.stopPropagation(); setShowVol((v) => !v); }}
                        style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(13,31,30,0.85)", border: "1px solid rgba(245,158,11,0.2)", color: "#78716c", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
                        🔊
                    </button>

                    {/* Play/Pause btn */}
                    <button type="button" onClick={toggle}
                        style={{
                            width: 52, height: 52, borderRadius: "50%", cursor: "pointer",
                            background: playing ? "linear-gradient(135deg,#f59e0b,#ea580c)" : "rgba(13,31,30,0.9)",
                            border: playing ? "2px solid rgba(245,158,11,0.6)" : "1px solid rgba(245,158,11,0.3)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 20, position: "relative", overflow: "hidden",
                            boxShadow: playing ? "0 0 20px rgba(245,158,11,0.35)" : "0 4px 12px rgba(0,0,0,0.3)",
                            transition: "all 0.3s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    >
                        {playing && <span style={{ position: "absolute", inset: -4, borderRadius: "50%", border: "2px solid rgba(245,158,11,0.3)", animation: "ripple 1.5s ease-out infinite" }} />}
                        {playing ? "⏸" : "🎵"}
                    </button>
                </div>

                {/* Label */}
                {playing && (
                    <div style={{ background: "rgba(13,31,30,0.85)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: 999, padding: "4px 12px", color: "#fbbf24", fontSize: 11, whiteSpace: "nowrap", fontFamily: "'Noto Serif Bengali', serif" }}>
                        🕉️ বাবা নাম কেবলম্
                    </div>
                )}
            </div>
            <style>{`@keyframes ripple{0%{transform:scale(1);opacity:.6}100%{transform:scale(1.6);opacity:0}}`}</style>
        </>
    );
}