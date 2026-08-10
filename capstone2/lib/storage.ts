import { z } from "zod";
import { incidentAnalysisSchema, incidentInputSchema } from "./schemas";
import type { StoredInvestigation } from "./types";

export const STORAGE_KEY = "trace-ai.latest-investigation.v1";

const storedInvestigationSchema = z.object({
  version: z.literal(1),
  createdAt: z.string(),
  mode: z.enum(["gemini", "demo", "local"]),
  analysis: incidentAnalysisSchema,
  input: incidentInputSchema,
});

export function parseStoredInvestigation(raw: string | null): StoredInvestigation | null {
  if (!raw) return null;
  try {
    return storedInvestigationSchema.parse(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function saveInvestigation(value: StoredInvestigation): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

export function loadInvestigation(): StoredInvestigation | null {
  return parseStoredInvestigation(localStorage.getItem(STORAGE_KEY));
}

export function clearInvestigation(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export const DRAFT_KEY = "trace-ai.incident-draft.v1";

export function saveDraft(value: unknown): void {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(value));
}

export function loadDraft(): unknown {
  const raw = localStorage.getItem(DRAFT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
