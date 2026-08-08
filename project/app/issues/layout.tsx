import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SEO Issues",
  description: "Review critical SEO issues, warnings, passed checks, evidence, and recommended fixes.",
  alternates: { canonical: "/issues" }
};

export default function IssuesLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
