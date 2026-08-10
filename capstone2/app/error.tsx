"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("TRACE_UI_BOUNDARY", { digest: error.digest ?? "unavailable" }); }, [error.digest]);
  return (
    <main id="main-content" className="page loading-screen">
      <div className="surface card error-state" role="alert">
        <AlertTriangle size={30} />
        <h1 className="serif" style={{ margin: 0 }}>This view could not be rendered.</h1>
        <p>Your investigation draft is preserved in this browser. Retry the view or return to the editor.</p>
        <div className="form-actions">
          <button className="button button-ink" onClick={reset}><RotateCcw size={17} /> Retry view</button>
          <Link className="button button-paper" href="/workspace">Return to editor</Link>
        </div>
      </div>
    </main>
  );
}
