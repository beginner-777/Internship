"use client";

import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import type { AuditApiError, AuditResult, CategoryKey } from "@/types/audit";
import { getSampleAudit } from "@/lib/sample";
import { AuditCommand } from "./AuditCommand";
import { Dashboard } from "./Dashboard";
import { Scanner, SCAN_STEPS } from "./Scanner";

const NeuralWeb = dynamic(() => import("@/components/3d/NeuralWeb"), { ssr: false, loading: () => <div className="canvas-loading"><i />INITIALIZING SEO CORE</div> });

export function AuditExperience({ loadStored = false }: { loadStored?: boolean }) {
  const sample = getSampleAudit("saas");
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanUrl, setScanUrl] = useState("");
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<CategoryKey | null>(null);
  useEffect(() => {
    if (!loadStored) return;
    try { const saved = localStorage.getItem("synapse:last-audit"); if (saved) window.setTimeout(() => setAudit(JSON.parse(saved) as AuditResult), 0); } catch { /* Ignore invalid local data. */ }
  }, [loadStored]);

  async function run(url: string) {
    let normalized: string;
    try { normalized = new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`).href; }
    catch { setError("Enter a valid website URL, for example https://example.com."); return; }
    setError(""); setScanUrl(normalized); setScanning(true); setStep(0);
    const timer = window.setInterval(() => setStep(value => Math.min(SCAN_STEPS.length - 2, value + 1)), 620);
    try {
      const response = await fetch("/api/audit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: normalized }) });
      const data = await response.json() as AuditResult | AuditApiError;
      if (!response.ok || "error" in data) throw new Error("error" in data ? data.error.message : "The audit could not be completed.");
      setStep(SCAN_STEPS.length - 1);
      await new Promise(resolve => window.setTimeout(resolve, 520));
      setAudit(data); localStorage.setItem("synapse:last-audit", JSON.stringify(data));
    } catch (reason) { setError(reason instanceof Error ? reason.message : "The audit could not be completed."); }
    finally { window.clearInterval(timer); setScanning(false); }
  }

  if (audit) return <><AnimatePresence>{scanning && <Scanner url={scanUrl} step={step} />}</AnimatePresence><Dashboard audit={audit} onNewAudit={run} auditing={scanning} />{error && <div className="toast-error" role="alert"><AlertCircle />{error}<button onClick={() => setError("")}>DISMISS</button></div>}</>;
  return <main className="landing">
    <div className="landing-grid" />
    <div className="landing-copy"><span>AI-POWERED WEBSITE INTELLIGENCE</span><h1>See what<br />search engines <i>see.</i></h1><p>Technical, content, and search performance—mapped into one living system.</p></div>
    <div className="landing-scene"><NeuralWeb categories={sample.categories} score={sample.overallScore} selected={selected} onSelect={setSelected} /></div>
    <div className="landing-command"><AuditCommand onSubmit={run} disabled={scanning} />{error && <div className="inline-error" role="alert"><AlertCircle />{error}</div>}</div>
    <div className="landing-metrics"><span>10 AUDIT LAYERS</span><span>REAL HTML SIGNALS</span><span>GEMINI + DETERMINISTIC FALLBACK</span></div>
    <AnimatePresence>{scanning && <Scanner url={scanUrl} step={step} />}</AnimatePresence>
  </main>;
}
