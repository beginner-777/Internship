"use client";

import { AlertTriangle, RotateCcw, ScanSearch } from "lucide-react";

export function GeminiErrorState({ message, onRetry, onLocal }: { message: string; onRetry: () => void; onLocal: () => void }) {
  return (
    <div className="error-state" role="alert" tabIndex={-1}>
      <AlertTriangle size={22} />
      <strong>AI analysis did not complete</strong>
      <span>{message}</span>
      <div className="form-actions">
        <button type="button" className="button button-ink" onClick={onRetry}><RotateCcw size={16} /> Retry Gemini</button>
        <button type="button" className="button button-paper" onClick={onLocal}><ScanSearch size={16} /> Use basic local analysis</button>
      </div>
    </div>
  );
}
