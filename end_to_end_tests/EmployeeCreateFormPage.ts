import {Page} from 'playwright';

type Employee = {
    name: string;
    email: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    zipCode: string;
    hiringDate: string;
    jobTitle: string;
}

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

    async fillForm(employee: Employee | null = null) {
        if (employee === null) {
            employee = {
                name: 'John Doe',
                email: 'john.doe@gmail.com',
                addressLine1: '123 Main St',
                addressLine2: 'Apt 2',
                city: 'New York',
                zipCode: '10001',
                hiringDate: '2022-01-01',
                jobTitle: 'Software Engineer'
            }
            await this.fillName(employee.name);
            await this.fillEmail(employee.email);
            await this.fillAddressLine1(employee.addressLine1);
            await this.fillAddressLine2(employee.addressLine2);
            await this.fillCity(employee.city);
            await this.fillZipCode(employee.zipCode);
            await this.fillHiringDate(employee.hiringDate);
            await this.fillJobTitle(employee.jobTitle);
        }
    }
}