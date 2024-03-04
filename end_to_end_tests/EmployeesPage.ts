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
        const users = await this.page.$$eval('.employee-row', rows =>
            rows.map(row => ({
                name: row.querySelector('.employee-name')?.textContent || '',
                email: row.querySelector('.employee-email')?.textContent || ''
            }))
        );
        return users.some(user => user.name === name && user.email === email);
    }
}