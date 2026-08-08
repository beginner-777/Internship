import { buildDemoInsights } from "@/lib/ai/demo";
import { scoreAudit } from "@/lib/scoring/score";
import type { AuditResult, PageSignals } from "@/types/audit";

const base: PageSignals = {
  finalUrl: "https://sample.synapse.local/", statusCode: 200, responseTimeMs: 840,
  responseBytes: 128000, contentType: "text/html; charset=utf-8",
  title: "Neural infrastructure for modern product teams", metaDescription: "Build, observe, and improve intelligent digital products with a secure platform designed for modern engineering teams.",
  canonical: "https://sample.synapse.local/", robotsMeta: "index,follow", language: "en",
  viewport: "width=device-width, initial-scale=1", h1: ["Intelligence that compounds"], h2: ["One platform", "Built for teams"],
  headingSequence: [1, 2, 2], wordCount: 544, images: { total: 12, missingAlt: 2 },
  links: { internal: 18, external: 4, invalid: 0, sampledBroken: 0, sampled: 5 },
  openGraph: { title: true, description: true, image: true }, structuredData: { blocks: 0, types: [], invalid: 0 },
  robotsTxt: { available: true, blocksPage: false }, sitemap: { available: true, declaredInRobots: true },
  https: true, securityHeaders: ["content-security-policy", "strict-transport-security", "x-content-type-options", "referrer-policy"]
};

const variants: Record<string, { name: string; url: string; changes: Partial<PageSignals> }> = {
  saas: { name: "AI SaaS Website", url: "https://sample-ai-saas.dev/", changes: {} },
  ecommerce: { name: "E-Commerce Website", url: "https://sample-commerce.dev/", changes: { responseTimeMs: 2680, responseBytes: 740000, structuredData: { blocks: 2, types: ["Product", "Organization"], invalid: 0 }, images: { total: 34, missingAlt: 9 } } },
  portfolio: { name: "Developer Portfolio", url: "https://sample-portfolio.dev/", changes: { wordCount: 186, metaDescription: null, links: { internal: 8, external: 12, invalid: 0, sampledBroken: 1, sampled: 5 } } },
  startup: { name: "Startup Landing Page", url: "https://sample-startup.dev/", changes: { canonical: null, h1: [], headingSequence: [2, 3, 2], securityHeaders: ["x-content-type-options"] } }
};

export function getSampleAudit(kind = "saas"): AuditResult {
  const variant = variants[kind] ?? variants.saas;
  const signals = { ...base, ...variant.changes, finalUrl: variant.url };
  const scored = scoreAudit(signals);
  const auditBase = {
    id: `sample-${kind}`, url: variant.url, auditedAt: "2026-08-08T10:00:00.000Z",
    overallScore: scored.overallScore, categories: scored.categories, signals, issues: scored.issues,
    limitations: ["Sample audit for product exploration.", "No live website or Gemini request was used."]
  };
  return { ...auditBase, ai: { mode: "demo", label: "DEMO ANALYSIS", reason: "This is a clearly labeled sample audit.", insights: buildDemoInsights(auditBase) } };
}

export const SAMPLE_LIST = Object.entries(variants).map(([id, value]) => ({ id, name: value.name, url: value.url }));
