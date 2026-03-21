import { test, expect } from "@playwright/test";

test("contact form shows success when API succeeds", async ({ page }) => {
  await page.route("**/api/contact", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ message: "Message sent successfully" }),
    });
  });

  await page.goto("/#contact");

  await page.locator("#name").fill("Playwright User");
  await page.locator("#email").fill("playwright@example.com");
  await page.locator("#message").fill("Hello from e2e test");
  await page.getByRole("button", { name: /send message/i }).click();

  await expect(page.getByText("Thanks for reaching out!")).toBeVisible();
});
