import { describe, expect, it } from "vitest";
import { incidentInputSchema } from "@/lib/schemas";
import { sampleIncident } from "@/lib/sample-incident";
import { detectSecrets, redactDetectedSecrets } from "@/lib/secret-detection";

describe("incident form validation", () => {
  it("accepts a complete incident and rejects short evidence", () => {
    expect(incidentInputSchema.safeParse(sampleIncident).success).toBe(true);
    const result = incidentInputSchema.safeParse({ ...sampleIncident, evidence: "too short" });
    expect(result.success).toBe(false);
  });
  it("enforces the combined 15,000 character limit", () => {
    const result = incidentInputSchema.safeParse({ ...sampleIncident, evidence: "e".repeat(12000), notes: "n".repeat(3000) });
    expect(result.success).toBe(false);
  });
});

describe("secret detection", () => {
  it("finds and redacts sensitive-looking values without touching the original", () => {
    const input = "Authorization: Bearer abcdefghijklmnopqrstuvwxyz password=supersecret admin@example.com";
    const matches = detectSecrets(input);
    expect(matches.map((match) => match.kind)).toEqual(expect.arrayContaining(["Bearer token", "Password", "Email"]));
    const redacted = redactDetectedSecrets(input, matches);
    expect(redacted).toContain("[REDACTED BEARER TOKEN]");
    expect(input).toContain("supersecret");
  });
});
