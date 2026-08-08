"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  ["AUDIT", "/audit"], ["INSIGHTS", "/issues"], ["REPORTS", "/reports"],
  ["EXPLORE", "/explore"], ["ABOUT", "/about"]
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return <header className="site-header">
    <Link href="/" className="brand" aria-label="Synapse SEO home"><span>SYNAPSE</span><b>SEO</b></Link>
    <button className="mobile-menu" onClick={() => setOpen(value => !value)} aria-expanded={open} aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button>
    <nav className={open ? "open" : ""} aria-label="Primary navigation">
      {links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)} className={pathname === href ? "active" : ""}>{label}</Link>)}
    </nav>
    <Link href="/audit" className="button button-small header-cta">START AUDIT</Link>
  </header>;
}
