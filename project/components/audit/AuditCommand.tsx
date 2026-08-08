"use client";

import { ArrowUpRight, ScanSearch } from "lucide-react";
import { FormEvent, useState } from "react";

export function AuditCommand({ onSubmit, disabled, compact = false }: { onSubmit: (url: string) => void | Promise<void>; disabled: boolean; compact?: boolean }) {
  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const busy = disabled || submitting;
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!url.trim() || busy) return;
    setSubmitting(true);
    try { await onSubmit(url.trim()); }
    finally { setSubmitting(false); }
  }
  return <form className={`audit-command ${compact ? "compact" : ""}`} onSubmit={submit} aria-busy={busy}>
    <div className="command-icon"><ScanSearch aria-hidden="true" /></div>
    <label><span>WEBSITE URL</span><input type="text" inputMode="url" value={url} onChange={event => setUrl(event.target.value)} placeholder="Enter a website URL to analyze..." aria-label="Website URL" autoComplete="url" /></label>
    <button className="button command-button" disabled={busy || !url.trim()}>{busy ? "ANALYZING" : "ANALYZE WEBSITE"}<ArrowUpRight aria-hidden="true" /></button>
    {!compact && <div className="command-meta"><span><i /> SEO ENGINE ONLINE</span><span>HTTP / HTTPS · SECURE SERVER ANALYSIS</span><span>Try: example.com</span></div>}
  </form>;
}
