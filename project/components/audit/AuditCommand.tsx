"use client";

import { ArrowUpRight, ScanSearch } from "lucide-react";
import { FormEvent, useState } from "react";

export function AuditCommand({ onSubmit, disabled, compact = false }: { onSubmit: (url: string) => void; disabled: boolean; compact?: boolean }) {
  const [url, setUrl] = useState("");
  function submit(event: FormEvent) { event.preventDefault(); if (url.trim()) onSubmit(url.trim()); }
  return <form className={`audit-command ${compact ? "compact" : ""}`} onSubmit={submit}>
    <div className="command-icon"><ScanSearch aria-hidden="true" /></div>
    <label><span>WEBSITE URL</span><input type="text" inputMode="url" value={url} onChange={event => setUrl(event.target.value)} placeholder="Enter a website URL to analyze..." aria-label="Website URL" autoComplete="url" /></label>
    <button className="button command-button" disabled={disabled || !url.trim()}>{disabled ? "ANALYZING" : "ANALYZE WEBSITE"}<ArrowUpRight aria-hidden="true" /></button>
    {!compact && <div className="command-meta"><span><i /> SEO ENGINE ONLINE</span><span>HTTP / HTTPS · SECURE SERVER ANALYSIS</span><span>Try: example.com</span></div>}
  </form>;
}
