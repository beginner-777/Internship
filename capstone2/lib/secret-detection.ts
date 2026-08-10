export type SecretKind = "API key" | "Bearer token" | "Email" | "Private key" | "Password";

export type SecretMatch = {
  id: string;
  kind: SecretKind;
  value: string;
  index: number;
  preview: string;
};

const patterns: Array<{ kind: SecretKind; regex: RegExp }> = [
  { kind: "Private key", regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g },
  { kind: "Bearer token", regex: /\bBearer\s+[A-Za-z0-9._~+/=-]{12,}/gi },
  { kind: "API key", regex: /\b(?:AIza[\w-]{20,}|sk-[A-Za-z0-9_-]{16,}|(?:api[_-]?key|token)\s*[:=]\s*["']?[A-Za-z0-9._-]{12,})/gi },
  { kind: "Password", regex: /\b(?:password|passwd|pwd)\s*[:=]\s*["']?[^\s"']{4,}/gi },
  { kind: "Email", regex: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi },
];

export function detectSecrets(text: string): SecretMatch[] {
  const matches: SecretMatch[] = [];
  for (const pattern of patterns) {
    pattern.regex.lastIndex = 0;
    for (const match of text.matchAll(pattern.regex)) {
      const value = match[0];
      const index = match.index ?? 0;
      const masked = value.length < 8 ? "••••" : `${value.slice(0, 3)}•••${value.slice(-3)}`;
      matches.push({
        id: `${pattern.kind}-${index}-${value.length}`,
        kind: pattern.kind,
        value,
        index,
        preview: masked,
      });
    }
  }
  return matches.sort((a, b) => a.index - b.index);
}

export function redactDetectedSecrets(text: string, matches: SecretMatch[]): string {
  return [...matches]
    .sort((a, b) => b.index - a.index)
    .reduce((output, match) => {
      const replacement = `[REDACTED ${match.kind.toUpperCase()}]`;
      return `${output.slice(0, match.index)}${replacement}${output.slice(match.index + match.value.length)}`;
    }, text);
}
