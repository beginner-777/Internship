import * as cheerio from "cheerio";
import type { PageSignals } from "@/types/audit";
import type { FetchResult } from "./fetcher";

function absoluteHref(raw: string | undefined, base: URL): URL | null {
  if (!raw || raw.startsWith("#") || /^(mailto:|tel:|javascript:|data:)/i.test(raw)) return null;
  try {
    const url = new URL(raw, base);
    return ["http:", "https:"].includes(url.protocol) ? url : null;
  } catch { return null; }
}

export interface ParsedPage { signals: PageSignals; internalUrls: string[] }

export function parsePage(page: FetchResult, support: {
  robotsAvailable: boolean;
  robotsBlocksPage: boolean;
  sitemapAvailable: boolean;
  sitemapDeclared: boolean;
  sampledBroken: number;
  sampledLinks: number;
}): ParsedPage {
  const $ = cheerio.load(page.body);
  $("script, style, noscript, template, svg").remove();
  const title = $("title").first().text().trim() || null;
  const metaDescription = $('meta[name="description" i]').attr("content")?.trim() || null;
  const canonicalRaw = $('link[rel="canonical" i]').attr("href")?.trim() || null;
  let canonical: string | null = canonicalRaw;
  if (canonicalRaw) { try { canonical = new URL(canonicalRaw, page.finalUrl).href; } catch { canonical = canonicalRaw; } }
  const h1 = $("h1").map((_, el) => $(el).text().replace(/\s+/g, " ").trim()).get().filter(Boolean);
  const h2 = $("h2").map((_, el) => $(el).text().replace(/\s+/g, " ").trim()).get().filter(Boolean);
  const headingSequence = $("h1,h2,h3,h4,h5,h6").map((_, el) => Number(el.tagName.slice(1))).get();
  const visibleText = $("body").text().replace(/\s+/g, " ").trim();
  const words = visibleText ? visibleText.split(/\s+/).filter(word => /[\p{L}\p{N}]/u.test(word)) : [];
  const images = $("img").toArray();
  const hrefs = $("a[href]").map((_, el) => $(el).attr("href")).get();
  const resolved = hrefs.map(href => absoluteHref(href, page.finalUrl));
  const internal = resolved.filter((url): url is URL => Boolean(url && url.origin === page.finalUrl.origin));
  const external = resolved.filter(url => url && url.origin !== page.finalUrl.origin);
  const invalid = hrefs.filter(href => href && !href.startsWith("#") && !/^(mailto:|tel:|javascript:|data:)/i.test(href) && !absoluteHref(href, page.finalUrl)).length;
  const types: string[] = [];
  let invalidJsonLd = 0;
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const json = JSON.parse($(el).text());
      const values = Array.isArray(json) ? json : json?.["@graph"] ?? [json];
      for (const value of Array.isArray(values) ? values : [values]) {
        const type = value?.["@type"];
        if (Array.isArray(type)) types.push(...type.map(String)); else if (type) types.push(String(type));
      }
    } catch { invalidJsonLd += 1; }
  });
  const securityHeaders = [
    "content-security-policy", "strict-transport-security", "x-content-type-options",
    "referrer-policy", "permissions-policy", "cross-origin-opener-policy"
  ].filter(name => page.headers.has(name));
  return {
    signals: {
      finalUrl: page.finalUrl.href,
      statusCode: page.status,
      responseTimeMs: page.durationMs,
      responseBytes: page.bytes,
      contentType: page.headers.get("content-type") ?? "unknown",
      title, metaDescription, canonical,
      robotsMeta: $('meta[name="robots" i]').attr("content")?.trim() || null,
      language: $("html").attr("lang")?.trim() || null,
      viewport: $('meta[name="viewport" i]').attr("content")?.trim() || null,
      h1, h2, headingSequence, wordCount: words.length,
      images: { total: images.length, missingAlt: images.filter(el => $(el).attr("alt") === undefined || $(el).attr("alt")?.trim() === "").length },
      links: { internal: internal.length, external: external.length, invalid, sampledBroken: support.sampledBroken, sampled: support.sampledLinks },
      openGraph: {
        title: Boolean($('meta[property="og:title" i]').attr("content")),
        description: Boolean($('meta[property="og:description" i]').attr("content")),
        image: Boolean($('meta[property="og:image" i]').attr("content"))
      },
      structuredData: { blocks: $('script[type="application/ld+json"]').length, types: [...new Set(types)], invalid: invalidJsonLd },
      robotsTxt: { available: support.robotsAvailable, blocksPage: support.robotsBlocksPage },
      sitemap: { available: support.sitemapAvailable, declaredInRobots: support.sitemapDeclared },
      https: page.finalUrl.protocol === "https:", securityHeaders
    },
    internalUrls: [...new Set(internal.map(url => { url.hash = ""; return url.href; }))].slice(0, 8)
  };
}
