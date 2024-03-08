import axios from "axios";
import {Client} from "pg";
import {afterAll, beforeAll, expect, test} from "@jest/globals";
import {BasicInfo, Employee} from "../types";
import {addEmployee, resetDatabase} from "./helper-api";
import * as url from "url";
import {queryBasicInfos, queryEmployeeAggregate} from "./helper-db";

const DATABASE_URL = "postgresql://hr:hr@localhost:5433/hr";
let client: Client;

beforeAll(async () => {
    client = new Client({connectionString: DATABASE_URL});
    await client.connect();
});

afterAll(async () => {
    await client.end();
});

test("adding an employee", async () => {
    await resetDatabase();

    const employee: Employee = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        address_line1: "123 Main St",
        address_line2: "",
        city: "Anytown",
        zip_code: "12345",
        hiring_date: "2021-01-01",
        job_title: "Software Engineer",
    };
    await addEmployee(employee);

    const db_employee = await queryEmployeeAggregate(client, {email: employee.email, name: employee.name});
    expect(db_employee).toEqual(employee);

    await client.end();
});
