import type { StoredInvestigation } from "./types";

function section(title: string, lines: string[]): string {
  return `\n${title}\n${"-".repeat(title.length)}\n${lines.join("\n")}`;
}

export function createTextReport(record: StoredInvestigation): string {
  const { analysis, mode, createdAt } = record;
  return [
    "TRACE AI — Incident Investigation Report",
    `Generated: ${new Date(createdAt).toLocaleString()}`,
    `Analysis mode: ${mode === "gemini" ? "Live Gemini analysis" : mode === "demo" ? "Demo Analysis" : "Basic local analysis — not an AI analysis"}`,
    section("Incident", [
      analysis.incidentTitle,
      `Severity: ${analysis.severity}`,
      `Confidence: ${analysis.overallConfidence}%`,
      `Severity basis: ${analysis.severityReason}`,
    ]),
    section("Executive summary", [analysis.executiveSummary]),
    section("Customer impact", [analysis.customerImpact]),
    section(
      "Affected services",
      analysis.affectedServices.map((service) => `${service.name} — ${service.status}: ${service.evidence.join(" | ")}`),
    ),
    section(
      "Timeline",
      analysis.timeline.map((event) => `${event.timestamp} [${event.severity}] ${event.title}: ${event.description}`),
    ),
    section(
      "Root-cause hypotheses",
      analysis.rootCauseHypotheses.flatMap((hypothesis, index) => [
        `${index + 1}. ${hypothesis.title} (${hypothesis.confidence}% confidence)`,
        `   ${hypothesis.explanation}`,
        `   Supports: ${hypothesis.supportingEvidence.join(" | ") || "None supplied"}`,
        `   Contradicts: ${hypothesis.contradictingEvidence.join(" | ") || "None supplied"}`,
        `   Verify: ${hypothesis.verificationSteps.join(" | ")}`,
      ]),
    ),
    section(
      "Action plan",
      [
        ...analysis.actionPlan.immediate.map((item) => `Immediate ${item.priority}: ${item.action}`),
        ...analysis.actionPlan.investigateNext.map((item) => `Investigate ${item.priority}: ${item.action}`),
        ...analysis.actionPlan.preventRecurrence.map((item) => `Prevent ${item.priority}: ${item.action}`),
      ],
    ),
    section("Healthy signals", analysis.healthySignals.map((signal) => `• ${signal}`)),
    section("Missing information", analysis.missingInformation.map((item) => `• ${item}`)),
    section("Limitations", analysis.limitations.map((item) => `• ${item}`)),
  ].join("\n");
}
