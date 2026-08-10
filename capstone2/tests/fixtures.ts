import type { IncidentAnalysis, StoredInvestigation } from "@/lib/types";
import { sampleIncident } from "@/lib/sample-incident";

export const fixtureAnalysis: IncidentAnalysis = {
  incidentTitle: "Checkout failures after payments deployment",
  executiveSummary: "Checkout failures began after a deployment. Evidence shows payment timeouts and database connection-pool exhaustion; causation is not yet proven.",
  severity: "SEV-2",
  severityReason: "Potential payment-without-order impact requires urgent response.",
  overallConfidence: 82,
  customerImpact: "Some customers may have an approved payment without a created order.",
  affectedServices: [
    { id: "checkout-api", name: "checkout-api", status: "critical", evidence: ["POST /api/checkout 500"] },
    { id: "orders-db", name: "orders-db", status: "critical", evidence: ["connection pool exhausted"] },
    { id: "product-service", name: "product-service", status: "healthy", evidence: ["success=99.96%"] },
  ],
  relationships: [
    { source: "checkout-api", target: "orders-db", relationship: "creates orders through" },
  ],
  timeline: [
    { timestamp: "2026-08-08T13:48:11Z", title: "Deployment completed", description: "checkout-api v4.18.0 deployed", severity: "information", evidence: "deployment completed" },
    { timestamp: "2026-08-08T14:02:03Z", title: "Checkout failed", description: "POST checkout returned 500", severity: "critical", evidence: "checkout-api ERROR 500" },
    { timestamp: "2026-08-08T14:02:04Z", title: "Pool exhausted", description: "No idle database connections", severity: "warning", evidence: "orders-db pool exhausted" },
  ],
  rootCauseHypotheses: [{
    title: "Connection-pool exhaustion amplified checkout failures",
    explanation: "Pool exhaustion is contemporaneous with order failures, but the initiating condition is unproven.",
    confidence: 78,
    supportingEvidence: ["active=40 idle=0 pending=117"],
    contradictingEvidence: ["CPU and memory remained normal"],
    verificationSteps: ["Compare pool usage by application version."],
  }],
  actionPlan: {
    immediate: [{ id: "stabilize", action: "Use the checkout runbook to stabilize traffic.", rationale: "Reduce ongoing impact.", priority: "P0", ownerSuggestion: "Incident commander" }],
    investigateNext: [{ id: "trace", action: "Trace an affected request.", rationale: "Find the first divergent dependency.", priority: "P1", ownerSuggestion: "On-call engineer" }],
    preventRecurrence: [{ id: "guardrail", action: "Add pool saturation guardrails.", rationale: "Detect pressure earlier.", priority: "P2", ownerSuggestion: "Orders team" }],
  },
  healthySignals: ["product-service success=99.96%", "CPU and memory normal"],
  missingInformation: ["Affected transaction count", "Distributed traces"],
  limitations: ["Root causes remain hypotheses until verified."],
};

export const fixtureRecord: StoredInvestigation = {
  version: 1,
  createdAt: "2026-08-08T14:20:00Z",
  mode: "gemini",
  analysis: fixtureAnalysis,
  input: sampleIncident,
};
