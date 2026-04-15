import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("homepage has no critical or serious accessibility issues", async ({ page }) => {
  await page.goto("/");

  const results = await new AxeBuilder({ page }).analyze();
  const blockingViolations = results.violations.filter(
    (violation) => violation.impact === "critical" || violation.impact === "serious",
  );

  expect(blockingViolations, JSON.stringify(blockingViolations, null, 2)).toEqual([]);
});

test("mobile menu and contact form are keyboard accessible", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const menuButton = page.getByRole("button", { name: "Toggle menu" });
  await menuButton.focus();
  await expect(menuButton).toBeFocused();
  await page.keyboard.press("Enter");

  await expect(page.getByRole("link", { name: "Contact", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Contact", exact: true }).click();
  await expect(page.locator("#contact")).toBeInViewport();

  const submitButton = page.getByRole("button", { name: /send message/i });
  await submitButton.focus();
  await expect(submitButton).toBeFocused();
});
