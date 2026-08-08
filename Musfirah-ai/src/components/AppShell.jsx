import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bot,
  BrainCircuit,
  FileUser,
  Fingerprint,
  LayoutDashboard,
  PanelsTopLeft,
  Send,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Link, NavLink, useRouter } from '../routing/Router';
import AIAssistant from './AIAssistant';
import CursorGlow from './CursorGlow';

const navigation = [
  { to: '/', label: 'Command', icon: LayoutDashboard, end: true },
  { to: '/about', label: 'Identity', icon: Fingerprint },
  { to: '/projects', label: 'Work', icon: PanelsTopLeft },
  { to: '/workspace', label: 'AI Lab', icon: BrainCircuit },
  { to: '/resume', label: 'Resume', icon: FileUser },
  { to: '/contact', label: 'Contact', icon: Send },
];

export default function AppShell({ children }) {
  const { pathname } = useRouter();
  const { assistantOpen, setAssistantOpen, soundEnabled, setSoundEnabled } = useApp();
  const [clock, setClock] = useState(() => new Date());
  const flyRankVerificationUrl = import.meta.env.VITE_FLYRANK_VERIFICATION_URL
    || 'https://aifluency.flyrank.ai/';

  useEffect(() => {
    const timer = window.setInterval(() => setClock(new Date()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="app-shell isolate">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="cosmic-noise" aria-hidden="true" />
      <div className="ambient-orb orb-one" aria-hidden="true" />
      <div className="ambient-orb orb-two" aria-hidden="true" />
      <CursorGlow />

      <header className="top-bar">
        <Link to="/" className="system-mark" aria-label="Musfirah AI OS home">
          <span className="system-glyph">M</span>
          <span className="system-copy">
            <strong>M/AI.OS</strong>
            <small>PORTFOLIO KERNEL · 2026</small>
          </span>
        </Link>

        <div className="top-status" aria-label="System status">
          <span className="status-pill"><i /> Available for opportunities</span>
          <span className="clock">PKT {clock.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <button
            className="icon-button"
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            aria-label={soundEnabled ? 'Disable interface sound' : 'Enable interface sound'}
          >
            {soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
          </button>
        </div>
      </header>

      <aside className="side-rail" aria-label="Primary navigation">
        <nav>
          {navigation.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `rail-link ${isActive ? 'active' : ''}`}
              aria-label={label}
            >
              <Icon size={18} strokeWidth={1.7} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <span className="rail-index">{String(Math.max(0, navigation.findIndex((item) => item.to === pathname)) + 1).padStart(2, '0')}</span>
      </aside>

      <main id="main-content" className="main-stage">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, filter: 'blur(5px)' }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="route-frame"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="launch-footer" aria-label="Launch verification">
        <span className="launch-status"><i /> HTTPS · ANALYTICS ACTIVE</span>
        <a
          className="flyrank-badge"
          href={flyRankVerificationUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="View Musfirah Shakeel's FlyRank graduate verification"
        >
          <span aria-hidden="true">FR</span>
          <span><small>FLYRANK</small><strong>GRADUATE</strong></span>
        </a>
      </footer>

      <button
        className={`assistant-trigger ${assistantOpen ? 'active' : ''}`}
        type="button"
        onClick={() => setAssistantOpen(!assistantOpen)}
        aria-expanded={assistantOpen}
        aria-controls="portfolio-assistant"
      >
        <span className="assistant-trigger-icon">{assistantOpen ? <BrainCircuit size={19} /> : <Bot size={19} />}</span>
        <span>
          <small>ASK PORTFOLIO AI</small>
          <strong>{assistantOpen ? 'Assistant active' : 'Open assistant'}</strong>
        </span>
      </button>

      <AIAssistant />
    </div>
  );
}
