import {test, expect} from '@playwright/test'
import EmployeeCreateFormPage from "./EmployeeCreateFormPage";
import {ResetDatabasePage} from "./ResetDatabasePage";
import EmployeesPage from "./EmployeesPage";
import {Browser, chromium, Page} from "playwright";
import {Employee} from "./types";

let browser: Browser;
let page: Page;

test.beforeAll(async () => {
    browser = await chromium.launch();
    const context = await browser.newContext();
    page = await context.newPage();

    const resetDatabasePage = new ResetDatabasePage(page);
    await resetDatabasePage.navigate();
    await resetDatabasePage.resetDatabase();
});

test.afterAll(async () => {
    await browser.close();
});
test('home page', async ({page}) => {
    await page.goto('https://c.hr.dmerej.info')
    await expect(page).toHaveTitle(/Home/);
})

// Test for recreate the issue Add an employee with long value in inputs
test("Add an employee with long value in inputs", async ({page}) => {
    const employeeCreateFormPage = new EmployeeCreateFormPage(page);
    const employeesPage = new EmployeesPage(page);

    await employeeCreateFormPage.navigate();
    await employeeCreateFormPage.fillForm({
        zipCode: "1".repeat(50),
    });

    await employeeCreateFormPage.submit();

    await employeesPage.navigate();
    const isUserPresent = await employeesPage.isUserPresent(
        "Laurie",
        "test.zipCode@gmail.com"
    );
    expect(isUserPresent).toBe(true);
});


test('create a user', async ({page}) => {
    const employeesPage = new EmployeesPage(page)
    const employeeCreateFormPage = new EmployeeCreateFormPage(page)

    await employeeCreateFormPage.navigate()
    await employeeCreateFormPage.fillForm({
        name: 'John Doe',
        email: 'john.doe@gmail.com'
    })
    await employeeCreateFormPage.submit()

    await employeesPage.navigate()
    const isUserPresent = await employeesPage.isUserPresent('John Doe', 'john.doe@gmail.com')
    expect(isUserPresent).toBe(true)
})

test(' Employees are wipe when their team is deleted', async ({page}) => {
        return
        const employeesPage = new EmployeesPage(page)
        const employeeCreateFormPage = new EmployeeCreateFormPage(page)

        const employees: Partial<Employee>[] = [
            {
                name: 'John Doe',
                email: 'john.doe@gmail.com'
            },
            {
                name: 'Jane Doe',
                email: 'jane.doe@gmail.com'
            }
        ]

        employees.map(async (employee) => {
            await employeeCreateFormPage.navigate()
            await employeeCreateFormPage.fillForm(employee)
            await employeeCreateFormPage.submit()
        })
    }
)

test('Add employees with the same email', async ({page}) => {
        const employeeCreateFormPage = new EmployeeCreateFormPage(page)
        const employeesPage = new EmployeesPage(page)

        const arrayEmployees = ["Jahn Doe", "Farah Doe"]

    const arrayUsersIsPresent = [];
    for (const name of arrayEmployees) {
            await employeeCreateFormPage.navigate()
            await employeeCreateFormPage.fillForm({ name: name })
            await employeeCreateFormPage.submit()

        arrayUsersIsPresent.push(await employeesPage.isUserPresent(name, "john.doe@gmail.com"));
    }
    const result = await Promise.all(arrayUsersIsPresent)
    expect(result).toEqual([true,false])
    }
)