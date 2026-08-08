import type { Metadata } from "next";
import { BrainCircuit, Network, ScanSearch, ShieldCheck } from "lucide-react";
export const metadata: Metadata = {
  title: "About",
  description: "Learn how SYNAPSE SEO securely analyzes public website signals, scores SEO health, and uses Gemini for structured recommendations.",
  alternates: { canonical: "/about" }
};
export default function AboutPage() { return <main className="page-shell about-page">
  <header className="page-hero"><div><span>THE SYNAPSE METHOD</span><h1>A website is more than<br /><i>a page of metrics.</i></h1></div><p>SYNAPSE SEO turns public, auditable page signals into a navigable model of technical health and search readiness.</p></header>
  <section className="method-flow"><article><ScanSearch /><b>01</b><h2>Secure acquisition</h2><p>A protected server route validates the target, blocks private networks, follows limited redirects, and retrieves bounded public HTML.</p></article><article><Network /><b>02</b><h2>Deterministic scoring</h2><p>Metadata, structure, content, links, indexability, mobile, schema, performance signals, accessibility, and security are scored from explicit checks.</p></article><article><BrainCircuit /><b>03</b><h2>Structured intelligence</h2><p>When configured, Gemini receives compact audit JSON—not unlimited raw HTML—and returns validated priorities and an action plan.</p></article><article><ShieldCheck /><b>04</b><h2>Honest fallback</h2><p>If AI is unavailable, the product labels deterministic recommendations as Demo Analysis. It never claims a model was used when it was not.</p></article></section>
  <section className="stack-section"><span>TECHNOLOGY STACK</span><h2>Built as a modern intelligence surface.</h2><div>{["NEXT.JS APP ROUTER", "TYPESCRIPT", "THREE.JS", "REACT THREE FIBER", "DREI", "FRAMER MOTION", "GOOGLE GEMINI", "CHEERIO", "ZOD", "TAILWIND CSS"].map(item => <b key={item}>{item}</b>)}</div></section>
  <section className="limits-section"><div><span>WHAT IT KNOWS</span><h2>Public page evidence.</h2><p>HTML, response details, metadata, headings, visible text, images, links, robots.txt, sitemap signals, structured data, HTTPS, viewport, and selected headers.</p></div><div><span>WHAT IT DOESN’T CLAIM</span><h2>Private search truth.</h2><p>No rankings, Search Console data, backlink database, traffic prediction, guaranteed outcomes, full-site crawling, or JavaScript-rendered DOM unless those systems are explicitly integrated.</p></div></section>
  </main>; }
