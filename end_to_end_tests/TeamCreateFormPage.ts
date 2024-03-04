import {Page} from 'playwright';

export default class TeamCreateFormPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate() {
        await this.page.goto('https://c.hr.dmerej.info/add_team');
    }

    async createTeam(name: string) {
        await this.page.fill('#id_name', name);
        await this.page.click('.btn.btn-primary');
    }
}