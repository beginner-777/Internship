import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = {
  metadataBase: new URL("https://trace-ai-workspace.vercel.app"),
  title: { default: "TRACE AI", template: "%s · TRACE AI" },
  description: "AI incident investigation workspace for engineering teams.",
  applicationName: "TRACE AI",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "TRACE AI",
    title: "TRACE AI — AI Incident Investigation Workspace",
    description: "Turn scattered technical evidence into a structured, evidence-grounded incident investigation.",
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0e0d0a" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
