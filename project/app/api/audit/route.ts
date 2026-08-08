import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { runAudit } from "@/lib/audit/engine";
import { rateLimit } from "@/lib/security/rate-limit";
import type { AuditResult } from "@/types/audit";

export const runtime = "nodejs";
export const maxDuration = 30;

const bodySchema = z.object({ url: z.string().trim().min(3).max(2048) });
const cache = new Map<string, { expires: number; value: AuditResult }>();
const errors: Record<string, { status: number; code: string; message: string }> = {
  INVALID_URL: { status: 400, code: "INVALID_URL", message: "Enter a valid public website URL." },
  UNSAFE_URL: { status: 400, code: "UNSAFE_URL", message: "Only public HTTP or HTTPS website URLs can be audited." },
  UNSAFE_PORT: { status: 400, code: "UNSAFE_URL", message: "Only standard web ports can be audited." },
  PRIVATE_DESTINATION: { status: 400, code: "UNSAFE_URL", message: "Private and internal network destinations are blocked." },
  DNS_FAILED: { status: 422, code: "WEBSITE_UNAVAILABLE", message: "The website address could not be resolved." },
  FETCH_TIMEOUT: { status: 504, code: "TIMEOUT", message: "The website took too long to respond." },
  RESPONSE_TOO_LARGE: { status: 413, code: "LARGE_RESPONSE", message: "The page is larger than the safe audit limit." },
  TOO_MANY_REDIRECTS: { status: 422, code: "REDIRECT_LIMIT", message: "The website redirected too many times." },
  UNSUPPORTED_CONTENT: { status: 415, code: "UNSUPPORTED_CONTENT", message: "The target did not return an HTML page." },
  WEBSITE_UNAVAILABLE: { status: 422, code: "WEBSITE_UNAVAILABLE", message: "The website is unavailable or blocks this audit request." }
};

export async function POST(request: NextRequest) {
  const client = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous";
  const limited = rateLimit(client);
  if (!limited.allowed) return NextResponse.json({ error: { code: "RATE_LIMIT", message: "Too many audits. Please wait before trying again." } }, { status: 429, headers: { "Retry-After": String(limited.retryAfter) } });
  let data: z.infer<typeof bodySchema>;
  try { data = bodySchema.parse(await request.json()); }
  catch { return NextResponse.json({ error: { code: "INVALID_REQUEST", message: "Enter a valid website URL." } }, { status: 400 }); }
  const key = data.url.toLowerCase();
  const existing = cache.get(key);
  if (existing && existing.expires > Date.now()) return NextResponse.json(existing.value, { headers: { "X-Synapse-Cache": "HIT" } });
  try {
    const result = await runAudit(data.url);
    cache.set(key, { expires: Date.now() + 10 * 60_000, value: result });
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store", "X-Synapse-Cache": "MISS" } });
  } catch (error) {
    const key = error instanceof Error ? error.message : "UNKNOWN";
    const mapped = errors[key] ?? { status: 500, code: "AUDIT_FAILED", message: "The audit could not be completed. Please try again." };
    return NextResponse.json({ error: { code: mapped.code, message: mapped.message } }, { status: mapped.status });
  }
}
