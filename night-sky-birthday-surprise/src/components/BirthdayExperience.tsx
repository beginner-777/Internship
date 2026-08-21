"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Fireworks, ConstellationText, WishEffect } from "./Effects";
import { Moon, NightSky } from "./Atmosphere";

type Phase =
  | "initial"
  | "moonClicked"
  | "starsFormMessage"
  | "fireworks"
  | "birthdayReveal"
  | "wishMode";

const MESSAGE_LINES = [
  "Wishing you a wonderful birthday filled with happiness, laughter, success and countless beautiful moments.",
  "May this new chapter of your life bring you more reasons to smile, more moments to celebrate, and many beautiful memories to cherish.",
  "You're a wonderful part of our family, and today is a perfect reason to celebrate the amazing person you are.",
  "May your year ahead shine as brightly as the stars tonight. ✨",
];

const PHASE_COPY: Record<Phase, string> = {
  initial: "The night is waiting for you",
  moonClicked: "A little moonlight is stirring…",
  starsFormMessage: "The stars are finding their places…",
  fireworks: "Tonight, the sky celebrates you",
  birthdayReveal: "A birthday wish, written in starlight",
  wishMode: "Gathering every wish…",
};

function Icon({ name }: { name: "sound" | "mute" | "sparkle" | "arrow" }) {
  if (name === "sound") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M11 5 6.8 8.5H3.5v7h3.3L11 19V5Z" />
        <path d="M15 8.4a5 5 0 0 1 0 7.2M17.8 5.8a8.6 8.6 0 0 1 0 12.4" />
      </svg>
    );
  }
  if (name === "mute") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M11 5 6.8 8.5H3.5v7h3.3L11 19V5Z" />
        <path d="m15.3 9.3 5.4 5.4M20.7 9.3l-5.4 5.4" />
      </svg>
    );
  }
  if (name === "arrow") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 12h10M13 8l4 4-4 4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2c.6 5.9 4.1 9.4 10 10-5.9.6-9.4 4.1-10 10-.6-5.9-4.1-9.4-10-10 5.9-.6 9.4-4.1 10-10Z" />
    </svg>
  );
}

function MusicControl({ muted, needsTap, onToggle }: { muted: boolean; needsTap: boolean; onToggle: () => void }) {
  return (
    <motion.button
      type="button"
      className="music-control"
      onClick={onToggle}
      aria-label={muted || needsTap ? "Play birthday music" : "Mute birthday music"}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <span className={`music-bars ${muted ? "is-muted" : ""}`}><i /><i /><i /></span>
      <Icon name={muted || needsTap ? "mute" : "sound"} />
      <span>{needsTap ? "Tap for music" : muted ? "Music off" : "Birthday music"}</span>
    </motion.button>
  );
}

function BirthdayMessage({ onWish }: { onWish: () => void }) {
  return (
    <div className="card-shell">
      <motion.section
        className="birthday-card"
        initial={{ opacity: 0, y: 70, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97, filter: "blur(5px)" }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        aria-labelledby="birthday-heading"
      >
        <div className="card-orbit" aria-hidden="true"><i /><i /><i /></div>
        <motion.p
          className="card-eyebrow"
          initial={{ opacity: 0, letterSpacing: "0.3em" }}
          animate={{ opacity: 1, letterSpacing: "0.18em" }}
          transition={{ delay: 0.45, duration: 0.8 }}
        >
          TO A WONDERFUL BROTHER-IN-LAW
        </motion.p>
        <motion.h1
          id="birthday-heading"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.75 }}
        >
          Happy Birthday! <span>🎂✨</span>
        </motion.h1>
        <div className="message-lines">
          {MESSAGE_LINES.map((line, index) => (
            <motion.p
              key={line}
              initial={{ opacity: 0, y: 12, filter: "blur(5px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 1.8 + index * 1.25, duration: 0.75, ease: "easeOut" }}
            >
              {line}
            </motion.p>
          ))}
        </div>
        <motion.div
          className="card-finale"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 7, duration: 0.8 }}
        >
          <strong>Have a truly amazing birthday! 🎉</strong>
          <button type="button" onClick={onWish}>
            <Icon name="sparkle" />
            Make a Wish
            <Icon name="arrow" />
          </button>
        </motion.div>
      </motion.section>
    </div>
  );
}

export default function BirthdayExperience() {
  const [phase, setPhase] = useState<Phase>("initial");
  const [muted, setMuted] = useState(false);
  const [needsAudioTap, setNeedsAudioTap] = useState(false);
  const stageRef = useRef<HTMLElement>(null);
  const timersRef = useRef<number[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const started = phase !== "initial";
  const constellationVisible = ["starsFormMessage", "fireworks", "birthdayReveal"].includes(phase);
  const fireworksActive = ["fireworks", "birthdayReveal"].includes(phase);

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach(window.clearTimeout);
      audioRef.current?.pause();
    };
  }, []);

  const begin = useCallback(() => {
    if (phase !== "initial") return;
    setPhase("moonClicked");
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.volume = 0.78;
      audio.muted = false;
      void audio.play().then(() => setNeedsAudioTap(false)).catch(() => setNeedsAudioTap(true));
    }
    setMuted(false);
    timersRef.current.push(
      window.setTimeout(() => setPhase("starsFormMessage"), 900),
      window.setTimeout(() => setPhase("fireworks"), 5700),
      window.setTimeout(() => setPhase("birthdayReveal"), 8000),
    );
  }, [phase]);

  const toggleMusic = useCallback(() => {
    setMuted((current) => {
      const audio = audioRef.current;
      if (!audio) return current;
      if (current || needsAudioTap) {
        audio.muted = false;
        audio.volume = 0.78;
        void audio.play().then(() => setNeedsAudioTap(false)).catch(() => setNeedsAudioTap(true));
        return false;
      }
      audio.muted = true;
      return true;
    });
  }, [needsAudioTap]);

  const makeWish = useCallback(() => {
    setPhase("wishMode");
    timersRef.current.push(window.setTimeout(() => setPhase("birthdayReveal"), 6500));
  }, []);

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLElement>) => {
    const stage = stageRef.current;
    if (!stage) return;
    const x = event.clientX / window.innerWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;
    stage.style.setProperty("--mx", `${x * 18}px`);
    stage.style.setProperty("--my", `${y * 14}px`);
  }, []);

  return (
    <main
      ref={stageRef}
      className={`experience phase-${phase}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        stageRef.current?.style.setProperty("--mx", "0px");
        stageRef.current?.style.setProperty("--my", "0px");
      }}
    >
      <audio ref={audioRef} src="/audio/happy-birthday.wav" preload="auto" loop aria-hidden="true" />
      <NightSky celebrating={fireworksActive} />
      <div className="burst-flash" aria-hidden="true" />

      <header className="topbar">
        <div className="brand-mark"><span>✦</span> A NIGHT WRITTEN IN STARS</div>
        <div className="phase-status"><i />{PHASE_COPY[phase]}</div>
      </header>

      <Moon activated={started} onActivate={begin} />

      <AnimatePresence>
        {!started && (
          <motion.section
            className="opening-copy"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
            transition={{ duration: 1.1 }}
          >
            <p><span /> SOMETHING BEAUTIFUL IS ABOUT TO BEGIN</p>
            <h1>Tonight, the stars have<br className="opening-break" />something special to say<span>…</span></h1>
            <button type="button" onClick={begin}>
              Look at the moon <span>🌙</span>
              <i><Icon name="arrow" /></i>
            </button>
          </motion.section>
        )}
      </AnimatePresence>

      <ConstellationText visible={constellationVisible} />
      <Fireworks active={fireworksActive} />
      <AnimatePresence>
        {phase === "birthdayReveal" && <BirthdayMessage onWish={makeWish} />}
      </AnimatePresence>
      {started && <MusicControl muted={muted} needsTap={needsAudioTap} onToggle={toggleMusic} />}
      <WishEffect active={phase === "wishMode"} />

      <footer className="sky-footer">
        <span>✦</span>
        <p>MADE WITH A LITTLE MOONLIGHT<br />AND A LOT OF WARM WISHES</p>
        <span>✦</span>
      </footer>
      <p className="sr-only" aria-live="polite">{PHASE_COPY[phase]}</p>
    </main>
  );
}
