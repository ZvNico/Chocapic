import {Page} from 'playwright';

export default class TeamCreateFormPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate() {
        await this.page.goto('https://c.hr.dmerej.info/add_team');
    }

    async fillName(name: string) {
        await this.page.fill('#id_name', name);
    }

    async submit() {
        await this.page.click('.btn.btn-primary');
    }

    async fillForm(name: string) {
        await this.fillName(name);
    }
}