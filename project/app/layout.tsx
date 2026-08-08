import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CursorAura } from "@/components/ui/CursorAura";
import "./globals.css";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const siteUrl = new URL("https://ms-seo.vercel.app");

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: "SYNAPSE SEO — See what search engines see", template: "%s — SYNAPSE SEO" },
  description: "AI-powered website intelligence for technical, content, and search performance.",
  applicationName: "SYNAPSE SEO",
  keywords: ["SEO audit", "technical SEO", "website analysis", "AI SEO", "SEO dashboard"],
  authors: [{ name: "SYNAPSE SEO" }],
  creator: "SYNAPSE SEO",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website", url: "/", siteName: "SYNAPSE SEO",
    title: "SYNAPSE SEO — See what search engines see",
    description: "AI-powered website intelligence for technical, content, and search performance.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "SYNAPSE SEO neural website intelligence" }]
  },
  twitter: {
    card: "summary_large_image", title: "SYNAPSE SEO — See what search engines see",
    description: "AI-powered website intelligence for technical, content, and search performance.",
    images: ["/opengraph-image"]
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${display.variable} ${body.variable}`}><a className="skip-link" href="#main-content">Skip to content</a><CursorAura /><Header /><div id="main-content">{children}</div><Footer /></body></html>;
}
