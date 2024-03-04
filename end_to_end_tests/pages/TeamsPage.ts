import {Page} from 'playwright';

export default class TeamsPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate() {
        await this.page.goto('https://c.hr.dmerej.info/teams');
    }

    async teamId(teamName: string): Promise<string> {
        const teams = await this.page.$$eval('table tbody tr', rows =>
            rows.map(row => {
                const cells = row.querySelectorAll('td');
                const viewMembersLink = row.querySelector('a[href^="/team/"][href$="/members"]');
                const id = viewMembersLink ? viewMembersLink.getAttribute('href')?.split('/')[2] : '';
                return {
                    name: cells[0]?.textContent || '',
                    id
                };
            })
        );
        const team = teams.find(team => team.name === teamName);
        if (!team) throw new Error(`Team ${teamName} not found`);
        if (!team.id) throw new Error(`Team ${teamName} id not found`);
        return team.id;
    }

    async deleteTeam(teamName: string): Promise<void> {
        const id = await this.teamId(teamName);
        await this.page.click(`a[href="/team/${id}/delete"]`);
        await this.page.click('.btn.btn-danger');
        await this.page.click('.btn.btn-danger');
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