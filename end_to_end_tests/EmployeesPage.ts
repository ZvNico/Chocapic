import {Page} from 'playwright';

export default class EmployeesPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate() {
        await this.page.goto('https://c.hr.dmerej.info/employees');
    }

    async isUserManager(name: string, email: string): Promise<boolean> {
        const users = await this.page.$$eval('table tbody tr', rows =>
            rows.map(row => {
                const cells = row.querySelectorAll('td');
                return {
                    name: cells[0]?.textContent || '',
                    email: cells[1]?.textContent || '',
                    isManager: cells[2]?.textContent?.trim() === 'yes'
                };
            })
        );
        const user = users.find(user => user.name === name && user.email === email);
        return user ? user.isManager : false;
    }

    async isUserPresent(name: string, email: string): Promise<boolean> {
        const users = await this.page.$$eval('table tbody tr', rows =>
            rows.map(row => {
                const cells = row.querySelectorAll('td');
                return {
                    name: cells[0]?.textContent || '',
                    email: cells[1]?.textContent || ''
                };
            })
        );
        return users.some(user => user.name === name && user.email === email);
    }
}