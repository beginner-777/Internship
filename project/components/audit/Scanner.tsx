"use client";

import { motion } from "framer-motion";

export const SCAN_STEPS = [
  "INITIALIZING SEO ENGINE", "CONNECTING TO TARGET", "VALIDATING URL", "CRAWLING DOCUMENT",
  "ANALYZING METADATA", "MAPPING CONTENT", "TRACING LINK STRUCTURE", "CHECKING INDEXABILITY",
  "CALCULATING SEO HEALTH", "GENERATING AI INSIGHTS", "AUDIT COMPLETE"
];

export function Scanner({ url, step }: { url: string; step: number }) {
  return <motion.div className="scanner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <div className="scan-grid" />
    <div className="scan-orbit orbit-one" /><div className="scan-orbit orbit-two" /><div className="scan-core"><i /><i /><i /></div>
    <div className="scan-data"><span>PACKETS <b>{String((step + 1) * 184).padStart(4, "0")}</b></span><span>LAYERS <b>{Math.min(step + 1, 10)}/10</b></span><span>SECURE <b>YES</b></span></div>
    <div className="scan-copy">
      <span>SECURE TARGET</span><strong>{url}</strong>
      <div className="scan-progress"><b style={{ width: `${Math.min(100, ((step + 1) / SCAN_STEPS.length) * 100)}%` }} /></div>
      <p>{SCAN_STEPS[Math.min(step, SCAN_STEPS.length - 1)]}</p>
      <small>{String(Math.min(step + 1, SCAN_STEPS.length)).padStart(2, "0")} / {SCAN_STEPS.length}</small>
    </div>
  </motion.div>;
}
