"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CheckCircle2, Clipboard, FileDown, HelpCircle, Info, Plus, ShieldAlert } from "lucide-react";
import type { StoredInvestigation } from "@/lib/types";
import { createTextReport } from "@/lib/report";
import { SceneSlot } from "./three/scene-slot";
import { SeverityIndicator } from "./severity-indicator";
import { TimelinePanel } from "./timeline-panel";
import { ServiceMap } from "./service-map";
import { HypothesisCard } from "./hypothesis-card";
import { ActionPlan } from "./action-plan";

export function InvestigationDashboard({ record }: { record: StoredInvestigation }) {
  const { analysis } = record;
  const [selectedId, setSelectedId] = useState<string>();
  const [copyStatus, setCopyStatus] = useState("");
  const selected = analysis.affectedServices.find((service) => service.id === selectedId);
  const ranked = useMemo(() => [...analysis.rootCauseHypotheses].sort((a, b) => b.confidence - a.confidence), [analysis.rootCauseHypotheses]);
  const criticalCount = analysis.affectedServices.filter((service) => service.status === "critical" || service.status === "degraded").length;
  const modeLabel = record.mode === "gemini" ? "Live Gemini analysis" : record.mode === "demo" ? "Demo Analysis" : "Basic local analysis — not an AI analysis";

  const copy = async () => {
    try { await navigator.clipboard.writeText(createTextReport(record)); setCopyStatus("Report copied to clipboard."); }
    catch { setCopyStatus("Clipboard access was unavailable. Use Print / Save as PDF instead."); }
  };

  return (
    <main id="main-content" className="page">
      <section className="investigation-hero" aria-labelledby="investigation-title">
        <SceneSlot kind="header" severity={analysis.severity === "SEV-1" ? 4 : analysis.severity === "SEV-2" ? 3 : 2} />
        <div className="investigation-copy">
          <div className="status-row"><SeverityIndicator severity={analysis.severity} /><span className="status-pill info">{modeLabel}</span></div>
          <h1 id="investigation-title" className="serif">{analysis.incidentTitle}</h1>
          <p style={{ color: "#cbbfa8", maxWidth: 830, lineHeight: 1.65 }}>{analysis.executiveSummary}</p>
          <div className="form-actions no-print" style={{ borderColor: "rgba(255,255,255,.14)" }}>
            <button className="button button-secondary" onClick={copy}><Clipboard size={17} /> Copy report</button>
            <button className="button button-secondary" onClick={() => window.print()}><FileDown size={17} /> Print / Save as PDF</button>
            <Link className="button button-primary" href="/workspace"><Plus size={17} /> Start new investigation</Link>
          </div>
          <p aria-live="polite" style={{ minHeight: "1.1rem", fontSize: ".74rem", color: "#e1bd68" }}>{copyStatus}</p>
        </div>
        <div className="hero-metrics">
          <div className="metric"><strong>{analysis.overallConfidence}%</strong><span>Overall confidence · evidence strength, not probability</span></div>
          <div className="metric"><strong>{criticalCount}</strong><span>Affected or degraded services</span></div>
          <div className="metric"><strong>{analysis.timeline.length}</strong><span>Evidence-backed timeline events</span></div>
          <div className="metric"><strong>{ranked.length}</strong><span>Root-cause hypotheses to verify</span></div>
        </div>
      </section>

      <div className="dashboard-grid">
        <section className="surface section-card"><div className="section-head"><div><h2>Customer impact</h2><p>{analysis.severityReason}</p></div><ShieldAlert size={22} color="#c94a3d" /></div><p style={{ lineHeight: 1.65, color: "#b8ad96" }}>{analysis.customerImpact}</p></section>
        <section className="surface section-card"><div className="section-head"><div><h2>Confidence reading</h2><p>One-time evidence indicator</p></div></div><div className="confidence-track" style={{ height: ".75rem" }} role="img" aria-label={`Overall confidence ${analysis.overallConfidence} percent`}><span style={{ width: `${analysis.overallConfidence}%` }} /></div><p className="muted" style={{ fontSize: ".75rem" }}>Score reflects completeness and consistency of supplied evidence.</p></section>
      </div>

      <div className="dashboard-grid">
        <TimelinePanel analysis={analysis} selectedService={selected?.name} />
        <ServiceMap analysis={analysis} selectedId={selectedId} onSelect={(id) => setSelectedId((current) => current === id ? undefined : id)} />
      </div>

      <div className="dashboard-grid">
        <section id="root-cause" className="surface section-card" aria-labelledby="hypothesis-title"><div className="section-head"><div><h2 id="hypothesis-title">Root-cause hypotheses</h2><p>Ranked explanations. None are confirmed unless the evidence proves them.</p></div></div><div className="hypotheses">{ranked.map((item, index) => <HypothesisCard key={`${item.title}-${index}`} hypothesis={item} rank={index + 1} />)}</div></section>
        <ActionPlan analysis={analysis} />
      </div>

      <div className="dashboard-grid">
        <section className="surface section-card"><div className="section-head"><div><h2>Healthy system signals</h2><p>Explicit positive evidence that narrows the incident field.</p></div><CheckCircle2 size={21} color="#667b55" /></div><ul className="signal-list">{analysis.healthySignals.map((item, index) => <li key={index}><CheckCircle2 size={16} color="#667b55" />{item}</li>)}</ul></section>
        <section className="surface section-card"><div className="section-head"><div><h2>Missing information</h2><p>Evidence that would materially strengthen the investigation.</p></div><HelpCircle size={21} color="#d6a84b" /></div><ul className="signal-list">{analysis.missingInformation.map((item, index) => <li key={index}><HelpCircle size={16} color="#d6a84b" />{item}</li>)}</ul></section>
      </div>

      <section className="surface section-card" style={{ marginTop: "1rem" }} aria-labelledby="limitations-title"><div className="section-head"><div><h2 id="limitations-title">AI limitations and review notice</h2><p>Human approval is required before operational action.</p></div><Info size={21} /></div><div className="notice"><ul>{analysis.limitations.map((item, index) => <li key={index}>{item}</li>)}</ul></div></section>
    </main>
  );
}
