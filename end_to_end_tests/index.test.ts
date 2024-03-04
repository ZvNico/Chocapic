import {test, expect} from '@playwright/test'
import EmployeeCreateFormPage from "./EmployeeCreateFormPage";


test('home page', async ({page}) => {
    await page.goto('https://c.hr.dmerej.info')
    await expect(page).toHaveTitle(/Home/);
})

test('create a user', async ({page}) => {
    const employeeCreateFormPage = new EmployeeCreateFormPage(page)
    await employeeCreateFormPage.navigate()
    await employeeCreateFormPage.fillForm()

})

test(' Employees are wipe when their team is deleted', async ({page}) => {

    }
)

test('Add employees with the same email', async ({page}) => {
    const employeeCreateFormPage = new EmployeeCreateFormPage(page)

    //Create the first employee
    await employeeCreateFormPage.navigate()
    await employeeCreateFormPage.fillForm()
    await employeeCreateFormPage.submit()

    //Create the second employee with the same email
    await employeeCreateFormPage.navigate()
    await employeeCreateFormPage.fillForm()
    await employeeCreateFormPage.submit()


    }
)