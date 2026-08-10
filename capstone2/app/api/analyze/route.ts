import { NextResponse } from "next/server";
import { analyzeWithGemini, normalizeGeminiError } from "@/lib/gemini";
import { createLocalAnalysis } from "@/lib/local-analysis";
import { analyzeRequestSchema } from "@/lib/schemas";
import { sanitizeEvidence } from "@/lib/sanitize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RateRecord = { count: number; resetAt: number };
const globalRate = globalThis as typeof globalThis & { traceAiRateLimit?: Map<string, RateRecord> };
const rateLimit = globalRate.traceAiRateLimit ?? new Map<string, RateRecord>();
globalRate.traceAiRateLimit = rateLimit;

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const current = rateLimit.get(ip);
  if (!current || now >= current.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  current.count += 1;
  return current.count > 5;
}

function sanitizePayload(value: unknown): unknown {
  if (typeof value === "string") return sanitizeEvidence(value);
  if (Array.isArray(value)) return value.map(sanitizePayload);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, sanitizePayload(item)]));
  }
  return value;
}

export async function POST(request: Request): Promise<NextResponse> {
  const requestId = crypto.randomUUID();
  if (isRateLimited(getClientIp(request))) {
    return NextResponse.json(
      { ok: false, code: "RATE_LIMITED", message: "Five analyses per minute are allowed. Try again shortly." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ ok: false, code: "INVALID_INPUT", message: "The request body is not valid JSON." }, { status: 400 });
  }

  const parsed = analyzeRequestSchema.safeParse(sanitizePayload(raw));
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, code: "INVALID_INPUT", message: parsed.error.issues[0]?.message ?? "Check the incident fields and try again." },
      { status: 400 },
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const analysis = createLocalAnalysis(parsed.data.input);
    analysis.limitations.unshift("Demo Analysis — no live Gemini request was made because the server API key is not configured.");
    return NextResponse.json({ ok: true, mode: "demo", label: "Demo Analysis", analysis });
  }

  const timeout = AbortSignal.timeout(25_000);
  const signal = AbortSignal.any([request.signal, timeout]);

  try {
    const analysis = await analyzeWithGemini(
      parsed.data.input,
      apiKey,
      process.env.GEMINI_MODEL || "gemini-3.6-flash",
      signal,
    );
    return NextResponse.json({ ok: true, mode: "gemini", label: "Live Gemini analysis", analysis });
  } catch (error) {
    const normalized = normalizeGeminiError(error);
    console.warn("TRACE_ANALYSIS_FAILURE", { requestId, code: normalized.code });
    return NextResponse.json({ ok: false, code: normalized.code, message: normalized.message }, { status: normalized.status });
  }
}
