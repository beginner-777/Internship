import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SeverityIndicator } from "@/components/severity-indicator";
import { TimelinePanel } from "@/components/timeline-panel";
import { HypothesisCard } from "@/components/hypothesis-card";
import { GeminiErrorState } from "@/components/gemini-error-state";
import { fixtureAnalysis } from "./fixtures";

describe("severity indicator", () => {
  it("communicates severity with text and an accessible label", () => {
    render(<SeverityIndicator severity="SEV-2" />);
    expect(screen.getByLabelText("Incident severity SEV-2")).toHaveTextContent("SEV-2");
  });
});

describe("timeline filtering", () => {
  it("filters events by severity and text", () => {
    render(<TimelinePanel analysis={fixtureAnalysis} />);
    fireEvent.click(screen.getByRole("button", { name: "Critical" }));
    expect(screen.getByText("Checkout failed")).toBeInTheDocument();
    expect(screen.queryByText("Deployment completed")).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Search timeline"), { target: { value: "no match" } });
    expect(screen.getByText("No timeline events match these filters.")).toBeInTheDocument();
  });
});

describe("root cause hypothesis", () => {
  it("shows confidence, supporting evidence, contradictions, and verification", () => {
    render(<HypothesisCard hypothesis={fixtureAnalysis.rootCauseHypotheses[0]} rank={1} />);
    expect(screen.getByLabelText("78 percent confidence")).toBeInTheDocument();
    expect(screen.getByText("Supporting evidence")).toBeInTheDocument();
    expect(screen.getByText("Contradicting evidence")).toBeInTheDocument();
    expect(screen.getByText("Compare pool usage by application version.")).toBeInTheDocument();
  });
});

describe("Gemini error state", () => {
  it("offers retry and local fallback", () => {
    const retry = vi.fn(); const local = vi.fn();
    render(<GeminiErrorState message="Gemini timed out" onRetry={retry} onLocal={local} />);
    fireEvent.click(screen.getByRole("button", { name: /retry gemini/i }));
    fireEvent.click(screen.getByRole("button", { name: /basic local analysis/i }));
    expect(retry).toHaveBeenCalledOnce(); expect(local).toHaveBeenCalledOnce();
  });
});
