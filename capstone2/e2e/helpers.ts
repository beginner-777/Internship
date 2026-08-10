import type { Page } from "@playwright/test";
import type { StoredInvestigation } from "../lib/types";

const storageKey = "trace-ai.latest-investigation.v1";

export async function seedInvestigation(page: Page, record: StoredInvestigation) {
  await page.goto("/");
  await page.evaluate(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: storageKey, value: record },
  );
}
