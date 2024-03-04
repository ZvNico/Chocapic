import {Page} from 'playwright';

export default class EmployeesPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate() {
        await this.page.goto('https://c.hr.dmerej.info/employees');
    }

    async isUserPresent(name: string, email: string): Promise<boolean> {
        const users = await this.page.$$eval('.employee-name', elements => elements.map(e => e.textContent));
    }
}