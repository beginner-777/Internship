"use client";

import { useCallback, useRef } from "react";
import { AlertTriangle, Eye, ShieldCheck, X } from "lucide-react";
import type { SecretMatch } from "@/lib/secret-detection";
import { useDialogFocus } from "@/lib/use-dialog-focus";

export type LocatedSecret = SecretMatch & { field: "evidence" | "notes" };

export function SecretReviewDialog({
  matches,
  onClose,
  onRedact,
  onContinue,
}: {
  matches: LocatedSecret[];
  onClose: () => void;
  onRedact: () => void;
  onContinue: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => onClose(), [onClose]);
  useDialogFocus(ref, true, close);
  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="dialog" ref={ref} role="dialog" aria-modal="true" aria-labelledby="secret-title" aria-describedby="secret-description" tabIndex={-1}>
        <div className="dialog-head">
          <div><AlertTriangle size={25} color="#a44337" /><h2 id="secret-title">Review possible sensitive values</h2></div>
          <button className="icon-button" aria-label="Close privacy review" onClick={onClose}><X size={18} /></button>
        </div>
        <p id="secret-description" className="muted">TRACE AI found patterns that resemble secrets or personal information. Nothing has been changed. Review them before evidence leaves this browser.</p>
        <ul className="secret-list">
          {matches.map((match) => <li key={`${match.field}-${match.id}`} className="secret-item"><span><strong>{match.kind}</strong><br /><small className="muted">{match.field}</small></span><code>{match.preview}</code></li>)}
        </ul>
        <div className="notice"><Eye size={16} /> Pattern detection can produce false positives. Redaction replaces only the displayed matches.</div>
        <div className="dialog-actions">
          <button className="button button-paper" onClick={onClose}>Return to editor</button>
          <button className="button button-danger" onClick={onRedact}><ShieldCheck size={17} /> Redact detected values</button>
          <button className="button button-ink" onClick={onContinue}>Continue without changes</button>
        </div>
      </div>
    </div>
  );
}
