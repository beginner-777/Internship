"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Activity, BookOpen, ChevronLeft, Command, GitBranch, LayoutDashboard, Menu,
  Network, Plus, Search, Settings, ShieldCheck, Target, X, Zap,
} from "lucide-react";
import { Logo } from "./logo";
import { useDialogFocus } from "@/lib/use-dialog-focus";

const nav = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "New Investigation", href: "/workspace", icon: Plus },
  { label: "Timeline", href: "/investigation#timeline", icon: Activity },
  { label: "Services", href: "/investigation#services", icon: Network },
  { label: "Root Cause", href: "/investigation#root-cause", icon: Target },
  { label: "Action Plan", href: "/investigation#action-plan", icon: Zap },
  { label: "Methodology", href: "/methodology", icon: BookOpen },
  { label: "Settings", href: "/methodology#settings", icon: Settings },
];

function Navigation({ pathname, hash, onSelect }: { pathname: string; hash: string; onSelect?: () => void }) {
  return (
    <nav className="sidebar-nav" aria-label="Primary navigation">
      {nav.map((item) => {
        const targetHash = item.href.includes("#") ? `#${item.href.split("#")[1]}` : "";
        const targetPath = item.href.split("#")[0];
        const active = item.href === "/"
          ? pathname === "/"
          : targetHash
            ? pathname === targetPath && (hash === targetHash || (!hash && targetHash === "#timeline"))
            : pathname === targetPath && !(pathname === "/methodology" && hash === "#settings");
        const Icon = item.icon;
        return (
          <Link key={item.label} href={item.href} className={active ? "active" : ""} onClick={onSelect} title={item.label}>
            <Icon size={18} aria-hidden="true" /><span className="nav-label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [palette, setPalette] = useState(false);
  const [hash, setHash] = useState("");
  const paletteRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const closePalette = useCallback(() => setPalette(false), []);
  const closeDrawer = useCallback(() => setDrawer(false), []);
  useDialogFocus(paletteRef, palette, closePalette);
  useDialogFocus(drawerRef, drawer, closeDrawer);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault(); setPalette((value) => !value);
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash);
    const frame = window.requestAnimationFrame(syncHash);
    window.addEventListener("hashchange", syncHash);
    return () => { window.cancelAnimationFrame(frame); window.removeEventListener("hashchange", syncHash); };
  }, []);

  if (pathname === "/") return <>{children}</>;

  return (
    <div className="app-shell">
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`} aria-label="Application sidebar">
        <Link href="/"><Logo compact={collapsed} /></Link>
        <Navigation pathname={pathname} hash={hash} />
        <div className="sidebar-bottom">
          <button className="sidebar-toggle" onClick={() => setPalette(true)} title="Open command palette">
            <Command size={17} /><span className="nav-label">&nbsp; Command palette</span>
          </button>
          <p className="sidebar-note"><ShieldCheck size={15} /> Evidence remains in this browser except during a requested analysis.</p>
          <button className="sidebar-toggle" onClick={() => setCollapsed((value) => !value)} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
            <ChevronLeft size={18} style={{ transform: collapsed ? "rotate(180deg)" : undefined }} />
          </button>
        </div>
      </aside>

      <div className="main-wrap">
        <header className="mobile-bar">
          <button className="icon-button" onClick={() => setDrawer(true)} aria-label="Open navigation"><Menu size={20} /></button>
          <Link href="/"><Logo /></Link>
          <button className="icon-button" onClick={() => setPalette(true)} aria-label="Open command palette"><Search size={19} /></button>
        </header>
        {children}
      </div>

      {drawer && (
        <div className="mobile-drawer" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && closeDrawer()}>
          <aside className="sidebar" ref={drawerRef} role="dialog" aria-modal="true" aria-label="Mobile navigation" tabIndex={-1}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Logo /><button className="icon-button" onClick={closeDrawer} aria-label="Close navigation"><X size={19} /></button>
            </div>
            <Navigation pathname={pathname} hash={hash} onSelect={closeDrawer} />
          </aside>
          <button className="drawer-dismiss" onClick={closeDrawer} aria-label="Close navigation" />
        </div>
      )}

      {palette && (
        <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && closePalette()}>
          <div className="dialog command-dialog" role="dialog" aria-modal="true" aria-labelledby="command-title" ref={paletteRef} tabIndex={-1}>
            <h2 id="command-title" className="sr-only">Command palette</h2>
            <input className="command-input" aria-label="Search commands" placeholder="Jump to an investigation view…" autoFocus />
            <div className="command-list">
              {nav.map((item) => (
                <Link key={item.label} href={item.href} onClick={closePalette}><span>{item.label}</span><GitBranch size={15} aria-hidden="true" /></Link>
              ))}
            </div>
            <p className="muted" style={{ fontSize: ".7rem", padding: ".4rem 1rem" }}>Press Esc to close · Ctrl/Cmd + K to toggle</p>
          </div>
        </div>
      )}
    </div>
  );
}
