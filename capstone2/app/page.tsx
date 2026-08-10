import Link from "next/link";
import { ArrowRight, Braces, GitBranch, Radar, ShieldCheck, Sparkles } from "lucide-react";
import { Logo } from "@/components/logo";
import { SceneSlot } from "@/components/three/scene-slot";

export default function LandingPage() {
  return (
    <main id="main-content" className="landing">
      <nav className="landing-nav" aria-label="Landing navigation">
        <Link href="/" aria-label="TRACE AI home"><Logo /></Link>
        <div className="landing-links">
          <Link href="/methodology">Methodology</Link>
          <Link className="button button-primary magnetic" href="/workspace">Open workspace <ArrowRight size={17} /></Link>
        </div>
      </nav>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <span className="hero-kicker eyebrow"><i aria-hidden="true" /> Incident intelligence, structured</span>
          <h1 id="hero-title" className="serif">Find the <span>signal.</span></h1>
          <p>
            TRACE AI turns scattered logs, deployment notes, alerts, and human observations into an evidence-bound investigation—timeline, service impact, ranked hypotheses, and recovery priorities included.
          </p>
          <div className="hero-actions">
            <Link href="/workspace" className="button button-primary magnetic">Launch an investigation <ArrowRight size={18} /></Link>
            <Link href="/methodology" className="button button-secondary">Inspect the method <Braces size={18} /></Link>
          </div>
          <div className="hero-proof" aria-label="Core principles">
            <div className="proof-item"><strong><ShieldCheck size={16} /> Evidence bound</strong><span>Inferences never masquerade as facts.</span></div>
            <div className="proof-item"><strong><GitBranch size={16} /> Service aware</strong><span>Failures mapped across dependencies.</span></div>
            <div className="proof-item"><strong><Radar size={16} /> Action ranked</strong><span>Recovery before speculation.</span></div>
          </div>
        </div>

        <div className="hero-scene" aria-label="Abstract 3D visualization of incident signals propagating between system layers">
          <SceneSlot kind="hero" />
          <div className="scene-labels" aria-hidden="true">
            <div className="scene-label one"><b>checkout-api</b><span>31% error density</span></div>
            <div className="scene-label two"><b>orders-db</b><span>pool constrained</span></div>
            <div className="scene-label three"><b>product-service</b><span>healthy signal</span></div>
            <div className="scene-label four"><b>hypothesis 01</b><span>requires verification</span></div>
          </div>
          <div style={{ position: "absolute", left: "1.3rem", bottom: "1.3rem", zIndex: 3, display: "flex", alignItems: "center", gap: ".5rem", color: "#d6b86f", fontSize: ".72rem" }}>
            <Sparkles size={14} /> Live signal environment · WebGL optional
          </div>
        </div>
      </section>
    </main>
  );
}
