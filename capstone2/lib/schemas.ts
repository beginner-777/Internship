import { z } from "zod";

const confidence = z.number().min(0).max(100);

export const actionItemSchema = z.object({
  id: z.string().min(1).max(80),
  action: z.string().min(1).max(500),
  rationale: z.string().min(1).max(700),
  priority: z.enum(["P0", "P1", "P2", "P3"]),
  ownerSuggestion: z.string().min(1).max(120),
});

export const incidentAnalysisSchema = z.object({
  incidentTitle: z.string().min(1).max(160),
  executiveSummary: z.string().min(1).max(1600),
  severity: z.enum(["SEV-1", "SEV-2", "SEV-3", "SEV-4"]),
  severityReason: z.string().min(1).max(800),
  overallConfidence: confidence,
  customerImpact: z.string().min(1).max(1000),
  affectedServices: z
    .array(
      z.object({
        id: z.string().min(1).max(80),
        name: z.string().min(1).max(120),
        status: z.enum(["critical", "degraded", "healthy", "unknown"]),
        evidence: z.array(z.string().min(1).max(500)).max(12),
      }),
    )
    .max(20),
  relationships: z
    .array(
      z.object({
        source: z.string().min(1).max(80),
        target: z.string().min(1).max(80),
        relationship: z.string().min(1).max(160),
      }),
    )
    .max(40),
  timeline: z
    .array(
      z.object({
        timestamp: z.string().min(1).max(80),
        title: z.string().min(1).max(180),
        description: z.string().min(1).max(700),
        severity: z.enum(["critical", "warning", "information"]),
        evidence: z.string().min(1).max(500),
      }),
    )
    .max(60),
  rootCauseHypotheses: z
    .array(
      z.object({
        title: z.string().min(1).max(180),
        explanation: z.string().min(1).max(1000),
        confidence,
        supportingEvidence: z.array(z.string().min(1).max(500)).max(12),
        contradictingEvidence: z.array(z.string().min(1).max(500)).max(12),
        verificationSteps: z.array(z.string().min(1).max(500)).max(12),
      }),
    )
    .max(8),
  actionPlan: z.object({
    immediate: z.array(actionItemSchema).max(12),
    investigateNext: z.array(actionItemSchema).max(12),
    preventRecurrence: z.array(actionItemSchema).max(12),
  }),
  healthySignals: z.array(z.string().min(1).max(500)).max(20),
  missingInformation: z.array(z.string().min(1).max(500)).max(20),
  limitations: z.array(z.string().min(1).max(500)).max(12),
});

const incidentInputFields = z.object({
    incidentTitle: z.string().max(160),
    systemType: z.string().min(2, "Select or describe a system type.").max(120),
    environment: z.enum(["production", "staging", "development"]),
    startTime: z.string().min(1, "Add the incident start date and time."),
    expectedBehaviour: z.string().min(10, "Describe the expected behaviour.").max(2000),
    actualBehaviour: z.string().min(10, "Describe the actual behaviour.").max(3000),
    evidence: z
      .string()
      .min(80, "Provide at least 80 characters of technical evidence.")
      .max(12000),
    notes: z.string().max(3000),
  });

export const incidentDraftSchema = incidentInputFields.partial();

export const incidentInputSchema = incidentInputFields.superRefine((value, context) => {
    const total = [
      value.incidentTitle,
      value.systemType,
      value.expectedBehaviour,
      value.actualBehaviour,
      value.evidence,
      value.notes,
    ].join("\n").length;
    if (total > 15000) {
      context.addIssue({
        code: "custom",
        path: ["evidence"],
        message: "Total incident content must stay within 15,000 characters.",
      });
    }
  });

export const analyzeRequestSchema = z.object({ input: incidentInputSchema });

export const analyzeResponseSchema = z.object({
  ok: z.literal(true),
  mode: z.enum(["gemini", "demo", "local"]),
  label: z.string(),
  analysis: incidentAnalysisSchema,
});

export const safeErrorSchema = z.object({
  ok: z.literal(false),
  code: z.enum([
    "INVALID_INPUT",
    "RATE_LIMITED",
    "AUTH_FAILED",
    "SAFETY_REJECTED",
    "TIMEOUT",
    "INVALID_RESPONSE",
    "UPSTREAM_UNAVAILABLE",
    "SERVER_ERROR",
  ]),
  message: z.string(),
});
