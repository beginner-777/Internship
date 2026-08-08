import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore",
  description: "Explore four sample SEO architectures and their data-driven neural signal maps.",
  alternates: { canonical: "/explore" }
};

export default function ExploreLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
