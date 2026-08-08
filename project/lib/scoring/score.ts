import { CATEGORY_KEYS, type AuditIssue, type CategoryKey, type CategoryResult, type PageSignals, type Severity } from "@/types/audit";

const LABELS: Record<CategoryKey, string> = {
  technical: "Technical SEO", content: "Content", metadata: "Metadata", links: "Links",
  performance: "Performance", indexability: "Indexability", accessibility: "Accessibility",
  mobile: "Mobile SEO", structuredData: "Structured Data", security: "Security"
};

type Check = { category: CategoryKey; severity: Severity; title: string; description: string; why: string; fix: string; penalty?: number };

export function headingHasSkip(sequence: number[]): boolean {
  return sequence.some((level, index) => index > 0 && level - sequence[index - 1] > 1);
}

export function scoreAudit(s: PageSignals): { overallScore: number; categories: CategoryResult[]; issues: AuditIssue[] } {
  const checks: Check[] = [];
  const add = (check: Check) => checks.push(check);
  const check = (condition: boolean, failure: Omit<Check, "severity"> & { severity?: "critical" | "warning" }, passed: Omit<Check, "severity" | "penalty">) => {
    if (condition) add({ ...passed, severity: "passed" });
    else add({ ...failure, severity: failure.severity ?? "warning" });
  };

  check(s.statusCode >= 200 && s.statusCode < 400,
    { category: "technical", severity: "critical", title: "Unhealthy page response", description: `The audited page returned HTTP ${s.statusCode}.`, why: "Search crawlers may not index an error response.", fix: "Serve the canonical page with a stable 2xx response.", penalty: 45 },
    { category: "technical", title: "Healthy page response", description: `HTTP ${s.statusCode} received.`, why: "Successful responses are crawlable.", fix: "No action needed." });
  check(Boolean(s.language),
    { category: "technical", title: "Document language is missing", description: "No lang attribute was found on the HTML element.", why: "Language metadata helps crawlers and assistive technology.", fix: "Add a valid lang attribute to the html element.", penalty: 12 },
    { category: "technical", title: "Document language declared", description: `Language is ${s.language}.`, why: "Language is machine-readable.", fix: "No action needed." });

  check(Boolean(s.title),
    { category: "metadata", severity: "critical", title: "Missing page title", description: "No non-empty title element was detected.", why: "The title is a primary relevance and search-result signal.", fix: "Add one concise, descriptive title in the document head.", penalty: 48 },
    { category: "metadata", title: "Page title present", description: `A ${s.title?.length ?? 0}-character title was detected.`, why: "The page has a search-result title signal.", fix: "No action needed." });
  if (s.title && (s.title.length < 15 || s.title.length > 65)) add({ category: "metadata", severity: "warning", title: "Title length needs review", description: `The title is ${s.title.length} characters.`, why: "Very short titles lack context; long titles can truncate.", fix: "Aim for a descriptive title around 30–60 characters.", penalty: 14 });
  check(Boolean(s.metaDescription),
    { category: "metadata", title: "Missing meta description", description: "No meta description was detected.", why: "Search engines may generate a less useful snippet.", fix: "Write a unique, accurate description for the page.", penalty: 24 },
    { category: "metadata", title: "Meta description present", description: `A ${s.metaDescription?.length ?? 0}-character description was detected.`, why: "The page can provide a preferred snippet.", fix: "No action needed." });
  if (s.metaDescription && (s.metaDescription.length < 70 || s.metaDescription.length > 170)) add({ category: "metadata", severity: "warning", title: "Meta description length needs review", description: `The description is ${s.metaDescription.length} characters.`, why: "Descriptions outside common display ranges can be weak or truncated.", fix: "Write a useful description around 120–160 characters.", penalty: 12 });
  check(Boolean(s.canonical),
    { category: "metadata", title: "Canonical link missing", description: "No canonical URL was found.", why: "Canonical hints reduce ambiguity between duplicate URLs.", fix: "Add a self-referencing canonical link when appropriate.", penalty: 16 },
    { category: "metadata", title: "Canonical link present", description: "A canonical URL was detected.", why: "The preferred URL is declared.", fix: "Verify it remains correct." });

  check(s.h1.length === 1,
    { category: "content", severity: s.h1.length === 0 ? "critical" : "warning", title: s.h1.length === 0 ? "Missing H1 heading" : "Multiple H1 headings", description: `${s.h1.length} H1 headings were detected.`, why: "A clear primary heading communicates the page topic.", fix: "Use one descriptive primary H1 for this page.", penalty: s.h1.length === 0 ? 38 : 16 },
    { category: "content", title: "Primary heading is clear", description: "One H1 heading was detected.", why: "The main topic has a clear heading.", fix: "No action needed." });
  check(s.wordCount >= 250,
    { category: "content", title: "Low visible content depth", description: `Approximately ${s.wordCount} visible words were detected.`, why: "Thin pages may not answer search intent completely.", fix: "Add original, useful content where it serves the visitor.", penalty: s.wordCount < 100 ? 28 : 16 },
    { category: "content", title: "Substantive visible content", description: `Approximately ${s.wordCount} visible words were detected.`, why: "The page has enough text to communicate context.", fix: "Maintain quality and relevance." });
  check(!headingHasSkip(s.headingSequence),
    { category: "content", title: "Heading hierarchy skips levels", description: "At least one heading jumps over a level.", why: "Logical headings improve scanning and document structure.", fix: "Use sequential heading levels without choosing levels for visual size.", penalty: 14 },
    { category: "content", title: "Heading sequence is logical", description: "No skipped heading levels were detected.", why: "The content structure is easier to interpret.", fix: "No action needed." });

  const altRatio = s.images.total ? (s.images.total - s.images.missingAlt) / s.images.total : 1;
  check(s.images.missingAlt === 0,
    { category: "accessibility", title: "Images missing alternative text", description: `${s.images.missingAlt} of ${s.images.total} images have empty or missing alt text.`, why: "Meaningful images need text alternatives for accessibility and image context.", fix: "Add descriptive alt text; use empty alt only for decorative images.", penalty: Math.max(12, Math.round((1 - altRatio) * 50)) },
    { category: "accessibility", title: "Image alternatives accounted for", description: `${s.images.total} images were checked.`, why: "No missing alt attributes were detected.", fix: "Verify decorative empty alts are intentional." });

  check(s.links.invalid === 0,
    { category: "links", title: "Invalid link targets detected", description: `${s.links.invalid} link targets could not be resolved.`, why: "Malformed links interrupt crawling and navigation.", fix: "Correct or remove invalid href values.", penalty: 18 },
    { category: "links", title: "Link targets are syntactically valid", description: `${s.links.internal + s.links.external} web links were parsed.`, why: "Resolvable links support navigation and discovery.", fix: "No action needed." });
  check(s.links.sampledBroken === 0,
    { category: "links", title: "Broken sampled internal links", description: `${s.links.sampledBroken} of ${s.links.sampled} sampled links returned an error.`, why: "Broken internal links waste crawl paths and frustrate visitors.", fix: "Update, redirect, or remove each broken destination.", penalty: Math.min(35, 12 + s.links.sampledBroken * 8) },
    { category: "links", title: "Sampled internal links responded", description: `${s.links.sampled} internal destinations were sampled.`, why: "The sampled navigation paths are available.", fix: "Continue monitoring the full site." });

  check(s.responseTimeMs < 2000,
    { category: "performance", title: "Slow server response signal", description: `The HTML response took ${s.responseTimeMs} ms from this audit location.`, why: "Slow initial responses delay rendering and crawling.", fix: "Profile server work, caching, hosting latency, and backend calls.", penalty: s.responseTimeMs > 5000 ? 42 : 24 },
    { category: "performance", title: "Responsive HTML delivery", description: `The HTML response arrived in ${s.responseTimeMs} ms.`, why: "Faster delivery improves the path to rendering.", fix: "Validate with field and lab performance tools." });
  check(s.responseBytes < 500_000,
    { category: "performance", title: "Large HTML document", description: `The response was ${Math.round(s.responseBytes / 1024)} KB.`, why: "Large HTML increases transfer and parsing work.", fix: "Remove duplicated markup and defer non-critical embedded data.", penalty: s.responseBytes > 1_000_000 ? 35 : 18 },
    { category: "performance", title: "HTML transfer size is controlled", description: `The response was ${Math.round(s.responseBytes / 1024)} KB.`, why: "A smaller document reduces parsing work.", fix: "No action needed." });

  const blockedByMeta = /(^|,)\s*noindex/i.test(s.robotsMeta ?? "");
  check(!blockedByMeta && !s.robotsTxt.blocksPage,
    { category: "indexability", severity: "critical", title: "Indexability is blocked", description: blockedByMeta ? "A noindex directive was detected." : "robots.txt appears to disallow the audited page.", why: "Blocked pages generally cannot appear in organic search.", fix: "Confirm this is intentional; remove the blocking directive for indexable pages.", penalty: 70 },
    { category: "indexability", title: "No page-level indexing block detected", description: "The sampled robots signals do not block this page.", why: "Crawlers can consider the page for indexing.", fix: "Confirm with a search engine inspection tool." });
  check(s.robotsTxt.available,
    { category: "indexability", title: "robots.txt unavailable", description: "No successful robots.txt response was found.", why: "A robots file communicates crawl guidance and sitemap locations.", fix: "Publish a valid robots.txt at the origin root.", penalty: 12 },
    { category: "indexability", title: "robots.txt available", description: "A robots.txt file was retrieved.", why: "Crawler guidance is available.", fix: "Keep directives intentional." });
  check(s.sitemap.available || s.sitemap.declaredInRobots,
    { category: "indexability", title: "Sitemap not discovered", description: "No root sitemap response or robots declaration was found.", why: "Sitemaps help discovery and canonical URL reporting.", fix: "Publish an XML sitemap and declare it in robots.txt.", penalty: 18 },
    { category: "indexability", title: "Sitemap signal discovered", description: "A sitemap endpoint or robots declaration was found.", why: "Search engines have a URL discovery source.", fix: "Keep it current." });

  check(Boolean(s.viewport),
    { category: "mobile", severity: "critical", title: "Mobile viewport missing", description: "No viewport meta tag was detected.", why: "Pages can render at a desktop width on mobile devices.", fix: "Add width=device-width, initial-scale=1.", penalty: 50 },
    { category: "mobile", title: "Mobile viewport configured", description: "A viewport meta tag was detected.", why: "The page can adapt to device width.", fix: "Confirm layouts visually across breakpoints." });

  check(s.structuredData.blocks > 0,
    { category: "structuredData", title: "No JSON-LD structured data detected", description: "The page contains no JSON-LD blocks.", why: "Relevant schema can improve machine understanding and rich-result eligibility.", fix: "Add accurate, eligible schema that matches visible content.", penalty: 38 },
    { category: "structuredData", title: "Structured data detected", description: `${s.structuredData.blocks} JSON-LD block(s) with ${s.structuredData.types.join(", ") || "untyped data"}.`, why: "Machine-readable entities are present.", fix: "Validate against current search feature requirements." });
  if (s.structuredData.invalid) add({ category: "structuredData", severity: "critical", title: "Invalid JSON-LD", description: `${s.structuredData.invalid} JSON-LD block(s) could not be parsed.`, why: "Invalid JSON is ignored by consumers.", fix: "Correct JSON syntax and validate the markup.", penalty: 45 });

  check(s.https,
    { category: "security", severity: "critical", title: "HTTPS is not active", description: "The final page URL uses HTTP.", why: "Transport security protects visitors and is a baseline search quality signal.", fix: "Serve the site over HTTPS and redirect HTTP consistently.", penalty: 55 },
    { category: "security", title: "HTTPS is active", description: "The final page uses HTTPS.", why: "Traffic is encrypted in transit.", fix: "Maintain certificate and redirect hygiene." });
  check(s.securityHeaders.length >= 3,
    { category: "security", title: "Security headers are limited", description: `${s.securityHeaders.length} of 6 sampled defense headers were detected.`, why: "Defense-in-depth headers reduce common browser attack surface.", fix: "Review CSP, HSTS, MIME sniffing, referrer, permissions, and opener policies.", penalty: 22 },
    { category: "security", title: "Security header baseline detected", description: `${s.securityHeaders.length} sampled security headers were present.`, why: "The response has browser defense-in-depth controls.", fix: "Audit policy quality separately." });

  const issues: AuditIssue[] = checks.map((item, index) => ({
    id: `${item.category}-${String(index + 1).padStart(2, "0")}`,
    severity: item.severity, category: item.category, title: item.title,
    description: item.description, whyItMatters: item.why, suggestedFix: item.fix
  }));
  const scores = Object.fromEntries(CATEGORY_KEYS.map(key => [key, 100])) as Record<CategoryKey, number>;
  checks.forEach(item => { if (item.severity !== "passed") scores[item.category] = Math.max(0, scores[item.category] - (item.penalty ?? (item.severity === "critical" ? 35 : 15))); });
  const categories = CATEGORY_KEYS.map(key => {
    const score = scores[key];
    const failures = issues.filter(issue => issue.category === key && issue.severity !== "passed");
    return { key, label: LABELS[key], score, status: score >= 80 ? "healthy" as const : score >= 55 ? "warning" as const : "critical" as const, issueCount: failures.length, opportunityCount: failures.filter(issue => issue.severity === "warning").length };
  });
  const weights: Record<CategoryKey, number> = { technical: 14, content: 12, metadata: 14, links: 8, performance: 12, indexability: 14, accessibility: 8, mobile: 7, structuredData: 5, security: 6 };
  const overallScore = Math.round(categories.reduce((sum, category) => sum + category.score * weights[category.key], 0) / 100);
  return { overallScore, categories, issues };
}
