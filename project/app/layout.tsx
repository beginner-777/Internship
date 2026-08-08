import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CursorAura } from "@/components/ui/CursorAura";
import "./globals.css";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: { default: "SYNAPSE SEO — See what search engines see", template: "%s — SYNAPSE SEO" },
  description: "AI-powered website intelligence for technical, content, and search performance.",
  icons: { icon: "/favicon.svg" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${display.variable} ${body.variable}`}><a className="skip-link" href="#main-content">Skip to content</a><CursorAura /><Header /><div id="main-content">{children}</div><Footer /></body></html>;
}
