import { parsePage } from "./parser";
import { secureFetch } from "./fetcher";
import { normalizeUrl } from "@/lib/security/url";
import { scoreAudit } from "@/lib/scoring/score";
import type { AuditResult } from "@/types/audit";
import { analyzeWithGemini } from "@/lib/ai/gemini";

async function optionalText(url: URL, maxBytes = 300_000): Promise<{ ok: boolean; body: string }> {
  try {
    const result = await secureFetch(url, { maxBytes, timeoutMs: 5_000 });
    return { ok: result.status >= 200 && result.status < 400, body: result.body };
  } catch { return { ok: false, body: "" }; }
}

function robotsBlocksPath(robots: string, path: string): boolean {
  let applies = false;
  let longestRule: { length: number; allowed: boolean } | null = null;
  for (const raw of robots.split(/\r?\n/)) {
    const line = raw.split("#")[0].trim();
    if (!line) continue;
    const [name, ...parts] = line.split(":");
    const value = parts.join(":").trim();
    if (name.toLowerCase() === "user-agent") { applies = value === "*"; continue; }
    if (applies && ["allow", "disallow"].includes(name.toLowerCase()) && value && path.startsWith(value)) {
      const candidate = { length: value.length, allowed: name.toLowerCase() === "allow" };
      if (!longestRule || candidate.length >= longestRule.length) longestRule = candidate;
    }
  }
  return longestRule ? !longestRule.allowed : false;
}

async function countBroken(urls: string[]): Promise<{ sampled: number; broken: number }> {
  const sample = urls.slice(0, 5);
  const results = await Promise.all(sample.map(async url => {
    try {
      const result = await secureFetch(url, { method: "HEAD", maxBytes: 0, timeoutMs: 4_000 });
      return result.status >= 400;
    } catch { return true; }
  }));
  return { sampled: sample.length, broken: results.filter(Boolean).length };
}

export async function runAudit(input: string): Promise<AuditResult> {
  const requested = normalizeUrl(input);
  const page = await secureFetch(requested, { timeoutMs: 10_000 });
  if (!/html|xhtml/i.test(page.headers.get("content-type") ?? "") && !/<html[\s>]/i.test(page.body)) throw new Error("UNSUPPORTED_CONTENT");
  const origin = page.finalUrl.origin;
  const [robots, sitemap] = await Promise.all([
    optionalText(new URL("/robots.txt", origin)),
    optionalText(new URL("/sitemap.xml", origin))
  ]);
  const sitemapDeclared = /^\s*sitemap\s*:/im.test(robots.body);
  const initial = parsePage(page, {
    robotsAvailable: robots.ok,
    robotsBlocksPage: robots.ok && robotsBlocksPath(robots.body, page.finalUrl.pathname),
    sitemapAvailable: sitemap.ok && /<urlset|<sitemapindex/i.test(sitemap.body),
    sitemapDeclared,
    sampledBroken: 0,
    sampledLinks: 0
  });
  const broken = await countBroken(initial.internalUrls.filter(url => url !== page.finalUrl.href));
  initial.signals.links.sampled = broken.sampled;
  initial.signals.links.sampledBroken = broken.broken;
  const local = scoreAudit(initial.signals);
  const auditBase = {
    id: crypto.randomUUID(),
    url: page.finalUrl.href,
    auditedAt: new Date().toISOString(),
    overallScore: local.overallScore,
    categories: local.categories,
    signals: initial.signals,
    issues: local.issues,
    limitations: [
      "This is a single-page audit, not a full-site crawl.",
      "Performance is based on response timing and HTML weight, not CrUX or Lighthouse lab metrics.",
      "Broken-link checks sample up to five internal URLs.",
      "Search Console, rankings, backlinks, Core Web Vitals field data, and rendered post-JavaScript DOM are not included."
    ]
  };
  const ai = await analyzeWithGemini(auditBase);
  return { ...auditBase, ai };
}
