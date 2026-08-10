import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { fixtureRecord } from "../tests/fixtures";

async function expectNoSeriousViolations(page: import("@playwright/test").Page) {
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  const serious = results.violations.filter((item) => item.impact === "serious" || item.impact === "critical");
  expect(serious, serious.map((item) => `${item.id}: ${item.help}`).join("\n")).toEqual([]);
}

test("landing page has no serious or critical axe violations", async ({ page }) => {
  await page.goto("/"); await expect(page.getByRole("heading", { name: /find the signal/i })).toBeVisible();
  await expectNoSeriousViolations(page);
});

test("workspace has no serious or critical axe violations", async ({ page }) => {
  await page.goto("/workspace"); await expect(page.getByRole("heading", { name: /assemble the incident/i })).toBeVisible();
  await expectNoSeriousViolations(page);
});

test("investigation has no serious or critical axe violations", async ({ page }) => {
  await page.addInitScript(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), { key: "trace-ai.latest-investigation.v1", value: fixtureRecord });
  await page.goto("/investigation"); await expect(page.getByRole("heading", { name: fixtureRecord.analysis.incidentTitle })).toBeVisible();
  await expectNoSeriousViolations(page);
});
