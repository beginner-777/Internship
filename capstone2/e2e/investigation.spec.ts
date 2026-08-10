import { expect, test } from "@playwright/test";
import { fixtureAnalysis, fixtureRecord } from "../tests/fixtures";
import { seedInvestigation } from "./helpers";

test("sample incident produces an interactive investigation report", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.route("**/api/analyze", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, mode: "gemini", label: "Live Gemini analysis", analysis: fixtureAnalysis }),
    });
  });
  await seedInvestigation(page, fixtureRecord);
  await page.goto("/workspace");
  await page.getByRole("button", { name: /use sample incident/i }).click();
  await page.getByRole("button", { name: /analyze incident/i }).click();
  await expect(page).toHaveURL(/\/investigation$/);
  await expect(page.getByRole("heading", { name: fixtureAnalysis.incidentTitle })).toBeVisible();

  await page.getByRole("button", { name: "Critical" }).click();
  await expect(page.getByText("Checkout failed")).toBeVisible();
  await expect(page.getByText("Deployment completed")).toBeHidden();

  await page.getByRole("button", { name: /checkout-api.*1 evidence signal/i }).click();
  await expect(page.getByText(/checkout-api: POST \/api\/checkout 500/i)).toBeVisible();

  await page.getByRole("button", { name: /copy report/i }).click();
  await expect(page.getByText("Report copied to clipboard.")).toBeVisible();
});

test("latest investigation survives refresh", async ({ page }) => {
  await seedInvestigation(page, fixtureRecord);
  await page.goto("/investigation");
  await expect(page.getByRole("heading", { name: fixtureAnalysis.incidentTitle })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: fixtureAnalysis.incidentTitle })).toBeVisible();
});
