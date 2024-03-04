import {Page} from 'playwright';

export default class TeamsPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate() {
        await this.page.goto('https://c.hr.dmerej.info/teams');
    }

    async isTeamPresent(teamName: string): Promise<boolean> {
        const teams = await this.page.$$eval('table tbody tr', rows =>
            rows.map(row => row.querySelector('td')?.textContent || '')
        );
        return teams.includes(teamName);
    }

    async areTeamsPresent(teamNames: string[]): Promise<boolean> {
        const teams = await this.page.$$eval('table tbody tr', rows =>
            rows.map(row => row.querySelector('td')?.textContent || '')
        );
        return teamNames.every(name => teams.includes(name));
    }
}