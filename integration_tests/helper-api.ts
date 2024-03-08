import type {Address, BasicInfo, Contract, Employee, Team} from '../types';
import axios from "axios";
import {Client, QueryResult} from 'pg'

export function resetDatabase() {
    let url = 'http://127.0.0.1:8000/reset_db'
    return axios.post(url)
}

async function addEntity(url: string, entity: Employee | Team) {
    const params = new URLSearchParams();
    const newEntity = entity as { [key: string]: string };
    for (const key in newEntity) {
        params.append(key, newEntity[key]);
    }
    await axios.post(url, params);
}

export function addEmployee(employee: Employee) {
    const url = 'http://127.0.0.1:8000/add_employee';
    return addEntity(url, employee);
}

export function addTeam(team: Team) {
    const url = 'http://127.0.0.1:8000/add_team'
    return addEntity(url, team);
}
