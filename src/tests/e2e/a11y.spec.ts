import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("homepage has no critical accessibility issues", async ({ page }) => {
  await page.goto("/");

  const results = await new AxeBuilder({ page }).analyze();
  const criticalViolations = results.violations.filter(
    (violation) => violation.impact === "critical",
  );

  expect(criticalViolations, JSON.stringify(criticalViolations, null, 2)).toEqual([]);
});
