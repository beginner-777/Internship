import { AlertOctagon, AlertTriangle, CircleAlert, Info } from "lucide-react";
import type { IncidentAnalysis } from "@/lib/types";

export function SeverityIndicator({ severity }: { severity: IncidentAnalysis["severity"] }) {
  const critical = severity === "SEV-1" || severity === "SEV-2";
  const warning = severity === "SEV-3";
  const Icon = severity === "SEV-1" ? AlertOctagon : severity === "SEV-2" ? AlertTriangle : severity === "SEV-3" ? CircleAlert : Info;
  return <span className={`status-pill ${critical ? "critical" : warning ? "warning" : "info"}`} aria-label={`Incident severity ${severity}`}><Icon size={15} aria-hidden="true" />{severity}</span>;
}
