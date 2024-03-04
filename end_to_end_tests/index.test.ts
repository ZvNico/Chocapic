import { test, expect } from "@playwright/test";
import EmployeeCreateFormPage from "./EmployeeCreateFormPage";

test("home page", async ({ page }) => {
  await page.goto("https://c.hr.dmerej.info");
  await expect(page).toHaveTitle(/Home/);
});

test("create a user", async ({ page }) => {
  const employeeCreateFormPage = new EmployeeCreateFormPage(page);
  await employeeCreateFormPage.navigate();
  await employeeCreateFormPage.fillForm();
});

test(" Employees are wipe when their team is deleted", async ({ page }) => {});

test("Add an employee with long value in inputs", async ({ page }) => {});
