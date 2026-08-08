"use client";

import { useEffect, useState } from "react";
import { getSampleAudit } from "@/lib/sample";
import type { AuditResult } from "@/types/audit";

export function useAudit(): { audit: AuditResult; isStored: boolean } {
  const [audit, setAudit] = useState<AuditResult>(() => getSampleAudit("saas"));
  const [isStored, setStored] = useState(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("synapse:last-audit");
      if (saved) window.setTimeout(() => { setAudit(JSON.parse(saved) as AuditResult); setStored(true); }, 0);
    } catch { /* Fall back to the labeled sample. */ }
  }, []);
  return { audit, isStored };
}
