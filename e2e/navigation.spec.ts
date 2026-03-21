import { test, expect } from "@playwright/test";

test("desktop header navigation moves to sections", async ({ page }) => {
  await page.goto("/");

  const header = page.locator("header");

  await header.getByRole("link", { name: "Experience", exact: true }).click();
  await expect(page.locator("#experience")).toBeInViewport();

  await header.getByRole("link", { name: "Projects", exact: true }).click();
  await expect(page.locator("#projects")).toBeInViewport();

  await header.getByRole("link", { name: "Contact", exact: true }).click();
  await expect(page.locator("#contact")).toBeInViewport();
});
