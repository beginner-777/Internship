"use client";

import Link from "next/link";
import { ArrowUpRight, BrainCircuit, Sparkles } from "lucide-react";
import type { AuditResult, CategoryKey } from "@/types/audit";

export function AiPanel({ audit, selected }: { audit: AuditResult; selected: CategoryKey }) {
  const action = audit.ai.insights.actionPlan.find(item => item.category === selected) ?? audit.ai.insights.actionPlan[0];
  const insight = audit.ai.insights.categoryInsights[selected] ?? audit.ai.insights.executiveSummary;
  return <aside className="ai-panel">
    <div className="panel-kicker"><BrainCircuit /><span>AI PRIORITY</span><b className={audit.ai.mode}>{audit.ai.label}</b></div>
    <h2>{action?.title ?? "Maintain this signal"}</h2>
    <p>{insight}</p>
    {audit.ai.reason && <div className="mode-note"><Sparkles />{audit.ai.reason}</div>}
    {action && <div className="impact-row">
      <div><span>IMPACT</span><strong>{action.impact}</strong></div>
      <div><span>EFFORT</span><strong>{action.effort}</strong></div>
    </div>}
    <div className="panel-benefit"><span>RECOMMENDED MOVE</span><p>{action?.detail ?? "Continue monitoring this category across important pages."}</p></div>
    <div className="panel-actions"><Link href="/issues" className="text-button">VIEW ISSUES <ArrowUpRight /></Link><a href="#action-plan" className="text-button">ACTION PLAN <ArrowUpRight /></a></div>
  </aside>;
}
