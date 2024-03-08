import axios from 'axios'
import {Client} from 'pg'
import {afterAll, beforeAll, expect, test} from '@jest/globals'
import {Employee} from "../types";
import {addEmployee} from "./helper";

const DATABASE_URL = 'postgresql://hr:hr@localhost:5433/hr'
let client: Client

beforeAll(async () => {
    client = new Client({connectionString: DATABASE_URL})
    await client.connect()
})

afterAll(async () => {
    await client.end()
})

test('adding an employee', async () => {
    let url = 'http://127.0.0.1:8000/reset_db'
    await axios.post(url)


    url = 'http://127.0.0.1:8000/add_employee'
    const params = new URLSearchParams()

    const employee: Employee = {
        name: 'John Doe',
        email: 'john.doe@gmail.com',
        address_line1: '123 Main St',
        address_line2: '',
        city: 'Anytown',
        zip_code: '12345',
        hiring_date: '2021-01-01',
        job_title: 'Software Engineer'
    }
    await addEmployee(employee)

    const db_employee_basic_info = await client.query(
        'SELECT name, email FROM hr_basicinfo WHERE name = $1 AND email = $2',
        [employee.name, employee.email]
    );

    console.log(db_employee_basic_info.rows)

    await client.end()
})
