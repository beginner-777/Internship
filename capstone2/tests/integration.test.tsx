import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { IncidentForm } from "@/components/incident-form";
import { InvestigationDashboard } from "@/components/investigation-dashboard";
import { STORAGE_KEY, parseStoredInvestigation } from "@/lib/storage";
import { fixtureAnalysis } from "./fixtures";

const { openInvestigation } = vi.hoisted(() => ({ openInvestigation: vi.fn() }));
vi.mock("@/lib/navigation", () => ({ openInvestigation }));
vi.mock("@/components/three/scene-slot", () => ({ SceneSlot: () => <div data-testid="scene-fallback" /> }));

describe("incident analysis integration", () => {
  it("submits sample evidence, accepts mocked structured output, and renders the dashboard", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, mode: "gemini", label: "Live Gemini analysis", analysis: fixtureAnalysis }),
    }));
    render(<IncidentForm />);
    fireEvent.click(screen.getByRole("button", { name: /use sample incident/i }));
    fireEvent.click(screen.getByRole("button", { name: /analyze incident/i }));
    await waitFor(() => expect(openInvestigation).toHaveBeenCalledOnce());
    const record = parseStoredInvestigation(localStorage.getItem(STORAGE_KEY));
    expect(record).not.toBeNull();
    render(<InvestigationDashboard record={record!} />);
    expect(screen.getByRole("heading", { name: fixtureAnalysis.incidentTitle })).toBeInTheDocument();
    expect(screen.getByText("Root-cause hypotheses")).toBeInTheDocument();
  });
});
