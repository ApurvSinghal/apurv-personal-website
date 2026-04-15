import { test, expect } from "@playwright/test";

test("homepage smoke check", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Apurv Singhal", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Contact", exact: true })).toBeVisible();
});
