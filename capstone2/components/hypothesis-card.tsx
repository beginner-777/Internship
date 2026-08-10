import type { IncidentAnalysis } from "@/lib/types";

export function HypothesisCard({ hypothesis, rank }: { hypothesis: IncidentAnalysis["rootCauseHypotheses"][number]; rank: number }) {
  return (
    <details className="hypothesis" open={rank === 1}>
      <summary><span className="rank">{rank}</span><span><strong>{hypothesis.title}</strong><span className="confidence-track" aria-hidden="true"><span style={{ width: `${hypothesis.confidence}%` }} /></span></span><strong aria-label={`${hypothesis.confidence} percent confidence`}>{hypothesis.confidence}%</strong></summary>
      <div className="hypothesis-body">
        <p>{hypothesis.explanation}</p>
        <div className="evidence-columns">
          <div className="evidence-box"><h4>Supporting evidence</h4><ul>{hypothesis.supportingEvidence.length ? hypothesis.supportingEvidence.map((item, index) => <li key={index}>{item}</li>) : <li>No supporting evidence supplied.</li>}</ul></div>
          <div className="evidence-box"><h4>Contradicting evidence</h4><ul>{hypothesis.contradictingEvidence.length ? hypothesis.contradictingEvidence.map((item, index) => <li key={index}>{item}</li>) : <li>No contradicting evidence supplied.</li>}</ul></div>
        </div>
        <div className="evidence-box"><h4>Verification steps</h4><ol>{hypothesis.verificationSteps.map((item, index) => <li key={index}>{item}</li>)}</ol></div>
      </div>
    </details>
  );
}
