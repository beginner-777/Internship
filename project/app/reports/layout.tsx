import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SEO Reports",
  description: "Open, print, and download a structured SYNAPSE SEO audit report and priority action plan.",
  alternates: { canonical: "/reports" }
};

export default function ReportsLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
