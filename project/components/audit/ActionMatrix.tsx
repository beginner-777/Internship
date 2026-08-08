"use client";

import type { AiAction } from "@/types/audit";

const pos = { low: 16, medium: 52, high: 86 } as const;
export function ActionMatrix({ actions }: { actions: AiAction[] }) {
  return <section className="action-section" id="action-plan">
    <div className="section-heading"><span>PRIORITY SYSTEM</span><h2>Impact × effort</h2><p>Start high and left: maximum impact with controlled implementation effort.</p></div>
    <div className="matrix-wrap">
      <div className="matrix-axis axis-y">HIGH IMPACT <span>IMPACT</span> LOW IMPACT</div>
      <div className="matrix">
        <i className="matrix-v" /><i className="matrix-h" />
        {actions.slice(0, 6).map((action, index) => <button key={`${action.title}-${index}`} className={`matrix-point impact-${action.impact}`} style={{ left: `${pos[action.effort]}%`, bottom: `${pos[action.impact]}%` }} title={`${action.title}: ${action.detail}`}><b>{String(index + 1).padStart(2, "0")}</b><span>{action.title}</span></button>)}
      </div>
      <div className="matrix-axis axis-x">LOW EFFORT <span>EFFORT</span> HIGH EFFORT</div>
    </div>
    <div className="action-list">{actions.slice(0, 6).map((action, index) => <article key={action.title}><b>{String(index + 1).padStart(2, "0")}</b><div><h3>{action.title}</h3><p>{action.detail}</p></div><span>{action.impact} impact</span><span>{action.effort} effort</span></article>)}</div>
  </section>;
}
