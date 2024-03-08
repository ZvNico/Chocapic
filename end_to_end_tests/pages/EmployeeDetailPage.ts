import {Page} from 'playwright';
import type {Employee} from "../../types";

export default class EmployeeDetailsPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate(employeeId: number) {
        await this.page.goto(`https://c.hr.dmerej.info/employee/${employeeId}`);
    }

    async updateBasicInfo(name: string = 'John Doe', email: string = 'john.doe@gmail.com') {
        await this.page.click('a[href^="/employee/"][href$="/basic_info"]');
        await this.page.fill('#id_name', name);
        await this.page.fill('#id_email', email);
        await this.page.click('.btn.btn-primary');
    }

    async basicInfo(): Promise<{ name: string, email: string }> {
        await this.page.click('a[href^="/employee/"][href$="/basic_info"]');
        const name = await this.page.$eval('#id_name', el => (el as HTMLInputElement).value);
        const email = await this.page.$eval('#id_email', el => (el as HTMLInputElement).value);
        return {name, email};
    }

    async updateAddress(addressLine1: string = '123 Main St', addressLine2: string = 'Apt 2', city: string = 'New York', zipCode: string = '10001') {
        await this.page.click('a[href^="/employee/"][href$="/address"]');
        await this.page.fill('#id_address_line1', addressLine1);
        await this.page.fill('#id_address_line2', addressLine2);
        await this.page.fill('#id_city', city);
        await this.page.fill('#id_zip_code', zipCode);
        await this.page.click('.btn.btn-primary');
    }

    async address(): Promise<{ addressLine1: string, addressLine2: string, city: string, zipCode: string }> {
        await this.page.click('a[href^="/employee/"][href$="/address"]');
        const addressLine1 = await this.page.$eval('#id_address_line1', el => (el as HTMLInputElement).value);
        const addressLine2 = await this.page.$eval('#id_address_line2', el => (el as HTMLInputElement).value);
        const city = await this.page.$eval('#id_city', el => (el as HTMLInputElement).value);
        const zipCode = await this.page.$eval('#id_zip_code', el => (el as HTMLInputElement).value);
        return {addressLine1, addressLine2, city, zipCode};
    }

    async updateContract(hiringDate: string = '2022-01-01', jobTitle: string = 'Software Engineer') {
        await this.page.click('a[href^="/employee/"][href$="/contract"]');
        await this.page.fill('#id_hiring_date', hiringDate);
        await this.page.fill('#id_job_title', jobTitle);
        await this.page.click('.btn.btn-primary');
    }

    async contract(): Promise<{ hiringDate: string, jobTitle: string }> {
        await this.page.click('a[href^="/employee/"][href$="/contract"]');
        const hiringDate = await this.page.$eval('#id_hiring_date', el => (el as HTMLInputElement).value);
        const jobTitle = await this.page.$eval('#id_job_title', el => (el as HTMLInputElement).value);
        return {hiringDate, jobTitle};
    }

    async promoteAsManager() {
        await this.page.click('a[href^="/employee/"][href$="/promote"]');
        await this.page.click('.btn.btn-primary');
    }

    async addToTeam() {
        await this.page.click('a[href^="/employee/"][href$="/add_to_team"]');
    }
}