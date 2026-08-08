import { isIP } from "node:net";
import { lookup } from "node:dns/promises";

const BLOCKED_HOSTS = new Set(["localhost", "localhost.localdomain", "metadata.google.internal"]);

function isPrivateV4(address: string): boolean {
  const p = address.split(".").map(Number);
  if (p.length !== 4 || p.some(Number.isNaN)) return true;
  return p[0] === 0 || p[0] === 10 || p[0] === 127 ||
    (p[0] === 169 && p[1] === 254) || (p[0] === 172 && p[1] >= 16 && p[1] <= 31) ||
    (p[0] === 192 && p[1] === 168) || (p[0] === 100 && p[1] >= 64 && p[1] <= 127) ||
    p[0] >= 224;
}

function isPrivateV6(address: string): boolean {
  const value = address.toLowerCase().split("%")[0];
  if (value === "::" || value === "::1") return true;
  if (value.startsWith("fc") || value.startsWith("fd") || value.startsWith("fe8") ||
      value.startsWith("fe9") || value.startsWith("fea") || value.startsWith("feb")) return true;
  if (value.startsWith("::ffff:")) return isPrivateV4(value.slice(7));
  return false;
}

export function isPrivateAddress(address: string): boolean {
  const family = isIP(address);
  return family === 4 ? isPrivateV4(address) : family === 6 ? isPrivateV6(address) : true;
}

export function normalizeUrl(input: string): URL {
  const raw = input.trim();
  if (!raw || raw.length > 2048) throw new Error("INVALID_URL");
  if (/^[a-z][a-z0-9+.-]*:/i.test(raw) && !/^https?:\/\//i.test(raw)) throw new Error("UNSAFE_URL");
  const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  let url: URL;
  try { url = new URL(candidate); } catch { throw new Error("INVALID_URL"); }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error("UNSAFE_URL");
  if (!url.hostname || BLOCKED_HOSTS.has(url.hostname.toLowerCase()) || url.hostname.endsWith(".local")) throw new Error("UNSAFE_URL");
  if (url.port && !["80", "443"].includes(url.port)) throw new Error("UNSAFE_PORT");
  url.hash = "";
  return url;
}

export async function assertPublicDestination(url: URL): Promise<void> {
  const literal = isIP(url.hostname);
  if (literal && isPrivateAddress(url.hostname)) throw new Error("PRIVATE_DESTINATION");
  let addresses: { address: string; family: number }[];
  try { addresses = await lookup(url.hostname, { all: true, verbatim: true }); }
  catch { throw new Error("DNS_FAILED"); }
  if (!addresses.length || addresses.some(({ address }) => isPrivateAddress(address))) {
    throw new Error("PRIVATE_DESTINATION");
  }
}
