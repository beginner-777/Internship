"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Check, CheckCheck, ChevronDown, SearchX, ShieldAlert } from "lucide-react";
import { useAudit } from "@/lib/use-audit";
import type { CategoryKey, Severity } from "@/types/audit";

const filters: ("all" | Severity)[] = ["all", "critical", "warning", "passed"];
const categories: ("all" | CategoryKey)[] = ["all", "technical", "content", "metadata", "links", "performance", "mobile", "security"];

function IssueIcon({ severity }: { severity: Severity }) { return severity === "critical" ? <ShieldAlert /> : severity === "warning" ? <AlertTriangle /> : <Check />; }

export default function IssuesPage() {
  const { audit, isStored } = useAudit();
  const [filter, setFilter] = useState<"all" | Severity>("all");
  const [category, setCategory] = useState<"all" | CategoryKey>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [reviewed, setReviewed] = useState<string[]>([]);
  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("filter");
    if (value && filters.includes(value as "all" | Severity)) window.setTimeout(() => setFilter(value as "all" | Severity), 0);
  }, []);
  const visible = useMemo(() => audit.issues.filter(issue => (filter === "all" || issue.severity === filter) && (category === "all" || issue.category === category)), [audit.issues, category, filter]);
  return <main className="page-shell issues-page">
    <header className="page-hero"><div><span>ISSUES EXPLORER</span><h1>Signals that need<br /><i>human attention.</i></h1></div><p>{isStored ? new URL(audit.url).hostname : "Sample audit"}<small>{visible.length} visible checks</small></p></header>
    {!isStored && <div className="sample-banner">SAMPLE AUDIT · Run an audit to replace this example dataset.</div>}
    <section className="filter-bar" aria-label="Issue filters"><div>{filters.map(item => <button key={item} onClick={() => setFilter(item)} className={filter === item ? "active" : ""}>{item}</button>)}</div><select value={category} onChange={event => setCategory(event.target.value as "all" | CategoryKey)} aria-label="Filter by category">{categories.map(item => <option key={item} value={item}>{item === "all" ? "ALL CATEGORIES" : item.toUpperCase()}</option>)}</select></section>
    <section className="issue-list">{visible.length ? visible.map((issue, index) => <article key={issue.id} className={`issue-row ${issue.severity} ${reviewed.includes(issue.id) ? "reviewed" : ""}`}>
      <button className="issue-summary" onClick={() => setExpanded(expanded === issue.id ? null : issue.id)} aria-expanded={expanded === issue.id}>
        <span className="issue-number">{String(index + 1).padStart(2, "0")}</span><span className="severity-icon"><IssueIcon severity={issue.severity} /></span>
        <span className="issue-title"><small>{issue.severity} · {issue.category}</small><strong>{issue.title}</strong><p>{issue.description}</p></span>
        {reviewed.includes(issue.id) && <span className="reviewed-label"><CheckCheck /> REVIEWED</span>}<ChevronDown className={expanded === issue.id ? "rotated" : ""} />
      </button>
      {expanded === issue.id && <div className="issue-detail"><div><span>WHY IT MATTERS</span><p>{issue.whyItMatters}</p></div><div><span>RECOMMENDED FIX</span><p>{issue.suggestedFix}</p></div><button className="button button-outline" onClick={() => setReviewed(list => list.includes(issue.id) ? list.filter(id => id !== issue.id) : [...list, issue.id])}>{reviewed.includes(issue.id) ? "UNDO REVIEW" : "MARK REVIEWED"}</button></div>}
    </article>) : <div className="empty-results" role="status"><SearchX /><span>NO MATCHING SIGNALS</span><h2>This filter combination is clear.</h2><p>Try another category or reset the filters to review every available check.</p><button className="button button-outline" onClick={() => { setFilter("all"); setCategory("all"); }}>RESET FILTERS</button></div>}</section>
  </main>;
}
