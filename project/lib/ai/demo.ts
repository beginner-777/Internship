import type { AiInsights, AuditIssue, AuditResult, CategoryKey } from "@/types/audit";

const categoryAdvice: Record<CategoryKey, string> = {
  technical: "Stabilize crawlable responses and machine-readable document signals.",
  content: "Clarify the page topic and expand only where it better satisfies visitor intent.",
  metadata: "Make every search-result signal specific, accurate, and unique.",
  links: "Preserve clean crawl paths and repair destinations that no longer respond.",
  performance: "Reduce server and document work before optimizing secondary visual effects.",
  indexability: "Confirm crawl directives match the page’s intended search visibility.",
  accessibility: "Make visual content understandable without relying on sight alone.",
  mobile: "Ensure the document adapts predictably to small viewports.",
  structuredData: "Add only valid schema that accurately represents visible content.",
  security: "Protect transport and strengthen browser response policies."
};

export function buildDemoInsights(audit: Omit<AuditResult, "ai">): AiInsights {
  const failures = audit.issues.filter(issue => issue.severity !== "passed").sort((a, b) => (a.severity === "critical" ? -1 : 1) - (b.severity === "critical" ? -1 : 1));
  const weakest = [...audit.categories].sort((a, b) => a.score - b.score).slice(0, 3);
  const action = (issue: AuditIssue, index: number) => ({
    title: issue.title,
    detail: issue.suggestedFix,
    impact: issue.severity === "critical" || index === 0 ? "high" as const : "medium" as const,
    effort: /title|description|viewport|alt/i.test(issue.title) ? "low" as const : "medium" as const,
    category: issue.category
  });
  return {
    executiveSummary: failures.length
      ? `The local audit scored ${audit.overallScore}/100. The highest leverage work is concentrated in ${weakest.map(item => item.label).join(", ")}. Address blocking issues first, then improve warning-level signals.`
      : `The local audit scored ${audit.overallScore}/100 with no critical or warning checks in the available single-page dataset. Continue with full-site, field-performance, and search-console validation.`,
    priorityIssues: failures.slice(0, 4).map(issue => `${issue.title}: ${issue.description}`),
    opportunities: weakest.map(category => `${category.label}: ${categoryAdvice[category.key]}`),
    recommendations: failures.slice(0, 5).map(issue => issue.suggestedFix),
    actionPlan: failures.slice(0, 6).map(action),
    categoryInsights: Object.fromEntries(audit.categories.map(category => [category.key, `${category.score}/100 — ${categoryAdvice[category.key]}`]))
  };
}
