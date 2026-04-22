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

test("mobile menu closes on Escape and focus remains usable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const menuButton = page.getByRole("button", { name: "Toggle menu" });
  await menuButton.focus();
  await expect(menuButton).toBeFocused();
  await menuButton.click();

  const mobileMenu = page.locator("#mobile-navigation-menu");
  await expect(mobileMenu).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(mobileMenu).toBeHidden();

  await menuButton.focus();
  await expect(menuButton).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(mobileMenu).toBeVisible();
});
