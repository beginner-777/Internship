import React, { useEffect, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { FiCamera, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useStore } from '../../store/useStore';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const PRESETS = [
  { id: 'top', label: 'Top View', position: [0, 9.2, 16.5], lookAt: [0, 0.8, 0], fov: 60 },
  { id: 'side', label: 'Side View', position: [40, 6, 0], lookAt: [0, 3, 0] },
  { id: 'core', label: 'AI Core Close-up', position: [0, 3.4, 6], lookAt: [0, 2.4, 0] },
  { id: 'facility', label: 'Entire Facility', position: [18, 7.5, 18], lookAt: [0, 2, 0], fov: 50 },
  { id: 'presentation', label: 'Presentation', position: [10, 5, 22], lookAt: [0, 2, 0] },
];

export default function CameraPresetsBar() {
  const requestCameraMove = useStore((s) => s.requestCameraMove);
  const isMobile = useMediaQuery('(max-width: 639px)');
  const [active, setActive] = useState(null);
  const [collapsed, setCollapsed] = useState(isMobile);

  useEffect(() => {
    setCollapsed(isMobile);
  }, [isMobile]);

  return (
    <m.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
      className={`glass-panel pointer-events-auto absolute bottom-[max(0.75rem,env(safe-area-inset-bottom))] right-3 z-20 flex flex-col gap-1 rounded-xl p-2 shadow-glow sm:bottom-5 sm:right-5 ${
        collapsed ? 'w-auto' : 'w-[min(88vw,12rem)] sm:w-auto'
      }`}
      aria-label="Cinematic camera presets"
    >
      <button
        type="button"
        onClick={() => setCollapsed((value) => !value)}
        className="focus-ring flex items-center justify-between gap-2 rounded-md px-1.5 text-[10px] tracking-wider text-white/50"
        aria-expanded={!collapsed}
      >
        <span className="flex items-center gap-1.5">
          <FiCamera size={11} /> CAMERA
        </span>
        {collapsed ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />}
      </button>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex flex-col gap-1 overflow-hidden"
          >
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  setActive(preset.id);
                  requestCameraMove({ position: preset.position, lookAt: preset.lookAt, fov: preset.fov, duration: 2 });
                  if (isMobile) setCollapsed(true);
                }}
                aria-pressed={active === preset.id}
                className={`focus-ring rounded-md px-2.5 py-1.5 text-left text-[11px] transition-colors ${
                  active === preset.id ? 'bg-cyan-glow/20 text-cyan-glow' : 'text-white/60 hover:bg-white/5'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </m.div>
        )}
      </AnimatePresence>
    </m.div>
  );
}
