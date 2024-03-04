import { test, expect } from "@playwright/test";
import EmployeeCreateFormPage from "./EmployeeCreateFormPage";
import { ResetDatabasePage } from "./ResetDatabasePage";
import EmployeesPage from "./EmployeesPage";

test.beforeAll(async ({ page }) => {
  const resetDatabasePage = new ResetDatabasePage(page);
  await resetDatabasePage.navigate();
  await resetDatabasePage.resetDatabase();
});

test("home page", async ({ page }) => {
  await page.goto("https://c.hr.dmerej.info");
  await expect(page).toHaveTitle(/Home/);
});

test("create a user", async ({ page }) => {
  const employeeCreateFormPage = new EmployeeCreateFormPage(page);
  const employeesPage = new EmployeesPage(page);
  await employeeCreateFormPage.navigate();
  await employeeCreateFormPage.fillForm();
});

test(" Employees are wipe when their team is deleted", async ({ page }) => {});

test("Add an employee with long value in inputs", async ({ page }) => {
  const employeeCreateFormPage = new EmployeeCreateFormPage(page);

  await employeeCreateFormPage.navigate();
  await employeeCreateFormPage.fillForm({
    zipCode: "1".repeat(50),
  });
  await employeeCreateFormPage.submit();
});

test("Add employees with the same email", async ({ page }) => {
  const employeeCreateFormPage = new EmployeeCreateFormPage(page);

  //Create the first employee
  await employeeCreateFormPage.navigate();
  await employeeCreateFormPage.fillForm();
  await employeeCreateFormPage.submit();

  //Create the second employee with the same email
  await employeeCreateFormPage.navigate();
  await employeeCreateFormPage.fillForm();
  await employeeCreateFormPage.submit();
});
