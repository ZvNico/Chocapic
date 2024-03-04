import {Page} from 'playwright';
import type {Employee} from "../types";

export default class EmployeeCreateFormPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate() {
        await this.page.goto('https://c.hr.dmerej.info/add_employee');
    }

    async createEmployee(employee: Partial<Employee> = {}) {
        const defaultEmployee: Employee = {
            name: 'John Doe',
            email: 'john.doe@gmail.com',
            addressLine1: '123 Main St',
            addressLine2: 'Apt 2',
            city: 'New York',
            zipCode: '10001',
            hiringDate: '2022-01-01',
            jobTitle: 'Software Engineer'
        }
        const newEmployee: Employee = {...defaultEmployee, ...employee};

        await this.page.fill('#id_name', newEmployee.name);
        await this.page.fill('#id_email', newEmployee.email);
        await this.page.fill('#id_address_line1', newEmployee.addressLine1);
        await this.page.fill('#id_address_line2', newEmployee.addressLine2);
        await this.page.fill('#id_city', newEmployee.city);
        await this.page.fill('#id_zip_code', newEmployee.zipCode);
        await this.page.fill('#id_hiring_date', newEmployee.hiringDate);
        await this.page.fill('#id_job_title', newEmployee.jobTitle);
        await this.page.click('.btn.btn-primary');
    }
}