import { describe, expect, it } from "vitest";
import { createLocalAnalysis } from "@/lib/local-analysis";
import { sampleIncident } from "@/lib/sample-incident";
import { clearInvestigation, loadInvestigation, parseStoredInvestigation, saveInvestigation } from "@/lib/storage";
import { prefersReducedMotion } from "@/lib/motion";
import { createTextReport } from "@/lib/report";
import { sanitizeEvidence } from "@/lib/sanitize";
import { fixtureRecord } from "./fixtures";

describe("basic local analysis", () => {
  it("extracts only supplied events and labels its limitations", () => {
    const analysis = createLocalAnalysis(sampleIncident);
    expect(analysis.timeline.length).toBeGreaterThan(2);
    expect(analysis.timeline.some((event) => event.evidence.includes("500"))).toBe(true);
    expect(analysis.limitations).toContain("Basic local analysis — not an AI analysis.");
    expect(analysis.overallConfidence).toBeLessThanOrEqual(100);
  });
});

describe("local storage parsing", () => {
  it("accepts valid records and rejects corrupted data", () => {
    expect(parseStoredInvestigation(JSON.stringify(fixtureRecord))?.analysis.severity).toBe("SEV-2");
    expect(parseStoredInvestigation("{broken")).toBeNull();
    expect(parseStoredInvestigation(JSON.stringify({ version: 99 }))).toBeNull();
  });
  it("saves, loads, and clears the latest valid record", () => {
    saveInvestigation(fixtureRecord);
    expect(loadInvestigation()?.analysis.incidentTitle).toBe(fixtureRecord.analysis.incidentTitle);
    clearInvestigation();
    expect(loadInvestigation()).toBeNull();
  });
});

describe("reduced motion", () => {
  it("uses the operating-system media preference", () => {
    expect(prefersReducedMotion({ matches: true })).toBe(true);
    expect(prefersReducedMotion({ matches: false })).toBe(false);
  });
});

describe("reporting and sanitization", () => {
  it("creates a complete text report and strips dangerous controls", () => {
    const report = createTextReport(fixtureRecord);
    expect(report).toContain("TRACE AI — Incident Investigation Report");
    expect(report).toContain("Root-cause hypotheses");
    expect(sanitizeEvidence("safe\u0000text\nline")).toBe("safetext\nline");
  });
});
