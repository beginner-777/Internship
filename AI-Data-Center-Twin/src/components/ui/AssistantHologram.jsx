import React from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { FiCpu, FiX } from 'react-icons/fi';
import { useStore } from '../../store/useStore';

export default function AssistantHologram() {
  const assistantMessage = useStore((s) => s.assistantMessage);
  const setAssistantMessage = useStore((s) => s.setAssistantMessage);

  return (
    <AnimatePresence>
      {assistantMessage && (
        <m.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          className="glass-panel pointer-events-auto absolute inset-x-3 top-32 z-20 w-auto rounded-xl p-3 shadow-glow-violet sm:inset-x-auto sm:bottom-5 sm:left-1/2 sm:top-auto sm:w-[min(92vw,26rem)] sm:-translate-x-1/2 sm:p-4"
          role="status"
        >
          <div className="flex items-start gap-3">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-violet-glow/50 bg-violet-glow/10">
              <FiCpu className="text-violet-glow animate-pulseGlow" size={16} aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="truncate font-display text-xs tracking-wide text-violet-glow">
                  {assistantMessage.title}
                </h3>
                <button
                  type="button"
                  onClick={() => setAssistantMessage(null)}
                  aria-label="Dismiss assistant message"
                  className="focus-ring shrink-0 rounded-full p-1 text-white/40 hover:bg-white/5 hover:text-white"
                >
                  <FiX size={12} />
                </button>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-white/70">{assistantMessage.body}</p>
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
