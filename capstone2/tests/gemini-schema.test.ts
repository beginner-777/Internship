import { describe, expect, it } from "vitest";
import { toGeminiResponseSchema } from "@/lib/gemini-schema";

describe("Gemini response schema compatibility", () => {
  it("removes unsupported string and draft metadata while preserving supported constraints", () => {
    const result = toGeminiResponseSchema({
      $schema: "http://json-schema.org/draft-07/schema#",
      type: "object",
      properties: {
        title: { type: "string", minLength: 1, maxLength: 160 },
        confidence: { type: "number", minimum: 0, maximum: 100 },
        events: { type: "array", maxItems: 60, items: { type: "string", minLength: 1 } },
      },
      required: ["title", "confidence", "events"],
      additionalProperties: false,
    });

    expect(result).toEqual({
      type: "object",
      properties: {
        title: { type: "string" },
        confidence: { type: "number", minimum: 0, maximum: 100 },
        events: { type: "array", maxItems: 60, items: { type: "string" } },
      },
      required: ["title", "confidence", "events"],
      additionalProperties: false,
    });
  });

  it("preserves null and boolean schema values", () => {
    expect(toGeminiResponseSchema({ nullable: null, additionalProperties: false })).toEqual({
      nullable: null,
      additionalProperties: false,
    });
  });
});
