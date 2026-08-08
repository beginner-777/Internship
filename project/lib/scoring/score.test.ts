import { describe, expect, it } from "vitest";
import { headingHasSkip } from "./score";

describe("scoring helpers", () => {
  it("detects skipped heading levels", () => {
    expect(headingHasSkip([1, 2, 3])).toBe(false);
    expect(headingHasSkip([1, 3])).toBe(true);
  });
});
