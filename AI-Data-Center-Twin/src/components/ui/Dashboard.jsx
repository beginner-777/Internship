import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiServer, FiCpu } from 'react-icons/fi';
import { useStore } from '../../store/useStore';
import { useLiveMetric } from '../../hooks/useLiveMetric';
import Sparkline from './Sparkline';

function RackDashboard({ data, id }) {
  const gpu = useLiveMetric(data.gpu, 6);
  const cpu = useLiveMetric(data.cpu, 5);
  const temp = useLiveMetric(data.temp, 3);
  const network = useLiveMetric(data.network, 8);

  const rows = [
    ['Memory', `${data.memory}%`],
    ['Storage', `${data.storage}%`],
    ['Power Draw', `${data.power} kW`],
    ['Cooling Efficiency', `${data.cooling}%`],
    ['Running Model', data.model],
    ['Health Status', data.health],
  ];

  return (
    <>
      <div className="flex items-center gap-2 text-cyan-glow">
        <FiServer size={16} />
        <h2 className="font-display text-sm tracking-wide">{id}</h2>
      </div>
      <p className="mt-1 text-[11px] text-white/50">{data.model}</p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Sparkline label="GPU Usage" value={gpu} color="#00e5ff" />
        <Sparkline label="CPU Usage" value={cpu} color="#a78bfa" />
        <Sparkline label="Temperature" value={temp} color="#ff9d2f" unit="°C" />
        <Sparkline label="Network" value={network} color="#22ffb0" />
      </div>

      <dl className="mt-4 space-y-1.5 border-t border-white/10 pt-3 text-[11px]">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between text-white/70">
            <dt className="text-white/40">{k}</dt>
            <dd
              className={
                k === 'Health Status' ? (v === 'Warning' ? 'text-status-warn' : 'text-status-ok') : ''
              }
            >
              {v}
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}

function CoreDashboard({ data }) {
  const power = useLiveMetric(60, 10);
  const load = useLiveMetric(72, 8);

  return (
    <>
      <div className="flex items-center gap-2 text-cyan-glow">
        <FiCpu size={16} />
        <h2 className="font-display text-sm tracking-wide">AI Core</h2>
      </div>
      <p className="mt-1 text-[11px] text-white/50">{data.name}</p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Sparkline label="Cluster Load" value={load} color="#00e5ff" />
        <Sparkline label="Power" value={power} color="#a78bfa" unit="%" />
      </div>

      <dl className="mt-4 space-y-1.5 border-t border-white/10 pt-3 text-[11px]">
        {[
          ['Status', data.status],
          ['Mode', data.mode],
          ['Power', data.power],
          ['Core Temp', data.temp],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between text-white/70">
            <dt className="text-white/40">{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}

export default function Dashboard() {
  const selectedObject = useStore((s) => s.selectedObject);
  const clearSelection = useStore((s) => s.clearSelection);

  return (
    <AnimatePresence>
      {selectedObject && (
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ duration: 0.35 }}
          className="glass-panel twin-scroll pointer-events-auto absolute inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-30 max-h-[52dvh] w-auto overflow-y-auto rounded-xl p-4 shadow-glow sm:inset-x-auto sm:bottom-auto sm:right-5 sm:top-28 sm:z-20 sm:max-h-[70vh] sm:w-[min(90vw,18rem)]"
          role="dialog"
          aria-label={`${selectedObject.type === 'core' ? 'AI Core' : selectedObject.id} details`}
        >
          <button
            type="button"
            onClick={clearSelection}
            aria-label="Close panel"
            className="focus-ring absolute right-3 top-3 rounded-full p-1 text-white/40 hover:bg-white/5 hover:text-white"
          >
            <FiX size={14} />
          </button>

          {selectedObject.type === 'core' ? (
            <CoreDashboard data={selectedObject.data} />
          ) : (
            <RackDashboard data={selectedObject.data} id={selectedObject.id} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
