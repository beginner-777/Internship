const dangerousControls = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export function sanitizeEvidence(value: string): string {
  return value.replace(dangerousControls, "").normalize("NFKC");
}
