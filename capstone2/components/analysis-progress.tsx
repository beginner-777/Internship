"use client";

import { X } from "lucide-react";
import { SceneSlot } from "./three/scene-slot";

const stages = [
  "Securing and validating evidence",
  "Detecting incident events",
  "Correlating affected services",
  "Evaluating possible causes",
  "Prioritizing recovery actions",
  "Preparing investigation",
];

export function AnalysisProgress({ onCancel }: { onCancel: () => void }) {
  return (
    <div className="analysis-overlay" role="dialog" aria-modal="true" aria-labelledby="analysis-title">
      <div className="analysis-panel">
        <div className="analysis-scene"><SceneSlot kind="analysis" severity={3} /></div>
        <div className="analysis-copy">
          <p className="eyebrow" style={{ color: "#d6a84b" }}>Evidence secured</p>
          <h2 id="analysis-title" className="serif">Tracing the incident signal.</h2>
          <p style={{ color: "#cbbfa8", lineHeight: 1.6 }}>The server is validating a structured investigation. Stage completion is not simulated; the final steps remain indeterminate until Gemini responds.</p>
          <button className="button button-secondary" onClick={onCancel}><X size={17} /> Cancel analysis</button>
        </div>
        <div className="analysis-stages" aria-live="polite" aria-label="Analysis progress">
          {stages.map((stage, index) => (
            <div key={stage} className={`analysis-stage ${index < 2 ? "done" : index === stages.length - 1 ? "active" : ""}`}>
              <span className="stage-dot" aria-hidden="true" />
              <span>{stage}</span>
              <span className="sr-only">{index < 2 ? "complete" : index === stages.length - 1 ? "in progress" : "processed by analysis service"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
