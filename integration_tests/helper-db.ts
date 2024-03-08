import type {Address, BasicInfo, Contract, Employee, Team} from '../types';
import axios from "axios";
import {Client, QueryResult} from 'pg'


type Entity = Partial<Employee | Team | Address | Contract | BasicInfo>;

export async function queryEntities(client: Client, entity: Entity): Promise<QueryResult<any>> {
    // Determine the table name based on the type of the entity
    const tableName = entity.constructor.name.toLowerCase();

    // Get an array of key-value pairs from the entity
    const entries = Object.entries(entity);

    // Create the placeholders and the values array
    const placeholders = entries.map((_, i) => `$${i + 1}`).join(', ');
    const values = entries.map(([_, value]) => value);

    const query = `SELECT *
                   FROM ${tableName}
                   WHERE ${placeholders}`;

    return await client.query(query, values);
}

export function queryBasicInfos(client: Client, basicInfo: Partial<BasicInfo>) {
    return queryEntities(client, basicInfo);
}


