import { assertPublicDestination, normalizeUrl } from "@/lib/security/url";

export const MAX_HTML_BYTES = 2_000_000;
const USER_AGENT = "SynapseSEO/1.0 (+technical SEO audit; single-page fetch)";

export interface FetchResult {
  body: string;
  finalUrl: URL;
  status: number;
  headers: Headers;
  durationMs: number;
  bytes: number;
}

export async function secureFetch(input: string | URL, options: { method?: "GET" | "HEAD"; maxBytes?: number; timeoutMs?: number } = {}): Promise<FetchResult> {
  let current = typeof input === "string" ? normalizeUrl(input) : normalizeUrl(input.toString());
  const started = performance.now();
  const maxBytes = options.maxBytes ?? MAX_HTML_BYTES;
  for (let redirects = 0; redirects <= 4; redirects += 1) {
    await assertPublicDestination(current);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 10_000);
    let response: Response;
    try {
      response = await fetch(current, {
        method: options.method ?? "GET",
        redirect: "manual",
        signal: controller.signal,
        headers: { "user-agent": USER_AGENT, accept: "text/html,application/xhtml+xml,text/plain;q=0.8,*/*;q=0.2" },
        cache: "no-store"
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") throw new Error("FETCH_TIMEOUT");
      throw new Error("WEBSITE_UNAVAILABLE");
    } finally { clearTimeout(timeout); }

    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      if (!location) throw new Error("INVALID_REDIRECT");
      if (redirects === 4) throw new Error("TOO_MANY_REDIRECTS");
      current = normalizeUrl(new URL(location, current).toString());
      continue;
    }

    const declaredLength = Number(response.headers.get("content-length") ?? 0);
    if (declaredLength > maxBytes) throw new Error("RESPONSE_TOO_LARGE");
    if (options.method === "HEAD") return { body: "", finalUrl: current, status: response.status, headers: response.headers, durationMs: Math.round(performance.now() - started), bytes: 0 };
    const reader = response.body?.getReader();
    if (!reader) return { body: "", finalUrl: current, status: response.status, headers: response.headers, durationMs: Math.round(performance.now() - started), bytes: 0 };
    const chunks: Uint8Array[] = [];
    let bytes = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maxBytes) { await reader.cancel(); throw new Error("RESPONSE_TOO_LARGE"); }
      chunks.push(value);
    }
    const joined = new Uint8Array(bytes);
    let offset = 0;
    for (const chunk of chunks) { joined.set(chunk, offset); offset += chunk.byteLength; }
    return { body: new TextDecoder().decode(joined), finalUrl: current, status: response.status, headers: response.headers, durationMs: Math.round(performance.now() - started), bytes };
  }
  throw new Error("TOO_MANY_REDIRECTS");
}
