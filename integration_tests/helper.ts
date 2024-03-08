import type {Employee, Team} from '../types';
import axios from "axios";


async function addEntity(url: string, entity: Employee | Team) {
    const params = new URLSearchParams();
    const newEntity = entity as { [key: string]: string };
    for (const key in newEntity) {
        params.append(key, newEntity[key]);
    }
    await axios.post(url, params);
}

export async function addEmployee(employee: Employee) {
    const url = 'http://127.0.0.1:8000/add_employee';
    await addEntity(url, employee);
}

export async function addTeam(team: Team) {
    const url = 'http://127.0.0.1:8000/add_team'
    await addEntity(url, team);
}

