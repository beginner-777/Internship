import { describe, expect, it } from "vitest";
import { isPrivateAddress, normalizeUrl } from "@/lib/security/url";

describe("URL security", () => {
  it("normalizes public web URLs", () => expect(normalizeUrl("example.com").href).toBe("https://example.com/"));
  it("blocks credentials and internal hosts", () => {
    expect(() => normalizeUrl("http://localhost/admin")).toThrow();
    expect(() => normalizeUrl("https://u:p@example.com")).toThrow();
  });
  it("rejects non-web URL schemes before a network lookup", () => {
    expect(() => normalizeUrl("ftp://example.com")).toThrow("UNSAFE_URL");
    expect(() => normalizeUrl("javascript:alert(1)")).toThrow("UNSAFE_URL");
  });
  it("recognizes private network ranges", () => {
    expect(isPrivateAddress("127.0.0.1")).toBe(true);
    expect(isPrivateAddress("192.168.1.2")).toBe(true);
    expect(isPrivateAddress("93.184.216.34")).toBe(false);
  });
});
