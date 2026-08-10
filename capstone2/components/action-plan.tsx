"use client";

import { useState } from "react";
import type { IncidentAnalysis } from "@/lib/types";

const labels = { immediate: "Immediate recovery", investigateNext: "Investigate next", preventRecurrence: "Prevent recurrence" } as const;

export function ActionPlan({ analysis }: { analysis: IncidentAnalysis }) {
  const [tab, setTab] = useState<keyof IncidentAnalysis["actionPlan"]>("immediate");
  return (
    <section id="action-plan" className="surface section-card" aria-labelledby="action-title">
      <div className="section-head"><div><h2 id="action-title">Prioritized action plan</h2><p>Recommendations only. TRACE AI has not executed any action.</p></div></div>
      <div className="action-tabs" role="tablist" aria-label="Action plan categories">
        {(Object.keys(labels) as Array<keyof typeof labels>).map((key) => <button key={key} className={`filter-chip ${tab === key ? "active" : ""}`} role="tab" aria-selected={tab === key} onClick={() => setTab(key)}>{labels[key]}</button>)}
      </div>
      <div className="action-list" role="tabpanel">
        {analysis.actionPlan[tab].map((item) => <article className="action-item" key={item.id}><span className="priority">{item.priority}</span><div><h3>{item.action}</h3><p>{item.rationale}</p><span className="action-owner">Suggested owner: {item.ownerSuggestion}</span></div></article>)}
      </div>
    </section>
  );
}
