import { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";

const DRAFT_KEY = "writing-sanctuary:draft";
const THEME_KEY = "writing-sanctuary:theme";
const IDLE_DELAY = 1500; // ms of no typing before chrome fades back in
const RAIN_VOLUME = 0.16; // target gain, kept low and unobtrusive
const RAIN_FADE = 1.4; // seconds to fade rain in/out

// Small helpers so every browser-storage call is guarded in one place.
// If localStorage is unavailable (private browsing, SSR, older browser
// permissions, etc.) these quietly no-op instead of throwing.
function safeGet(key) {
  try {
    if (typeof window === "undefined" || !window.localStorage) return null;
    return window.localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

function safeSet(key, value) {
  try {
    if (typeof window === "undefined" || !window.localStorage) return false;
    window.localStorage.setItem(key, value);
    return true;
  } catch (e) {
    return false;
  }
}

export default function WritingPage() {
  const [theme, setTheme] = useState("typewriter");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [rainOn, setRainOn] = useState(false);

  const saveTimer = useRef(null);
  const statusTimer = useRef(null);
  const idleTimer = useRef(null);

  // Web Audio nodes for the synthesized rain bed, built lazily on first play
  const audioCtxRef = useRef(null);
  const rainGainRef = useRef(null);
  const rainNodesRef = useRef(null);

  // Load any saved draft + theme once, on mount only.
  useEffect(() => {
    const savedDraft = safeGet(DRAFT_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setTitle(parsed.title || "");
        setText(parsed.text || "");
      } catch (e) {
        // corrupted draft data, ignore and start fresh
      }
    }

    const savedTheme = safeGet(THEME_KEY);
    if (savedTheme === "midnight" || savedTheme === "typewriter") {
      setTheme(savedTheme);
    }
  }, []);

  // Debounced autosave whenever title/text change. Self-contained: reads
  // only from local component state and writes only through safeSet.
  useEffect(() => {
    setStatus("Saving…");
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const ok = safeSet(DRAFT_KEY, JSON.stringify({ title, text }));
      setStatus(ok ? "Saved" : "Couldn't save");
      clearTimeout(statusTimer.current);
      statusTimer.current = setTimeout(() => setStatus(""), 1800);
    }, 600);

    return () => clearTimeout(saveTimer.current);
  }, [title, text]);

  // Clean up any pending timers on unmount.
  useEffect(() => {
    return () => {
      clearTimeout(saveTimer.current);
      clearTimeout(statusTimer.current);
      clearTimeout(idleTimer.current);
    };
  }, []);

  // Fade chrome out the moment typing starts, back in once idle.
  const registerActivity = useCallback(() => {
    setIsTyping(true);
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setIsTyping(false), IDLE_DELAY);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === "typewriter" ? "midnight" : "typewriter";
      safeSet(THEME_KEY, next);
      return next;
    });
  }, []);

  // Build a soft, endless rainfall bed out of filtered noise the first time
  // the writer turns it on. No external audio file — everything is
  // generated in-browser, so there's nothing to fetch and nothing to break.
  const ensureRainGraph = useCallback(() => {
    if (rainNodesRef.current) return;
    if (typeof window === "undefined") return;

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return; // environment has no Web Audio support; skip silently

    const ctx = audioCtxRef.current || new AudioCtx();
    audioCtxRef.current = ctx;

    const bufferSeconds = 3;
    const buffer = ctx.createBuffer(
      1,
      bufferSeconds * ctx.sampleRate,
      ctx.sampleRate
    );
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const highpass = ctx.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = 300;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 2600;

    // A very slow LFO breathes the tone gently, like passing gusts.
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 500;
    lfo.connect(lfoGain);
    lfoGain.connect(lowpass.frequency);

    const rainGain = ctx.createGain();
    rainGain.gain.value = 0;

    noise.connect(highpass);
    highpass.connect(lowpass);
    lowpass.connect(rainGain);
    rainGain.connect(ctx.destination);

    noise.start();
    lfo.start();

    rainGainRef.current = rainGain;
    rainNodesRef.current = { noise, lfo };
  }, []);

  const toggleRain = useCallback(async () => {
    const next = !rainOn;
    setRainOn(next);

    ensureRainGraph();
    const ctx = audioCtxRef.current;
    const gain = rainGainRef.current;
    if (!ctx || !gain) return; // Web Audio unsupported; toggle is a visual no-op

    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch (e) {
        // if this fails the toggle simply won't produce sound
      }
    }

    const now = ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(next ? RAIN_VOLUME : 0, now + RAIN_FADE);
  }, [rainOn, ensureRainGraph]);

  // Stop everything cleanly if the component unmounts mid-rain.
  useEffect(() => {
    return () => {
      const nodes = rainNodesRef.current;
      const ctx = audioCtxRef.current;
      if (nodes) {
        try {
          nodes.noise.stop();
          nodes.lfo.stop();
        } catch (e) {
          // already stopped
        }
      }
      if (ctx) ctx.close();
    };
  }, []);

  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const chromeClass = `wp-header${isTyping ? " wp-chrome-hidden" : ""}`;
  const dividerClass = `wp-divider${isTyping ? " wp-chrome-hidden" : ""}`;
  const footerClass = `wp-footer${isTyping ? " wp-chrome-hidden" : ""}`;

  return (
    <div className="wp-root" data-theme={theme}>
      <div className="wp-container">
        <div className={chromeClass}>
          <button
            onClick={toggleRain}
            aria-label={rainOn ? "Turn rain sound off" : "Turn rain sound on"}
            aria-pressed={rainOn}
            title={rainOn ? "Rain: on" : "Rain: off"}
            className={`wp-icon-btn${rainOn ? " wp-active" : ""}`}
          >
            {/* Rain cloud icon, inline SVG, no external library */}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6 14.5a4.5 4.5 0 0 1 .8-8.94 6 6 0 0 1 11.4 1.98A4 4 0 0 1 18 15H7.5Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path
                d="M8 18.5 7 20.5M12 18.5 11 20.5M16 18.5 15 20.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <span className={`wp-status${status ? " wp-visible" : ""}`}>
            {status || "—"}
          </span>

          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "typewriter" ? "midnight" : "typewriter"} theme`}
            className={`wp-theme-toggle${theme === "typewriter" ? " wp-theme-typewriter" : ""}`}
          >
            <span
              className={`wp-toggle-knob${theme === "midnight" ? " wp-shifted" : ""}`}
            >
              {theme === "typewriter" ? (
                // Sun icon, inline SVG
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
                  <path
                    d="M12 2.5v2.4M12 19.1v2.4M21.5 12h-2.4M4.9 12H2.5M18.4 5.6l-1.7 1.7M7.3 16.7l-1.7 1.7M18.4 18.4l-1.7-1.7M7.3 7.3 5.6 5.6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                // Moon icon, inline SVG
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M20 14.2A8.5 8.5 0 1 1 9.8 4a6.7 6.7 0 0 0 10.2 10.2Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
          </button>
        </div>

        <input
          className="wp-title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            registerActivity();
          }}
          placeholder="Untitled"
        />

        <div className={dividerClass} />

        <textarea
          className="wp-textarea"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            registerActivity();
          }}
          placeholder="Begin where you are…"
          rows={18}
        />

        <div className={footerClass}>
          {wordCount} {wordCount === 1 ? "word" : "words"}
        </div>
      </div>
    </div>
  );
}