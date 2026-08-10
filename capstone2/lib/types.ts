import type { z } from "zod";
import type {
  actionItemSchema,
  incidentAnalysisSchema,
  incidentInputSchema,
} from "./schemas";

export type ActionItem = z.infer<typeof actionItemSchema>;
export type IncidentAnalysis = z.infer<typeof incidentAnalysisSchema>;
export type IncidentInput = z.infer<typeof incidentInputSchema>;

export type AnalysisMode = "gemini" | "demo" | "local";

export type StoredInvestigation = {
  version: 1;
  createdAt: string;
  mode: AnalysisMode;
  analysis: IncidentAnalysis;
  input: IncidentInput;
};
