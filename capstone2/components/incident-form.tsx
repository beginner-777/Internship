"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { AlertCircle, Eraser, FileWarning, FlaskConical, LockKeyhole, Radar, ShieldCheck, Sparkles } from "lucide-react";
import { incidentDraftSchema, incidentInputSchema, analyzeResponseSchema } from "@/lib/schemas";
import type { IncidentInput, StoredInvestigation } from "@/lib/types";
import { detectSecrets, redactDetectedSecrets } from "@/lib/secret-detection";
import { sampleIncident } from "@/lib/sample-incident";
import { createLocalAnalysis } from "@/lib/local-analysis";
import { loadDraft, saveDraft, saveInvestigation } from "@/lib/storage";
import { openInvestigation } from "@/lib/navigation";
import { AnalysisProgress } from "./analysis-progress";
import { SecretReviewDialog, type LocatedSecret } from "./secret-review-dialog";
import { GeminiErrorState } from "./gemini-error-state";

const defaults: IncidentInput = {
  incidentTitle: "", systemType: "", environment: "production", startTime: "",
  expectedBehaviour: "", actualBehaviour: "", evidence: "", notes: "",
};

export function IncidentForm() {
  const abortRef = useRef<AbortController | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const [secrets, setSecrets] = useState<LocatedSecret[]>([]);
  const [reviewing, setReviewing] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [apiError, setApiError] = useState("");
  const [pendingInput, setPendingInput] = useState<IncidentInput | null>(null);

  const form = useForm<IncidentInput>({
    resolver: zodResolver(incidentInputSchema),
    defaultValues: defaults,
    mode: "onBlur",
  });
  const values = useWatch({ control: form.control, defaultValue: defaults });
  const totalChars = useMemo(() => [values.incidentTitle, values.systemType, values.expectedBehaviour, values.actualBehaviour, values.evidence, values.notes].join("\n").length, [values]);

  useEffect(() => {
    const draft = loadDraft();
    const parsed = incidentDraftSchema.safeParse(draft);
    if (parsed.success && draft) form.reset({ ...defaults, ...parsed.data });
  }, [form]);

  useEffect(() => {
    const id = window.setTimeout(() => saveDraft(values), 350);
    return () => window.clearTimeout(id);
  }, [values]);

  useEffect(() => { if (apiError) errorRef.current?.focus(); }, [apiError]);

  const persistAndNavigate = (input: IncidentInput, mode: StoredInvestigation["mode"], analysis: StoredInvestigation["analysis"]) => {
    saveInvestigation({ version: 1, createdAt: new Date().toISOString(), mode, analysis, input });
    openInvestigation();
  };

  const callAnalysis = async (input: IncidentInput) => {
    if (!navigator.onLine) { setApiError("This browser is offline. Reconnect to use Gemini, or run the basic local analysis."); return; }
    setApiError(""); setAnalyzing(true);
    const controller = new AbortController(); abortRef.current = controller;
    try {
      const response = await fetch("/api/analyze", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }), signal: controller.signal,
      });
      const json: unknown = await response.json().catch(() => null);
      const parsed = analyzeResponseSchema.safeParse(json);
      if (!response.ok || !parsed.success) {
        const safeMessage = json && typeof json === "object" && "message" in json && typeof json.message === "string"
          ? json.message : "The server returned an invalid or unavailable analysis response.";
        throw new Error(safeMessage);
      }
      persistAndNavigate(input, parsed.data.mode, parsed.data.analysis);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") setApiError("Analysis was cancelled. Your incident evidence is still in the editor.");
      else setApiError(error instanceof Error ? error.message : "The analysis could not be completed.");
    } finally { setAnalyzing(false); abortRef.current = null; }
  };

  const begin = (input: IncidentInput) => {
    setPendingInput(input);
    const found: LocatedSecret[] = [
      ...detectSecrets(input.evidence).map((match) => ({ ...match, field: "evidence" as const })),
      ...detectSecrets(input.notes || "").map((match) => ({ ...match, field: "notes" as const })),
    ];
    if (found.length) { setSecrets(found); setReviewing(true); return; }
    void callAnalysis(input);
  };

  const redact = () => {
    const input = pendingInput;
    if (!input) return;
    const evidenceMatches = secrets.filter((match) => match.field === "evidence");
    const noteMatches = secrets.filter((match) => match.field === "notes");
    const updated = {
      ...input,
      evidence: redactDetectedSecrets(input.evidence, evidenceMatches),
      notes: redactDetectedSecrets(input.notes || "", noteMatches),
    };
    form.reset(updated); setReviewing(false); setSecrets([]); setPendingInput(updated);
  };

  const runLocal = () => {
    const input = pendingInput ?? form.getValues();
    const parsed = incidentInputSchema.safeParse(input);
    if (!parsed.success) { void form.trigger(); return; }
    persistAndNavigate(parsed.data, "local", createLocalAnalysis(parsed.data));
  };

  const clear = () => {
    if (window.confirm("Clear every incident field? This cannot be undone.")) {
      form.reset(defaults); setApiError(""); setPendingInput(null);
    }
  };

  const fieldError = (message?: string) => message ? <span className="field-error" role="alert"><AlertCircle size={13} />{message}</span> : null;

  return (
    <>
      <form onSubmit={(event) => { void form.handleSubmit(begin)(event); }} noValidate className="form-layout" aria-label="Incident evidence form">
        <section className="surface form-card">
          <div className="form-grid">
            <div className="field full"><label htmlFor="incidentTitle">Incident title <span>(optional)</span></label><input id="incidentTitle" {...form.register("incidentTitle")} placeholder="e.g. Checkout failures after v4.18.0" />{fieldError(form.formState.errors.incidentTitle?.message)}</div>
            <div className="field"><label htmlFor="systemType">System / application type</label><input id="systemType" {...form.register("systemType")} placeholder="Distributed e-commerce platform" />{fieldError(form.formState.errors.systemType?.message)}</div>
            <div className="field"><label htmlFor="environment">Environment</label><select id="environment" {...form.register("environment")}><option value="production">Production</option><option value="staging">Staging</option><option value="development">Development</option></select>{fieldError(form.formState.errors.environment?.message)}</div>
            <div className="field full"><label htmlFor="startTime">Incident start date and time</label><input id="startTime" type="datetime-local" {...form.register("startTime")} />{fieldError(form.formState.errors.startTime?.message)}</div>
            <div className="field"><label htmlFor="expectedBehaviour">Expected behaviour</label><textarea id="expectedBehaviour" {...form.register("expectedBehaviour")} placeholder="What should users and systems normally observe?" />{fieldError(form.formState.errors.expectedBehaviour?.message)}</div>
            <div className="field"><label htmlFor="actualBehaviour">Actual behaviour</label><textarea id="actualBehaviour" {...form.register("actualBehaviour")} placeholder="What failed, degraded, or surprised the team?" />{fieldError(form.formState.errors.actualBehaviour?.message)}</div>
            <div className="field full"><label htmlFor="evidence">Logs and technical evidence</label><textarea id="evidence" className="evidence" {...form.register("evidence")} placeholder="Paste timestamps, logs, alerts, traces, deployment notes…" aria-describedby="evidence-meta" />
              <div id="evidence-meta" className="field-meta"><span>Minimum 80 characters</span><span>{(values.evidence || "").length.toLocaleString()} / 12,000</span></div>{fieldError(form.formState.errors.evidence?.message)}</div>
            <div className="field full"><label htmlFor="notes">Additional team / customer notes <span>(optional)</span></label><textarea id="notes" {...form.register("notes")} placeholder="Operator observations, support reports, known changes…" />{fieldError(form.formState.errors.notes?.message)}</div>
          </div>
          <div className="field-meta" style={{ marginTop: "1rem" }}><span>Total incident package</span><span style={{ color: totalChars > 15000 ? "#a22f2c" : undefined }}>{totalChars.toLocaleString()} / 15,000</span></div>
          {apiError && <div ref={errorRef} tabIndex={-1} style={{ marginTop: "1rem" }}><GeminiErrorState message={apiError} onRetry={() => { const input = pendingInput ?? form.getValues(); void callAnalysis(input); }} onLocal={runLocal} /></div>}
          <div className="form-actions">
            <button type="button" className="button button-paper" onClick={() => { form.reset(sampleIncident); setApiError(""); }}><FlaskConical size={17} /> Use sample incident</button>
            <button type="button" className="button button-paper" onClick={clear}><Eraser size={17} /> Clear</button>
            <button type="submit" className="button button-ink magnetic" style={{ marginLeft: "auto" }} disabled={analyzing}><Sparkles size={17} /> Analyze incident</button>
          </div>
        </section>

        <aside className="surface privacy-panel" aria-labelledby="privacy-title">
          <LockKeyhole size={22} color="#d6a84b" /><h2 id="privacy-title" className="serif">Evidence hygiene</h2>
          <p className="muted" style={{ fontSize: ".82rem", lineHeight: 1.55 }}>Remove production secrets and personal information. TRACE AI scans locally and asks before altering anything.</p>
          <ul className="privacy-list">
            <li><ShieldCheck size={17} /><span><strong>Local preflight</strong><br />API keys, tokens, emails, private keys, and password assignments.</span></li>
            <li><Radar size={17} /><span><strong>Evidence discipline</strong><br />Embedded commands are treated as log data, never instructions.</span></li>
            <li><FileWarning size={17} /><span><strong>No automatic action</strong><br />Recovery items are recommendations only.</span></li>
          </ul>
          <div className="notice"><strong>Privacy reminder</strong><br />Use the minimum evidence necessary. Check your organisation’s incident-data policy before submission.</div>
        </aside>
      </form>

      {reviewing && <SecretReviewDialog matches={secrets} onClose={() => setReviewing(false)} onRedact={redact} onContinue={() => { setReviewing(false); if (pendingInput) void callAnalysis(pendingInput); }} />}
      {analyzing && <AnalysisProgress onCancel={() => abortRef.current?.abort()} />}
    </>
  );
}
