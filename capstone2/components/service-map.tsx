"use client";

import { useMemo } from "react";
import { SceneSlot } from "./three/scene-slot";
import type { IncidentAnalysis } from "@/lib/types";

const positions = [
  { x: 50, y: 18 }, { x: 18, y: 40 }, { x: 82, y: 40 }, { x: 30, y: 76 },
  { x: 70, y: 76 }, { x: 50, y: 52 }, { x: 10, y: 75 }, { x: 90, y: 75 },
];

export function ServiceMap({ analysis, selectedId, onSelect }: { analysis: IncidentAnalysis; selectedId?: string; onSelect: (id: string) => void }) {
  const visible = analysis.affectedServices.slice(0, positions.length);
  const coords = useMemo(() => new Map(visible.map((service, index) => [service.id, positions[index]])), [visible]);
  const selected = analysis.affectedServices.find((service) => service.id === selectedId);
  const related = new Set(analysis.relationships.filter((item) => item.source === selectedId || item.target === selectedId).flatMap((item) => [item.source, item.target]));

  return (
    <section id="services" className="surface section-card" aria-labelledby="services-title">
      <div className="section-head"><div><h2 id="services-title">Service relationship field</h2><p>Select a node to trace connected evidence and dependencies.</p></div></div>
      <div className="service-map" aria-hidden="true">
        <SceneSlot kind="map" severity={analysis.severity === "SEV-1" ? 4 : analysis.severity === "SEV-2" ? 3 : 2} />
        <svg className="map-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
          {analysis.relationships.map((relationship, index) => {
            const source = coords.get(relationship.source); const target = coords.get(relationship.target);
            if (!source || !target) return null;
            const active = relationship.source === selectedId || relationship.target === selectedId;
            return <line key={`${relationship.source}-${relationship.target}-${index}`} x1={source.x} y1={source.y} x2={target.x} y2={target.y} className={active ? "selected" : ""} />;
          })}
        </svg>
        {visible.map((service, index) => <button key={service.id} className={`service-node ${selectedId === service.id || related.has(service.id) ? "selected" : ""}`} style={{ left: `${positions[index].x}%`, top: `${positions[index].y}%` }} onClick={() => onSelect(service.id)}><b>{service.name}</b><span>{service.status}</span></button>)}
      </div>
      <div className="service-list" aria-label="Accessible service relationship list">
        {analysis.affectedServices.map((service) => <button key={service.id} aria-pressed={service.id === selectedId} onClick={() => onSelect(service.id)}><span><strong>{service.name}</strong><br /><small className="muted">{service.evidence.length} evidence signal{service.evidence.length === 1 ? "" : "s"}</small></span><span className={`status-pill ${service.status === "critical" ? "critical" : service.status === "healthy" ? "healthy" : "warning"}`}>{service.status}</span></button>)}
      </div>
      <div className="notice" style={{ marginTop: ".75rem" }} aria-live="polite">
        {selected ? <><strong>{selected.name}</strong>: {selected.evidence.join(" · ") || "No direct evidence supplied."}<br />{analysis.relationships.filter((item) => item.source === selected.id || item.target === selected.id).map((item) => `${item.source} → ${item.target}: ${item.relationship}`).join(" | ") || "No dependency relationship was supplied for this service."}</> : "Select a service to read its evidence and relationship description."}
      </div>
    </section>
  );
}
