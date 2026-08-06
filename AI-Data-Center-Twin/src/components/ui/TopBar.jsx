import React from 'react';
import { m } from 'framer-motion';
import { FiCpu, FiVolume2, FiVolumeX } from 'react-icons/fi';
import { useStore, WORKLOAD_MODES, MODE_PROFILES } from '../../store/useStore';

const MODE_ORDER = Object.values(WORKLOAD_MODES);

export default function TopBar() {
  const workloadMode = useStore((s) => s.workloadMode);
  const setWorkloadMode = useStore((s) => s.setWorkloadMode);
  const muted = useStore((s) => s.muted);
  const toggleMuted = useStore((s) => s.toggleMuted);

  return (
    <m.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-col gap-2 px-3 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:p-5"
    >
      <div className="glass-panel pointer-events-auto flex items-center gap-2 rounded-full px-4 py-2 shadow-glow">
        <FiCpu className="text-cyan-glow" size={16} aria-hidden="true" />
        <span className="font-display text-xs tracking-widest text-white/90">AI DATA CENTER · TWIN</span>
      </div>

      <div className="pointer-events-auto twin-scroll flex w-full items-center gap-2 overflow-x-auto rounded-full px-2 py-1.5 glass-panel sm:w-auto">
        {MODE_ORDER.map((mode) => {
          const active = workloadMode === mode;
          const profile = MODE_PROFILES[mode];
          return (
            <button
              key={mode}
              type="button"
              onClick={() => setWorkloadMode(mode)}
              aria-pressed={active}
              className={`focus-ring whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-medium transition-all ${
                active
                  ? 'bg-cyan-glow/20 text-cyan-glow shadow-glow'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`}
              style={active ? { boxShadow: `0 0 14px ${profile.ledColor}55` } : undefined}
            >
              {profile.label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={toggleMuted}
          aria-label={muted ? 'Unmute ambient audio' : 'Mute ambient audio'}
          className="focus-ring ml-1 rounded-full p-2 text-white/60 hover:bg-white/5 hover:text-white"
        >
          {muted ? <FiVolumeX size={14} /> : <FiVolume2 size={14} />}
        </button>
      </div>
    </m.div>
  );
}
