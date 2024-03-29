import type {Address, BasicInfo, Contract, Employee, Team} from '../types';
import axios from "axios";
import {Client, QueryResult} from 'pg'


type Entity = Employee | Team | Address | Contract | BasicInfo

export function dbEntityToApiEntity(entity: any): Entity {
    const newEntity: any = {};

    for (const [key, value] of Object.entries(entity)) {
        if (value === null) {
            newEntity[key] = "";
        } else if (typeof value === 'number') {
            newEntity[key] = (value as number).toString();
        } else if (typeof value === 'object' && value instanceof Date) {
            const date = value as Date;
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed in JavaScript
            const day = String(date.getDate()).padStart(2, '0');

            newEntity[key] = `${year}-${month}-${day}`;
        } else {
            newEntity[key] = value;
        }
    }

    return newEntity as Entity;
}

export async function queryEntities(client: Client, entity: Partial<Entity>, tableName: string): Promise<QueryResult<any>> {
    // Get an array of key-value pairs from the entity
    const entries = Object.entries(entity);
    // Create the placeholders and the values array
    const placeholders = entries.map((value, i) => `${value[0]} = $${i + 1}`).join(' AND ');
    const values = entries.map((value) => value[1]);
    const query = `SELECT *
                   FROM ${tableName}
                   WHERE ${placeholders}`;
    return await client.query(query, values);
}

export async function queryEntityById(client: Client, id: number, tableName: string): Promise<QueryResult<any>> {
    const query = `SELECT *
                   FROM ${tableName}
                   WHERE id = $1`;
    return await client.query(query, [id]);
}

export function queryBasicInfos(client: Client, basicInfo: Partial<BasicInfo>) {
    return queryEntities(client, basicInfo, 'hr_basicinfo');
}

export async function queryBasicInfoById(client: Client, id: number): Promise<BasicInfo> {
    const res = await queryEntityById(client, id, 'hr_basicinfo');
    return res.rows[0];
}

export function queryAddresses(client: Client, address: Partial<Address>) {
    return queryEntities(client, address, 'hr_address');
}

export async function queryAddressById(client: Client, id: number): Promise<Address> {
    const res = await queryEntityById(client, id, 'hr_address');
    return res.rows[0];
}

export function queryContracts(client: Client, contract: Partial<Contract>) {
    return queryEntities(client, contract, 'hr_contract');
}

export async function queryContractById(client: Client, id: number) {
    const res = await queryEntityById(client, id, 'hr_contract');
    return res.rows[0];
}

export function queryEmployees(client: Client, employee: Partial<Employee>) {
    return queryEntities(client, employee, 'hr_employee');
}

export async function queryEmployeeById(client: Client, id: number) {
    const res = await queryEntityById(client, id, 'hr_employee');
    return res.rows[0];
}

export function queryTeams(client: Client, team: Partial<Team>) {
    return queryEntities(client, team, 'hr_team');
}

export async function queryTeamById(client: Client, id: number) {
    const res = await queryEntityById(client, id, 'hr_team');
    return res.rows[0];
}

export async function queryEmployeesIds(client: Client, basicInfo: Partial<BasicInfo>) {
    const res = await queryBasicInfos(client, basicInfo);
    return res.rows.map((row) => row.id);
}

export async function queryEmployeeAggregate(client: Client, employee: BasicInfo): Promise<Employee> {
    const employeeId = (await queryEmployeesIds(client, employee))[0];
    const basicInfo = await queryBasicInfoById(client, employeeId);
    const address = await queryAddressById(client, employeeId);
    const contract = await queryContractById(client, employeeId);
    const employeeAggregate = {
        ...basicInfo,
        ...address,
        ...contract
    }
    delete employeeAggregate.id;
    return dbEntityToApiEntity(employeeAggregate) as Employee;
}



