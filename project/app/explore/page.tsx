"use client";

import { ArrowUpRight, Box, Code2, ShoppingBag, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { getSampleAudit, SAMPLE_LIST } from "@/lib/sample";

const icons = [Sparkles, ShoppingBag, Code2, Box];
export default function ExplorePage() {
  const router = useRouter();
  function open(id: string) { localStorage.setItem("synapse:last-audit", JSON.stringify(getSampleAudit(id))); router.push("/audit"); }
  return <main className="page-shell explore-page"><header className="page-hero"><div><span>EXPLORE THE SYSTEM</span><h1>Four architectures.<br /><i>Four signal profiles.</i></h1></div><p>Open a clearly labeled sample audit to explore the neural model without calling a website or Gemini.</p></header>
    <section className="sample-grid">{SAMPLE_LIST.map((item, index) => { const Icon = icons[index]; const audit = getSampleAudit(item.id); return <article key={item.id}>
      <div className="sample-orb"><Icon /><span>{audit.overallScore}</span></div><span className="sample-label">SAMPLE AUDIT · 0{index + 1}</span><h2>{item.name}</h2><p>{item.url}</p>
      <div className="mini-scores">{audit.categories.slice(0, 4).map(category => <span key={category.key}><i style={{ width: `${category.score}%` }} />{category.label}<b>{category.score}</b></span>)}</div>
      <button className="text-button" onClick={() => open(item.id)}>OPEN ARCHITECTURE <ArrowUpRight /></button>
    </article>; })}</section>
  </main>;
}
