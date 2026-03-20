// src/components/common/MusicPlayer.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Floating background music player for Ananda Marga Bangladesh
// Usage: <MusicPlayer src="/audio/baba-nam-kevalam.mp3" />
// Place the .mp3 file in: frontend/public/audio/baba-nam-kevalam.mp3
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from "react";

export default function MusicPlayer({ src = "/audio/baba-nam-kevalam.mp3" }) {
    const audioRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(0.3);
    const [showVolume, setShowVolume] = useState(false);
    const [, setReady] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    // Auto-play on first user interaction anywhere on the page
    useEffect(() => {
        const handleFirstInteraction = () => {
            if (!hasInteracted && audioRef.current) {
                audioRef.current.volume = volume;
                audioRef.current
                    .play()
                    .then(() => {
                        setPlaying(true);
                        setHasInteracted(true);
                    })
                    .catch(() => {
                        // Autoplay blocked, user must click the button
                        setHasInteracted(true);
                    });
            }
            document.removeEventListener("click", handleFirstInteraction);
            document.removeEventListener("keydown", handleFirstInteraction);
            document.removeEventListener("touchstart", handleFirstInteraction);
        };

        document.addEventListener("click", handleFirstInteraction);
        document.addEventListener("keydown", handleFirstInteraction);
        document.addEventListener("touchstart", handleFirstInteraction);

        return () => {
            document.removeEventListener("click", handleFirstInteraction);
            document.removeEventListener("keydown", handleFirstInteraction);
            document.removeEventListener("touchstart", handleFirstInteraction);
        };
    }, [hasInteracted, volume]);

    const togglePlay = (e) => {
        e.stopPropagation();
        if (!audioRef.current) return;
        if (playing) {
            audioRef.current.pause();
            setPlaying(false);
        } else {
            audioRef.current.volume = volume;
            audioRef.current.play().then(() => setPlaying(true)).catch(() => { });
        }
    };

    const handleVolume = (e) => {
        const val = parseFloat(e.target.value);
        setVolume(val);
        if (audioRef.current) audioRef.current.volume = val;
    };

    return (
        <>
            <audio
                ref={audioRef}
                src={src}
                loop
                preload="auto"
                onCanPlay={() => setReady(true)}
            />

            {/* Floating player — bottom-right corner */}
            <div
                style={{
                    position: "fixed",
                    bottom: "24px",
                    right: "24px",
                    zIndex: 999,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: "8px",
                    fontFamily: "'Noto Serif Bengali', serif",
                }}
            >
                {/* Volume slider (shown on hover/click) */}
                {showVolume && (
                    <div
                        style={{
                            background: "rgba(13,31,30,0.95)",
                            border: "1px solid rgba(245,158,11,0.25)",
                            borderRadius: "12px",
                            padding: "12px 14px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "6px",
                            backdropFilter: "blur(10px)",
                            animation: "fadeUpSmall 0.2s ease",
                        }}
                    >
                        <span style={{ color: "#fbbf24", fontSize: "10px", letterSpacing: "1px" }}>
                            VOLUME
                        </span>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={volume}
                            onChange={handleVolume}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                writingMode: "vertical-lr",
                                direction: "rtl",
                                width: "4px",
                                height: "70px",
                                cursor: "pointer",
                                accentColor: "#f59e0b",
                            }}
                        />
                        <span style={{ color: "#78716c", fontSize: "10px" }}>
                            {Math.round(volume * 100)}%
                        </span>
                    </div>
                )}

                {/* Main button */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {/* Volume toggle */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowVolume((v) => !v);
                        }}
                        title="Volume"
                        style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            background: "rgba(13,31,30,0.85)",
                            border: "1px solid rgba(245,158,11,0.2)",
                            color: "#78716c",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backdropFilter: "blur(8px)",
                            transition: "all 0.2s",
                            fontSize: "14px",
                        }}
                    >
                        🔊
                    </button>

                    {/* Play/Pause button */}
                    <button
                        onClick={togglePlay}
                        title={playing ? "Pause" : "Play Baba Nam Kevalam"}
                        style={{
                            width: "52px",
                            height: "52px",
                            borderRadius: "50%",
                            background: playing
                                ? "linear-gradient(135deg, #f59e0b, #ea580c)"
                                : "rgba(13,31,30,0.9)",
                            border: playing
                                ? "2px solid rgba(245,158,11,0.6)"
                                : "1px solid rgba(245,158,11,0.3)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backdropFilter: "blur(10px)",
                            transition: "all 0.3s ease",
                            boxShadow: playing
                                ? "0 0 20px rgba(245,158,11,0.35)"
                                : "0 4px 12px rgba(0,0,0,0.3)",
                            transform: "scale(1)",
                            fontSize: "20px",
                            position: "relative",
                            overflow: "hidden",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    >
                        {/* Ripple ring when playing */}
                        {playing && (
                            <span
                                style={{
                                    position: "absolute",
                                    inset: "-4px",
                                    borderRadius: "50%",
                                    border: "2px solid rgba(245,158,11,0.3)",
                                    animation: "ripple 1.5s ease-out infinite",
                                }}
                            />
                        )}
                        {playing ? "⏸" : "🎵"}
                    </button>
                </div>

                {/* Label */}
                {playing && (
                    <div
                        style={{
                            background: "rgba(13,31,30,0.85)",
                            border: "1px solid rgba(245,158,11,0.15)",
                            borderRadius: "999px",
                            padding: "4px 12px",
                            color: "#fbbf24",
                            fontSize: "11px",
                            letterSpacing: "0.5px",
                            backdropFilter: "blur(8px)",
                            animation: "fadeIn 0.4s ease",
                            whiteSpace: "nowrap",
                        }}
                    >
                        🕉️ বাবা নাম কেবলম্
                    </div>
                )}
            </div>

            <style>{`
        @keyframes ripple {
          0%   { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes fadeUpSmall {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
        </>
    );
}