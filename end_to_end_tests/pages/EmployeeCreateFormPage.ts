import {Page} from 'playwright';
import type {Employee} from "../../types";

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
            address_line_1: '123 Main St',
            address_line_2: 'Apt 2',
            city: 'New York',
            zip_code: '10001',
            hiring_date: '2022-01-01',
            job_title: 'Software Engineer'
        }
        const newEmployee: Employee = {...defaultEmployee, ...employee};

        await this.page.fill('#id_name', newEmployee.name);
        await this.page.fill('#id_email', newEmployee.email);
        await this.page.fill('#id_address_line1', newEmployee.address_line_1);
        await this.page.fill('#id_address_line2', newEmployee.address_line_2);
        await this.page.fill('#id_city', newEmployee.city);
        await this.page.fill('#id_zip_code', newEmployee.zip_code);
        await this.page.fill('#id_hiring_date', newEmployee.hiring_date);
        await this.page.fill('#id_job_title', newEmployee.job_title);

        await this.page.click('.btn.btn-primary');
    }
}