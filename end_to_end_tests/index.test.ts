import {test, expect} from '@playwright/test'
import {
    ResetDatabasePage,
    EmployeesPage,
    TeamsPage,
    EmployeeDetailsPage,
    EmployeeCreateFormPage,
    TeamCreateFormPage
} from "./pages"

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

test('Can create user', async ({page}) => {
    const employeesPage = new EmployeesPage(page)
    const employeeCreateFormPage = new EmployeeCreateFormPage(page)

    await employeeCreateFormPage.navigate()
    await employeeCreateFormPage.createEmployee({
        name: 'John Doe',
        email: 'john.doe@gmail.com'
    })

    await employeesPage.navigate()
    const isUserPresent = await employeesPage.isUserPresent('John Doe', 'john.doe@gmail.com')
    expect(isUserPresent).toBe(true)
})


// Test for recreate the issue Add an employee with long value in inputs
test("Add an employee with long value in inputs", async ({page}) => {
    const employeeCreateFormPage = new EmployeeCreateFormPage(page);
    const employeesPage = new EmployeesPage(page);

    await employeeCreateFormPage.navigate();
    await employeeCreateFormPage.createEmployee({
        zipCode: "1".repeat(50),
    });

    await employeesPage.navigate();
    const isUserPresent = await employeesPage.isUserPresent(
        "Laurie",
        "test.zipCode@gmail.com"
    );
    expect(isUserPresent).toBe(true);
});


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
            await employeeCreateFormPage.createEmployee(employee)
        })
    }
)

test('Cannot add two employees with same email', async ({page}) => {
        const employeeCreateFormPage = new EmployeeCreateFormPage(page)
        const employeesPage = new EmployeesPage(page)

        const arrayEmployees = ["Jahn Doe", "Farah Doe"]

        const arrayUsersIsPresent = [];
        for (const name of arrayEmployees) {
            await employeeCreateFormPage.navigate()
            await employeeCreateFormPage.createEmployee({name: name})

            arrayUsersIsPresent.push(await employeesPage.isUserPresent(name, "john.doe@gmail.com"));
        }
        const result = await Promise.all(arrayUsersIsPresent)
        expect(result).toEqual([true, false])
    }
)

test('Update employee adress', async ({page}) => {
    const employeeCreateFormPage = new EmployeeCreateFormPage(page)
    const employeesPage = new EmployeesPage(page)
    const employeeDetailPage = new EmployeeDetailsPage(page)

    const employee = {
        name: 'John Doe',
        email: 'john.doe@gmail.com'
    }

    const newAddress = {
        addressLine1: 'Address line 1',
        addressLine2: 'Address line 2',
        city: 'City 1',
        zipCode: '1'
    }

    await employeeCreateFormPage.navigate()
    await employeeCreateFormPage.createEmployee(employee)

    await employeesPage.navigate()
    const employeeId = await employeesPage.userId(employee.name, employee.email)

    if (!employeeId) {
        throw new Error('Employee not found')
    }
    await employeeDetailPage.navigate(Number(employeeId))
    await employeeDetailPage.updateAddress(newAddress.addressLine1, newAddress.addressLine2, newAddress.city, newAddress.zipCode)

    const address = await employeeDetailPage.address()
    expect(address).toEqual(newAddress)
})