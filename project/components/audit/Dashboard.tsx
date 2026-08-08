"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { AlertTriangle, Check, RotateCcw, ShieldAlert, Sparkles } from "lucide-react";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { AuditResult, CategoryKey } from "@/types/audit";
import { AiPanel } from "./AiPanel";
import { ActionMatrix } from "./ActionMatrix";
import { AuditCommand } from "./AuditCommand";

const NeuralWeb = dynamic(() => import("@/components/3d/NeuralWeb"), { ssr: false, loading: () => <div className="canvas-loading"><i />ACTIVATING NEURAL WEB</div> });

export function Dashboard({ audit, onNewAudit, auditing }: { audit: AuditResult; onNewAudit: (url: string) => void; auditing: boolean }) {
  const weakest = useMemo(() => [...audit.categories].sort((a, b) => a.score - b.score)[0], [audit]);
  const [selected, setSelected] = useState<CategoryKey>(weakest.key);
  const reduced = useReducedMotion();
  const [displayScore, setDisplayScore] = useState(reduced ? audit.overallScore : 0);
  const [reset, setReset] = useState(0);
  useEffect(() => {
    if (reduced) return;
    let frame = 0;
    const timer = window.setInterval(() => {
      frame += 1; setDisplayScore(Math.round(audit.overallScore * Math.min(1, frame / 32)));
      if (frame >= 32) window.clearInterval(timer);
    }, 28);
    return () => window.clearInterval(timer);
  }, [audit.overallScore, reduced]);
  const selectedCategory = audit.categories.find(category => category.key === selected) ?? weakest;
  const counts = {
    critical: audit.issues.filter(issue => issue.severity === "critical").length,
    warning: audit.issues.filter(issue => issue.severity === "warning").length,
    passed: audit.issues.filter(issue => issue.severity === "passed").length,
    opportunities: audit.ai.insights.opportunities.length
  };
  return <main className="dashboard-page"><div className="dashboard-aurora" /><div className="dashboard-noise" />
    <section className="dashboard-topline">
      <div><span>ACTIVE AUDIT</span><strong>{new URL(audit.url).hostname}</strong><small>{new Date(audit.auditedAt).toLocaleString()}</small></div>
      <div className="overall-readout"><div className="score-orbit"><i /><i /><span>{displayScore}</span></div><div><b>SEO HEALTH</b><small>{displayScore >= 80 ? "STRONG SIGNAL" : displayScore >= 55 ? "NEEDS ATTENTION" : "CRITICAL EXPOSURE"}</small></div></div>
      <AuditCommand compact onSubmit={onNewAudit} disabled={auditing} />
    </section>
    <section className="dashboard-stage">
      <aside className="category-rail" aria-label="SEO audit categories">
        <div className="rail-label">AUDIT LAYERS</div>
        {audit.categories.map((category, index) => <button key={category.key} onClick={() => setSelected(category.key)} className={selected === category.key ? "active" : ""} aria-pressed={selected === category.key}>
          <small>{String(index + 1).padStart(2, "0")}</small><span>{category.label}</span><b className={category.status}>{category.score}</b>
        </button>)}
      </aside>
      <div className="neural-stage">
        <div className="stage-beam" /><i className="hud-corner hud-tl" /><i className="hud-corner hud-tr" /><i className="hud-corner hud-bl" /><i className="hud-corner hud-br" />
        <div className="stage-caption"><span>SEO NEURAL WEB</span><p>Orbit to inspect · select a node to focus</p></div>
        <button className="reset-camera" onClick={() => { setSelected(weakest.key); setReset(value => value + 1); }}><RotateCcw /> RESET CAMERA</button>
        <Suspense fallback={null}><NeuralWeb categories={audit.categories} score={audit.overallScore} selected={selected} onSelect={setSelected} resetSignal={reset} /></Suspense>
        <div className="selected-signal"><span>SELECTED SIGNAL</span><strong>{selectedCategory.label}</strong><b className={selectedCategory.status}>{selectedCategory.score} / 100</b><small>{selectedCategory.issueCount} ISSUES · {selectedCategory.opportunityCount} OPPORTUNITIES</small></div>
        <div className="stage-telemetry"><span><i /> NEURAL SYNC</span><b>{audit.categories.length} NODES</b><b>{audit.issues.length} CHECKS</b></div>
      </div>
      <AiPanel audit={audit} selected={selected} />
    </section>
    <section className="signal-strip">
      <Link href="/issues?filter=critical"><ShieldAlert /><span>CRITICAL ISSUES</span><b>{counts.critical}</b></Link>
      <Link href="/issues?filter=warning"><AlertTriangle /><span>WARNINGS</span><b>{counts.warning}</b></Link>
      <Link href="/issues?filter=passed"><Check /><span>PASSED CHECKS</span><b>{counts.passed}</b></Link>
      <a href="#action-plan"><Sparkles /><span>AI OPPORTUNITIES</span><b>{counts.opportunities}</b></a>
    </section>
    <section className="executive-band"><span>{audit.ai.label}</span><blockquote>“{audit.ai.insights.executiveSummary}”</blockquote><Link href="/reports" className="button button-outline">OPEN FULL REPORT</Link></section>
    <ActionMatrix actions={audit.ai.insights.actionPlan} />
  </main>;
}
