import type { Metadata } from "next";
import { AuditExperience } from "@/components/audit/AuditExperience";
export const metadata: Metadata = { title: "Audit" };
export default function AuditPage() { return <AuditExperience loadStored />; }
