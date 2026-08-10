import type { Metadata } from "next";
import { AlertTriangle, Braces, Eye, LockKeyhole, Scale, SlidersHorizontal } from "lucide-react";

export const metadata: Metadata = { title: "Methodology" };

export default function MethodologyPage() {
  return (
    <main id="main-content" className="page">
      <header className="page-header">
        <div><p className="eyebrow muted">Trust before automation</p><h1 className="serif">Investigation methodology</h1></div>
        <p className="muted">TRACE AI organises evidence and proposes what to verify next. It does not replace incident command, observability, or human ownership.</p>
      </header>

      <div className="method-grid">
        <section className="surface card method-card wide">
          <p className="eyebrow muted">Analysis sequence</p>
          <ol className="step-list">
            <li>Validate and sanitise the incident package.</li><li>Extract direct observations and timestamped events.</li><li>Correlate service evidence without inventing dependencies.</li><li>Classify impact and provisional severity.</li><li>Rank hypotheses with supporting and contradicting evidence.</li><li>Prioritise safe recovery, verification, and prevention work.</li>
          </ol>
        </section>

        <section className="surface card method-card">
          <Eye size={22} color="#d6a84b" /><h2>Observation vs inference</h2>
          <p>Log fragments, explicit metrics, timestamps, and operator notes are observations. Any explanation that connects them is labelled as a hypothesis until verified.</p>
        </section>
        <section className="surface card method-card">
          <Scale size={22} color="#d6a84b" /><h2>Confidence is not probability</h2>
          <p>A confidence score communicates evidence strength and consistency. It is not a mathematical probability that a hypothesis is correct.</p>
        </section>
        <section className="surface card method-card">
          <LockKeyhole size={22} color="#d6a84b" /><h2>Privacy boundary</h2>
          <p>Secret scanning happens locally. Only a submitted incident is sent to the server, where evidence is sanitised before Gemini is called. TRACE AI does not intentionally log complete evidence.</p>
        </section>
        <section className="surface card method-card">
          <Braces size={22} color="#d6a84b" /><h2>Structured output</h2>
          <p>The server requests schema-constrained JSON and validates it again before the browser receives it. A malformed response is repaired once, then rejected.</p>
        </section>
        <section className="surface card method-card wide">
          <AlertTriangle size={22} color="#a44337" /><h2>Known limitations</h2>
          <ul><li>Incomplete evidence can produce incomplete or misleading hypotheses.</li><li>Temporal proximity does not establish causation.</li><li>Service names and relationships require consistent evidence.</li><li>Human review is required before remediation or severity declaration.</li><li>The local fallback uses pattern matching and is explicitly not an AI analysis.</li></ul>
        </section>
        <section id="settings" className="surface card method-card wide">
          <SlidersHorizontal size={22} color="#d6a84b" /><h2>Workspace settings</h2>
          <p>Motion follows your operating-system reduced-motion setting. 3D automatically pauses when hidden and is replaced on low-power mobile devices or when WebGL is unavailable. The latest investigation and editor draft remain only in this browser’s local storage.</p>
        </section>
      </div>
    </main>
  );
}
