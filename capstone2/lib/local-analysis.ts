import type { IncidentAnalysis, IncidentInput } from "./types";

const timestampPattern = /\b(\d{4}-\d{2}-\d{2}[T ][0-2]\d:[0-5]\d(?::[0-5]\d(?:\.\d+)?)?Z?|[0-2]\d:[0-5]\d(?::[0-5]\d)?)\b/;
const servicePattern = /\b([a-z][a-z0-9]*(?:[-_](?:api|service|db|worker|gateway|cache|queue|server))+)\b/gi;
const healthyPattern = /\b(healthy|normal|success(?:=| rate )?9\d|no resource saturation)\b/i;
const criticalPattern = /\b(500|fatal|panic|outage|exhausted|failed|failure|unavailable|captured payment|charged)\b/i;
const warningPattern = /\b(warn|timeout|degraded|retry|latency|pending|alert)\b/i;

function slug(value: string): string {
  return value.toLowerCase().replace(/_/g, "-").replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "");
}

function short(value: string, max = 240): string {
  const clean = value.trim().replace(/\s+/g, " ");
  return clean.length <= max ? clean : `${clean.slice(0, max - 1)}…`;
}

function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

export function createLocalAnalysis(input: IncidentInput): IncidentAnalysis {
  const lines = input.evidence.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const errorLines = lines.filter((line) => criticalPattern.test(line));
  const warningLines = lines.filter((line) => warningPattern.test(line));
  const healthyLines = lines.filter((line) => healthyPattern.test(line));
  const httpStatuses = unique(lines.flatMap((line) => line.match(/\b[1-5]\d{2}\b/g) ?? []));

  const serviceNames = unique(
    lines.flatMap((line) => [...line.matchAll(servicePattern)].map((match) => match[1].replace(/_/g, "-"))),
  ).slice(0, 10);

  const affectedServices = serviceNames.map((name) => {
    const related = lines.filter((line) => line.toLowerCase().includes(name.toLowerCase())).slice(0, 4);
    const isHealthy = related.some((line) => healthyPattern.test(line));
    const isCritical = related.some((line) => criticalPattern.test(line));
    return {
      id: slug(name),
      name,
      status: isHealthy && !isCritical ? ("healthy" as const) : isCritical ? ("critical" as const) : ("degraded" as const),
      evidence: related.map((line) => short(line, 300)),
    };
  });

  const timeline = lines
    .filter((line) => timestampPattern.test(line))
    .slice(0, 40)
    .map((line) => {
      const timestamp = line.match(timestampPattern)?.[1] ?? "Timestamp unavailable";
      const description = short(line.replace(timestampPattern, "").replace(/^\s*[\[\]-]+/, ""), 420);
      const severity = criticalPattern.test(line)
        ? ("critical" as const)
        : warningPattern.test(line)
          ? ("warning" as const)
          : ("information" as const);
      return {
        timestamp,
        title:
          severity === "critical" ? "Failure signal detected" : severity === "warning" ? "Degradation signal detected" : "Observed event",
        description,
        severity,
        evidence: short(line, 360),
      };
    });

  const hasCustomerImpact = /customer|payment|charged|order|checkout/i.test(`${input.actualBehaviour}\n${input.evidence}`);
  const has500 = httpStatuses.includes("500") || /HTTP\s*500/i.test(input.evidence);
  const severity = has500 && hasCustomerImpact ? "SEV-2" : errorLines.length > 2 ? "SEV-3" : "SEV-4";
  const confidence = Math.min(78, 32 + timeline.length * 3 + affectedServices.length * 2);
  const firstError = errorLines[0] ? short(errorLines[0], 330) : "The evidence contains failure language but no single initiating event was proven.";

  const hypotheses = [
    {
      title: "Repeated failure signals may share a common dependency",
      explanation:
        "This is a rule-based hypothesis: repeated errors close together can indicate a constrained or unavailable downstream dependency. The supplied text does not prove causation.",
      confidence: Math.min(72, 38 + errorLines.length * 4),
      supportingEvidence: errorLines.slice(0, 4).map((line) => short(line, 360)),
      contradictingEvidence: healthyLines.slice(0, 2).map((line) => short(line, 360)),
      verificationSteps: [
        "Compare the first failure time with deployment and dependency telemetry.",
        "Trace one affected request across service boundaries using its correlation ID.",
        "Check saturation, queue depth, connection pools, and upstream latency for the same window.",
      ],
    },
  ];

  const criticalServices = affectedServices.filter((service) => service.status !== "healthy");
  const relationships = criticalServices.slice(1).map((service, index) => ({
    source: criticalServices[index]?.id ?? criticalServices[0]?.id ?? service.id,
    target: service.id,
    relationship: "Possible incident-path relationship; verify with traces",
  }));

  return {
    incidentTitle: input.incidentTitle || `${input.systemType} incident investigation`,
    executiveSummary: `Basic pattern scanning found ${errorLines.length} failure signal${errorLines.length === 1 ? "" : "s"}, ${warningLines.length} warning signal${warningLines.length === 1 ? "" : "s"}, and ${timeline.length} timestamped event${timeline.length === 1 ? "" : "s"}. This summary is produced locally and does not establish a root cause.`,
    severity,
    severityReason: `${severity} is suggested from the presence and apparent impact of error signals. Human incident command must confirm severity against the organisation’s policy.`,
    overallConfidence: confidence,
    customerImpact: hasCustomerImpact
      ? `The supplied evidence mentions possible customer-facing impact: ${short(input.actualBehaviour, 420)}`
      : "No explicit customer-impact statement was detected in the supplied evidence.",
    affectedServices,
    relationships,
    timeline,
    rootCauseHypotheses: hypotheses,
    actionPlan: {
      immediate: [
        {
          id: "stabilize-traffic",
          action: "Apply the lowest-risk stabilisation defined in the service runbook.",
          rationale: "Reduce ongoing impact while preserving evidence; no command is executed by TRACE AI.",
          priority: "P0",
          ownerSuggestion: "Incident commander",
        },
        {
          id: "preserve-evidence",
          action: "Preserve logs, traces, deployment metadata, and affected request identifiers.",
          rationale: "Prevents short-retention evidence from disappearing during investigation.",
          priority: "P0",
          ownerSuggestion: "Observability owner",
        },
      ],
      investigateNext: [
        {
          id: "trace-request",
          action: "Trace a failed and a successful request across the same incident window.",
          rationale: "A controlled comparison can isolate the first divergent service or dependency.",
          priority: "P1",
          ownerSuggestion: "On-call engineer",
        },
        {
          id: "compare-change",
          action: "Correlate the first failure with deployments, configuration changes, and dependency health.",
          rationale: "Temporal proximity is evidence to test, not proof of causation.",
          priority: "P1",
          ownerSuggestion: "Release owner",
        },
      ],
      preventRecurrence: [
        {
          id: "close-observability-gaps",
          action: "Add alerts and trace attributes for the evidence gaps confirmed during review.",
          rationale: "Better attribution shortens future time-to-diagnosis.",
          priority: "P2",
          ownerSuggestion: "Service team",
        },
      ],
    },
    healthySignals: healthyLines.length
      ? healthyLines.slice(0, 8).map((line) => short(line, 380))
      : ["No explicit healthy signal was detected; absence of an error is not proof of health."],
    missingInformation: [
      "Distributed trace or correlation identifiers linking affected requests across services.",
      "A confirmed count of affected customers and transactions.",
      "Baseline and incident-window dependency saturation metrics.",
      ...(timestampPattern.test(input.evidence) ? [] : ["Timestamped evidence for reliable event ordering."]),
    ],
    limitations: [
      "Basic local analysis — not an AI analysis.",
      "Pattern matching cannot understand all service semantics or prove causation.",
      `The first detected error fragment was: “${firstError}”`,
    ],
  };
}
