import React, { useEffect, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import {
  FiSun, FiMoon, FiThermometer, FiWind, FiAlertTriangle, FiRefreshCw,
  FiRotateCw, FiShare2, FiSliders, FiChevronDown, FiChevronUp,
} from 'react-icons/fi';
import { useStore, WORKLOAD_MODES } from '../../store/useStore';
import { useMediaQuery } from '../../hooks/useMediaQuery';

function ToggleRow({ icon: Icon, label, active, onClick, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`focus-ring flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors ${
        active
          ? danger
            ? 'bg-status-danger/15 text-status-danger'
            : 'bg-cyan-glow/15 text-cyan-glow'
          : 'text-white/60 hover:bg-white/5'
      }`}
    >
      <span className="flex items-center gap-2">
        <Icon size={14} aria-hidden="true" />
        {label}
      </span>
      <span
        className={`h-3.5 w-7 rounded-full transition-colors ${active ? (danger ? 'bg-status-danger' : 'bg-cyan-glow') : 'bg-white/15'}`}
      >
        <m.span
          className="block h-3.5 w-3.5 rounded-full bg-white"
          animate={{ x: active ? 14 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </span>
    </button>
  );
}

export default function ControlPanel() {
  const isMobile = useMediaQuery('(max-width: 639px)');
  const [collapsed, setCollapsed] = useState(isMobile);
  const dayNight = useStore((s) => s.dayNight);
  const toggleDayNight = useStore((s) => s.toggleDayNight);
  const heatmapEnabled = useStore((s) => s.heatmapEnabled);
  const toggleHeatmap = useStore((s) => s.toggleHeatmap);
  const coolingOn = useStore((s) => s.coolingOn);
  const toggleCooling = useStore((s) => s.toggleCooling);
  const workloadMode = useStore((s) => s.workloadMode);
  const setWorkloadMode = useStore((s) => s.setWorkloadMode);
  const autoRotate = useStore((s) => s.autoRotate);
  const toggleAutoRotate = useStore((s) => s.toggleAutoRotate);
  const networkVizEnabled = useStore((s) => s.networkVizEnabled);
  const toggleNetworkViz = useStore((s) => s.toggleNetworkViz);
  const quality = useStore((s) => s.quality);
  const setQuality = useStore((s) => s.setQuality);
  const resetScene = useStore((s) => s.resetScene);

  const emergency = workloadMode === WORKLOAD_MODES.EMERGENCY;

  useEffect(() => {
    setCollapsed(isMobile);
  }, [isMobile]);

  return (
    <m.div
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.35, duration: 0.6 }}
      className={`glass-panel pointer-events-auto absolute bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-3 top-auto z-20 rounded-xl p-3 shadow-glow sm:bottom-auto sm:left-5 sm:top-28 sm:w-[15rem] ${
        collapsed ? 'w-auto' : 'w-[min(90vw,15rem)]'
      }`}
    >
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        className="focus-ring flex w-full items-center justify-between text-xs font-semibold tracking-wide text-white/80"
        aria-expanded={!collapsed}
      >
        <span className="flex items-center gap-2">
          <FiSliders size={13} /> CONTROL PANEL
        </span>
        {collapsed ? <FiChevronDown size={14} /> : <FiChevronUp size={14} />}
      </button>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 flex flex-col gap-1">
              <ToggleRow
                icon={dayNight === 'day' ? FiSun : FiMoon}
                label={dayNight === 'day' ? 'Day Mode' : 'Night Mode'}
                active={dayNight === 'day'}
                onClick={toggleDayNight}
              />
              <ToggleRow icon={FiThermometer} label="Thermal Heatmap" active={heatmapEnabled} onClick={toggleHeatmap} />
              <ToggleRow icon={FiWind} label="Cooling System" active={coolingOn} onClick={toggleCooling} />
              <ToggleRow icon={FiShare2} label="Network Visualization" active={networkVizEnabled} onClick={toggleNetworkViz} />
              <ToggleRow icon={FiRotateCw} label="Auto Rotate" active={autoRotate} onClick={toggleAutoRotate} />
              <ToggleRow
                icon={FiAlertTriangle}
                label="Emergency Mode"
                active={emergency}
                danger
                onClick={() => setWorkloadMode(emergency ? WORKLOAD_MODES.IDLE : WORKLOAD_MODES.EMERGENCY)}
              />
            </div>

            <div className="mt-3 border-t border-white/10 pt-3">
              <p className="mb-1.5 text-[10px] uppercase tracking-wider text-white/40">Graphics Quality</p>
              <div className="flex gap-1">
                {['low', 'medium', 'high'].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setQuality(q)}
                    aria-pressed={quality === q}
                    className={`focus-ring flex-1 rounded-md py-1 text-[10px] capitalize transition-colors ${
                      quality === q ? 'bg-cyan-glow/20 text-cyan-glow' : 'text-white/50 hover:bg-white/5'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={resetScene}
              className="focus-ring mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 py-2 text-[11px] text-white/60 hover:bg-white/5 hover:text-white"
            >
              <FiRefreshCw size={12} /> Reset Scene
            </button>
          </m.div>
        )}
      </AnimatePresence>
    </m.div>
  );
}
