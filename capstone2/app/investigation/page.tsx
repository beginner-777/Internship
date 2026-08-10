"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertTriangle, FileSearch, Plus } from "lucide-react";
import { InvestigationDashboard } from "@/components/investigation-dashboard";
import { parseStoredInvestigation, STORAGE_KEY } from "@/lib/storage";
import type { StoredInvestigation } from "@/lib/types";

export default function InvestigationPage() {
  const [record, setRecord] = useState<StoredInvestigation | null>(null);
  const [ready, setReady] = useState(false);
  const [corrupted, setCorrupted] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = parseStoredInvestigation(raw);
      setRecord(parsed);
      setCorrupted(Boolean(raw && !parsed));
      setReady(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  if (!ready) return <main id="main-content" className="loading-screen"><div><div className="loading-orbit" /><p>Reconstructing the latest investigation…</p></div></main>;
  if (!record) return (
    <main id="main-content" className="page loading-screen"><section className="surface card" style={{ maxWidth: 650 }}>
      {corrupted ? <AlertTriangle size={28} color="#a44337" /> : <FileSearch size={28} color="#a44337" />}
      <p className="eyebrow muted">No investigation available</p><h1 className="serif" style={{ fontSize: "3rem", margin: ".5rem 0" }}>{corrupted ? "The saved investigation is corrupted." : "No signal has been traced yet."}</h1>
      <p className="muted">{corrupted ? "TRACE AI rejected unsafe or invalid local data. Your editor draft may still be available." : "Start with logs, alerts, notes, or the built-in checkout sample."}</p>
      <Link className="button button-ink" href="/workspace"><Plus size={17} /> New investigation</Link>
    </section></main>
  );
  return <InvestigationDashboard record={record} />;
}
