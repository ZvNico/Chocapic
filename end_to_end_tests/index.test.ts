import { test, expect } from "@playwright/test";

test("home page", async ({ page }) => {
  await page.goto("https://c.hr.dmerej.info/");
  await expect(page).toHaveTitle(/Home/);
});
