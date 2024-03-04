import {Page} from 'playwright';

export class ResetDatabasePage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate() {
        await this.page.goto('https://c.hr.dmerej.info/reset_db');
    }

    async resetDatabase() {
        await this.page.click('.btn.btn-danger');
    }
}