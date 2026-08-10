import type { Metadata } from "next";
import { IncidentForm } from "@/components/incident-form";

export const metadata: Metadata = { title: "New investigation" };

export default function WorkspacePage() {
  return (
    <main id="main-content" className="page">
      <header className="page-header">
        <div><p className="eyebrow muted">New investigation / evidence intake</p><h1 className="serif">Assemble the incident.</h1></div>
        <p className="muted">Paste the mess as it exists. TRACE AI will preserve the distinction between what your systems observed and what the evidence merely suggests.</p>
      </header>
      <IncidentForm />
    </main>
  );
}
