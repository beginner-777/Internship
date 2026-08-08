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

export async function analyzeWithGemini(audit: Omit<AuditResult, "ai">): Promise<AuditResult["ai"]> {
  const demo = (reason: string): AuditResult["ai"] => ({ mode: "demo", label: "DEMO ANALYSIS", reason, insights: buildDemoInsights(audit) });
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return demo("No Gemini API key is configured. Recommendations are deterministic and based only on local checks.");
  try {
    const client = new GoogleGenAI({ apiKey });
    const prompt = `You are an expert technical SEO consultant. Analyze only the structured single-page audit below. Respect its limitations. Prioritize real detected issues; do not invent crawl, ranking, traffic, backlink, Search Console, Core Web Vitals, or rendered-DOM facts. Return JSON only with: executiveSummary (string), priorityIssues (string[]), opportunities (string[]), recommendations (string[]), actionPlan (objects: title, detail, impact high|medium|low, effort high|medium|low, category from ${CATEGORY_KEYS.join("|")}), categoryInsights (object keyed by audit categories).\n\nAUDIT:\n${JSON.stringify(compactAudit(audit))}`;
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json", temperature: 0.2, maxOutputTokens: 2600 }
    });
    const validated = insightsSchema.safeParse(safeJson(response.text ?? ""));
    if (!validated.success) return demo("Gemini returned an invalid structured response, so deterministic analysis is shown.");
    return { mode: "live", label: "LIVE AI ANALYSIS", insights: validated.data };
  } catch (error) {
    const message = error instanceof Error ? error.message.toLowerCase() : "";
    const reason = /quota|resource_exhausted|429/.test(message)
      ? "Gemini quota is currently unavailable; deterministic analysis is shown."
      : "Gemini could not be reached; deterministic analysis is shown.";
    return demo(reason);
  }
}
