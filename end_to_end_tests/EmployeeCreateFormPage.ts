import {Page} from 'playwright';
import EmployeesPage from "./EmployeesPage";
import type {Employee} from "./types";

export default class EmployeeCreateFormPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate() {
        await this.page.goto('https://c.hr.dmerej.info/add_employee');
    }

    async fillName(name: string) {
        await this.page.fill('#id_name', name);
    }

    async fillEmail(email: string) {
        await this.page.fill('#id_email', email);
    }

    async fillAddressLine1(addressLine1: string) {
        await this.page.fill('#id_address_line1', addressLine1);
    }

    async fillAddressLine2(addressLine2: string) {
        await this.page.fill('#id_address_line2', addressLine2);
    }

    async fillCity(city: string) {
        await this.page.fill('#id_city', city);
    }

    async fillZipCode(zipCode: string) {
        await this.page.fill('#id_zip_code', zipCode);
    }

    async fillHiringDate(hiringDate: string) {
        await this.page.fill('#id_hiring_date', hiringDate);
    }

    async fillJobTitle(jobTitle: string) {
        await this.page.fill('#id_job_title', jobTitle);
    }

    async submit() {
        await this.page.click('.btn.btn-primary');
    }

    async fillForm(employee: Partial<Employee> = {}) {
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

        await this.fillName(newEmployee.name);
        await this.fillEmail(newEmployee.email);
        await this.fillAddressLine1(newEmployee.addressLine1);
        await this.fillAddressLine2(newEmployee.addressLine2);
        await this.fillCity(newEmployee.city);
        await this.fillZipCode(newEmployee.zipCode);
        await this.fillHiringDate(newEmployee.hiringDate);
        await this.fillJobTitle(newEmployee.jobTitle);
    }
}