import Link from "next/link";
import { ArrowLeft, MapPinOff } from "lucide-react";

export default function NotFound() {
  return (
    <main id="main-content" className="page loading-screen">
      <div className="surface card" style={{ maxWidth: 580 }}>
        <MapPinOff size={32} color="#a44337" />
        <p className="eyebrow muted">Unknown route</p>
        <h1 className="serif" style={{ fontSize: "3rem", margin: ".5rem 0" }}>This signal path ends here.</h1>
        <p className="muted">The requested TRACE AI view does not exist or has moved.</p>
        <Link className="button button-ink" href="/"><ArrowLeft size={17} /> Return to overview</Link>
      </div>
    </main>
  );
}
