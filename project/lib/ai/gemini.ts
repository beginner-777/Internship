import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { buildDemoInsights } from "./demo";
import { CATEGORY_KEYS, type AuditResult } from "@/types/audit";

const actionSchema = z.object({
  title: z.string().min(3).max(160), detail: z.string().min(3).max(800),
  impact: z.enum(["high", "medium", "low"]), effort: z.enum(["high", "medium", "low"]),
  category: z.enum(CATEGORY_KEYS)
});
const insightsSchema = z.object({
  executiveSummary: z.string().min(20).max(1800),
  priorityIssues: z.array(z.string().min(3).max(600)).max(8),
  opportunities: z.array(z.string().min(3).max(600)).max(8),
  recommendations: z.array(z.string().min(3).max(600)).max(10),
  actionPlan: z.array(actionSchema).max(8),
  categoryInsights: z.partialRecord(z.enum(CATEGORY_KEYS), z.string().max(600))
});

function compactAudit(audit: Omit<AuditResult, "ai">) {
  return {
    url: audit.url, overallScore: audit.overallScore,
    categories: Object.fromEntries(audit.categories.map(category => [category.key, category.score])),
    metadata: { title: audit.signals.title, description: audit.signals.metaDescription, canonical: audit.signals.canonical, openGraph: audit.signals.openGraph },
    content: { h1: audit.signals.h1, h2Count: audit.signals.h2.length, wordCount: audit.signals.wordCount, headingSequence: audit.signals.headingSequence },
    links: audit.signals.links,
    performance: { responseTimeMs: audit.signals.responseTimeMs, responseBytes: audit.signals.responseBytes },
    mobile: { viewport: audit.signals.viewport },
    structuredData: audit.signals.structuredData,
    security: { https: audit.signals.https, headers: audit.signals.securityHeaders },
    indexability: { robotsMeta: audit.signals.robotsMeta, robotsTxt: audit.signals.robotsTxt, sitemap: audit.signals.sitemap },
    issues: audit.issues.filter(issue => issue.severity !== "passed").map(({ severity, category, title, description, whyItMatters, suggestedFix }) => ({ severity, category, title, description, whyItMatters, suggestedFix })),
    limitations: audit.limitations
  };
}

function safeJson(text: string): unknown {
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  return JSON.parse(cleaned);
}

type ProviderError = Error & { status?: number; code?: number | string };

function providerStatus(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null) return undefined;
  const candidate = error as ProviderError;
  if (typeof candidate.status === "number") return candidate.status;
  if (typeof candidate.code === "number") return candidate.code;
  const match = candidate.message?.match(/\b(400|401|403|404|408|429|500|502|503|504)\b/);
  return match ? Number(match[1]) : undefined;
}

function failureReason(error: unknown): string {
  const status = providerStatus(error);
  if (status === 400) return "Gemini rejected the request (HTTP 400). The API key project or request configuration needs review.";
  if (status === 401 || status === 403) return `Gemini rejected authentication (HTTP ${status}). The key may be invalid, restricted, or missing Generative Language API access.`;
  if (status === 404) return "The configured Gemini model is not available to this API key project (HTTP 404).";
  if (status === 429) return "Gemini quota is currently unavailable (HTTP 429); deterministic analysis is shown.";
  if (status === 408 || (status !== undefined && status >= 500)) return `Gemini is temporarily unavailable (HTTP ${status}); deterministic analysis is shown.`;
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  if (/fetch|network|enotfound|econn|timeout/.test(message)) return "The server could not connect to Gemini. Check the deployment region/network and try again.";
  return "Gemini request failed for an unclassified provider reason; deterministic analysis is shown.";
}

async function generate(client: GoogleGenAI, prompt: string, model: string) {
  return client.models.generateContent({
    model,
    contents: prompt,
    config: { responseMimeType: "application/json", temperature: 0.2, maxOutputTokens: 2600 }
  });
}

async function discoverGenerateModel(client: GoogleGenAI, excluded: Set<string>): Promise<string | null> {
  const pager = await client.models.list({ config: { pageSize: 100, queryBase: true } });
  const candidates: string[] = [];
  for await (const model of pager) {
    const name = model.name?.replace(/^models\//, "");
    const actions = model.supportedActions ?? [];
    if (!name || excluded.has(name) || !actions.some(action => action.toLowerCase().includes("generatecontent"))) continue;
    if (/image|vision|audio|live|tts|embedding|aqa/i.test(name)) continue;
    candidates.push(name);
  }
  candidates.sort((a, b) => {
    const rank = (name: string) => /flash-lite/i.test(name) ? 0 : /flash/i.test(name) ? 1 : /pro/i.test(name) ? 2 : 3;
    return rank(a) - rank(b) || b.localeCompare(a, undefined, { numeric: true });
  });
  return candidates[0] ?? null;
}

async function generateWithModelFallback(client: GoogleGenAI, prompt: string) {
  const configured = process.env.GEMINI_MODEL?.trim();
  const models = [...new Set([configured, "gemini-2.5-flash-lite", "gemini-2.5-flash"].filter((model): model is string => Boolean(model)))];
  let lastError: unknown;
  for (const model of models) {
    try { return await generate(client, prompt, model); }
    catch (error) {
      lastError = error;
      if (providerStatus(error) !== 404) throw error;
    }
  }
  const tried = new Set(models);
  const discovered = await discoverGenerateModel(client, tried);
  if (discovered) {
    console.info("[SYNAPSE_GEMINI_MODEL]", { model: discovered, source: "discovery" });
    return generate(client, prompt, discovered);
  }
  throw lastError;
}

export async function analyzeWithGemini(audit: Omit<AuditResult, "ai">): Promise<AuditResult["ai"]> {
  const demo = (reason: string): AuditResult["ai"] => ({ mode: "demo", label: "DEMO ANALYSIS", reason, insights: buildDemoInsights(audit) });
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return demo("No Gemini API key is configured. Recommendations are deterministic and based only on local checks.");
  try {
    const client = new GoogleGenAI({ apiKey });
    const prompt = `You are an expert technical SEO consultant. Analyze only the structured single-page audit below. Respect its limitations. Prioritize real detected issues; do not invent crawl, ranking, traffic, backlink, Search Console, Core Web Vitals, or rendered-DOM facts. Return JSON only with: executiveSummary (string), priorityIssues (string[]), opportunities (string[]), recommendations (string[]), actionPlan (objects: title, detail, impact high|medium|low, effort high|medium|low, category from ${CATEGORY_KEYS.join("|")}), categoryInsights (object keyed by audit categories).\n\nAUDIT:\n${JSON.stringify(compactAudit(audit))}`;
    let response;
    try {
      response = await generateWithModelFallback(client, prompt);
    } catch (firstError) {
      const status = providerStatus(firstError);
      if (status === 408 || status === 429 || (status !== undefined && status >= 500)) {
        await new Promise(resolve => setTimeout(resolve, 700));
        response = await generateWithModelFallback(client, prompt);
      } else throw firstError;
    }
    const validated = insightsSchema.safeParse(safeJson(response.text ?? ""));
    if (!validated.success) return demo("Gemini returned an invalid structured response, so deterministic analysis is shown.");
    return { mode: "live", label: "LIVE AI ANALYSIS", insights: validated.data };
  } catch (error) {
    const status = providerStatus(error);
    console.warn("[SYNAPSE_GEMINI_FAILURE]", { status: status ?? "unknown", category: status === 401 || status === 403 ? "authentication" : status === 429 ? "quota" : status && status >= 500 ? "provider" : "request" });
    return demo(failureReason(error));
  }
}