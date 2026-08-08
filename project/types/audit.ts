export const CATEGORY_KEYS = [
  "technical", "content", "metadata", "links", "performance",
  "indexability", "accessibility", "mobile", "structuredData", "security"
] as const;

export type CategoryKey = typeof CATEGORY_KEYS[number];
export type Severity = "critical" | "warning" | "passed";
export type AiMode = "live" | "demo";

export interface AuditIssue {
  id: string;
  severity: Severity;
  category: CategoryKey;
  title: string;
  description: string;
  whyItMatters: string;
  suggestedFix: string;
  reviewed?: boolean;
}

export interface PageSignals {
  finalUrl: string;
  statusCode: number;
  responseTimeMs: number;
  responseBytes: number;
  contentType: string;
  title: string | null;
  metaDescription: string | null;
  canonical: string | null;
  robotsMeta: string | null;
  language: string | null;
  viewport: string | null;
  h1: string[];
  h2: string[];
  headingSequence: number[];
  wordCount: number;
  images: { total: number; missingAlt: number };
  links: { internal: number; external: number; invalid: number; sampledBroken: number; sampled: number };
  openGraph: { title: boolean; description: boolean; image: boolean };
  structuredData: { blocks: number; types: string[]; invalid: number };
  robotsTxt: { available: boolean; blocksPage: boolean };
  sitemap: { available: boolean; declaredInRobots: boolean };
  https: boolean;
  securityHeaders: string[];
}

export interface CategoryResult {
  key: CategoryKey;
  label: string;
  score: number;
  status: "healthy" | "warning" | "critical";
  issueCount: number;
  opportunityCount: number;
}

export interface AiAction {
  title: string;
  detail: string;
  impact: "high" | "medium" | "low";
  effort: "high" | "medium" | "low";
  category: CategoryKey;
}

export interface AiInsights {
  executiveSummary: string;
  priorityIssues: string[];
  opportunities: string[];
  recommendations: string[];
  actionPlan: AiAction[];
  categoryInsights: Partial<Record<CategoryKey, string>>;
}

export interface AuditResult {
  id: string;
  url: string;
  auditedAt: string;
  overallScore: number;
  categories: CategoryResult[];
  signals: PageSignals;
  issues: AuditIssue[];
  ai: { mode: AiMode; label: "LIVE AI ANALYSIS" | "DEMO ANALYSIS"; reason?: string; insights: AiInsights };
  limitations: string[];
}

export interface AuditApiError {
  error: { code: string; message: string };
}
