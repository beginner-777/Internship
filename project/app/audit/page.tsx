import type { Metadata } from "next";
import { AuditExperience } from "@/components/audit/AuditExperience";
export const metadata: Metadata = {
  title: "Audit",
  description: "Run a secure technical, content, metadata, performance, accessibility, and search-readiness audit.",
  alternates: { canonical: "/audit" }
};
export default function AuditPage() { return <AuditExperience loadStored />; }
