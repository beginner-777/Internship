import React from 'react';
import { FiAlertTriangle, FiCpu, FiServer, FiThermometer, FiActivity } from 'react-icons/fi';

const FEATURES = [
  { icon: FiCpu, title: 'GPU Cluster Visualization', desc: 'Real-time 3D rendering of AI accelerator racks.' },
  { icon: FiServer, title: 'Live Server Telemetry', desc: 'Per-rack GPU, CPU, memory and power metrics.' },
  { icon: FiThermometer, title: 'Thermal Heatmapping', desc: 'Dynamic thermal visualization across the facility.' },
  { icon: FiActivity, title: 'Workload Simulation', desc: 'Training, inference, and fine-tuning state changes.' },
];

export default function WebGLFallback() {
  return (
    <div className="h-full w-full overflow-y-auto bg-carbon-950 text-white">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="glass-panel rounded-2xl p-8 shadow-glow">
          <div className="flex items-center gap-3 text-status-warn">
            <FiAlertTriangle size={28} aria-hidden="true" />
            <h1 className="font-display text-xl tracking-wide">WebGL Unavailable</h1>
          </div>

          <p className="mt-4 text-white/70 leading-relaxed">
            Your browser or device doesn't support WebGL, which is required to render the
            AI Data Center Digital Twin's interactive 3D experience. Below is a static overview
            of what the full experience includes.
          </p>

          <div
            className="mt-8 aspect-video w-full rounded-xl border border-white/10 bg-gradient-to-br from-carbon-800 via-carbon-900 to-black flex items-center justify-center"
            role="img"
            aria-label="Preview illustration of the AI Data Center Digital Twin facility"
          >
            <span className="font-display text-cyan-glow/70 text-sm tracking-widest">
              DIGITAL TWIN PREVIEW
            </span>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <Icon className="text-cyan-glow" size={20} aria-hidden="true" />
                <h2 className="mt-2 font-semibold text-sm">{title}</h2>
                <p className="mt-1 text-xs text-white/60">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-white/10 pt-6">
            <h3 className="font-semibold text-sm mb-2">To view the interactive experience:</h3>
            <ul className="text-sm text-white/70 list-disc list-inside space-y-1">
              <li>Update to the latest version of Chrome, Edge, Firefox, or Safari.</li>
              <li>Ensure hardware acceleration is enabled in your browser settings.</li>
              <li>Update your graphics drivers, or try a different device.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
