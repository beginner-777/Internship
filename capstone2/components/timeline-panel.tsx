"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { IncidentAnalysis } from "@/lib/types";

type EventSeverity = IncidentAnalysis["timeline"][number]["severity"];

export function TimelinePanel({ analysis, selectedService }: { analysis: IncidentAnalysis; selectedService?: string }) {
  const [severity, setSeverity] = useState<"all" | EventSeverity>("all");
  const [service, setService] = useState("all");
  const [query, setQuery] = useState("");
  const effectiveService = selectedService || service;

  const filtered = useMemo(() => analysis.timeline.filter((event) => {
    const haystack = `${event.title} ${event.description} ${event.evidence}`.toLowerCase();
    const serviceMatch = effectiveService === "all" || haystack.includes(effectiveService.toLowerCase());
    const severityMatch = severity === "all" || event.severity === severity;
    return serviceMatch && severityMatch && haystack.includes(query.toLowerCase());
  }), [analysis.timeline, effectiveService, query, severity]);

  const density = useMemo(() => {
    const counts = new Map<string, number>();
    for (const event of analysis.timeline) {
      const bucket = event.timestamp.slice(0, 16);
      counts.set(bucket, (counts.get(bucket) ?? 0) + 1);
    }
    const values = [...counts.values()];
    const max = Math.max(1, ...values);
    return values.map((value) => ({ value, height: 18 + (value / max) * 36 }));
  }, [analysis.timeline]);

  return (
    <section id="timeline" className="surface section-card" aria-labelledby="timeline-title">
      <div className="section-head"><div><h2 id="timeline-title">Incident timeline</h2><p>{filtered.length} of {analysis.timeline.length} supplied events shown</p></div></div>
      <div className="filter-row" aria-label="Timeline filters">
        {(["all", "critical", "warning", "information"] as const).map((item) => <button key={item} className={`filter-chip ${severity === item ? "active" : ""}`} aria-pressed={severity === item} onClick={() => setSeverity(item)}>{item === "all" ? "All events" : item[0].toUpperCase() + item.slice(1)}</button>)}
        <select className="filter-chip" aria-label="Filter by affected service" value={effectiveService} onChange={(event) => setService(event.target.value)}>
          <option value="all">All affected services</option>
          {analysis.affectedServices.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}
        </select>
        <label style={{ position: "relative", flex: "1 1 190px" }}><span className="sr-only">Search timeline</span><Search size={14} aria-hidden="true" style={{ position: "absolute", left: ".75rem", top: ".8rem" }} /><input className="filter-search" style={{ width: "100%", paddingLeft: "2rem" }} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search evidence…" /></label>
      </div>

      <div className="density" role="img" aria-label={`Event-density visualization showing ${analysis.timeline.length} events across ${density.length} timestamp buckets. Bars represent event count only, not a numeric system metric.`}>
        {density.length ? density.map((bar, index) => <span key={index} title={`${bar.value} event${bar.value === 1 ? "" : "s"}`} style={{ height: bar.height }} />) : <span style={{ height: 1 }} />}
      </div>
      <p className="muted" style={{ fontSize: ".68rem", margin: ".4rem 0 1rem" }}>Event density · derived only from supplied timeline events, not system telemetry.</p>

      {filtered.length ? <div className="timeline">{filtered.map((event, index) => (
        <article className="timeline-event" key={`${event.timestamp}-${event.title}-${index}`}>
          <span className={`event-dot ${event.severity}`} aria-hidden="true" />
          <div className="event-body"><time>{event.timestamp}</time><h3>{event.title}</h3><p>{event.description}</p><code>{event.evidence}</code></div>
        </article>
      ))}</div> : <div className="empty">No timeline events match these filters.</div>}
    </section>
  );
}
