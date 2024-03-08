import axios from 'axios'
import {Client} from 'pg'
import {afterAll, beforeAll, expect, test} from '@jest/globals'
import {Employee} from "../types";
import {addEmployee} from "./helper-api";

const DATABASE_URL = 'postgresql://hr:hr@localhost:5433/hr'
let client: Client

beforeAll(async () => {
    client = new Client({connectionString: DATABASE_URL})
    await client.connect()
})

afterAll(async () => {
    await client.end()
})

test('adding employees with the same email', async () => {
    let url = 'http://127.0.0.1:8000/reset_db'
    await axios.post(url)


    url = 'http://127.0.0.1:8000/add_employee'
    const params = new URLSearchParams()

    const employees: Employee[] =[ {
        name: 'John Doe',
        email: 'john.doe@gmail.com',
        address_line1: '123 Main St',
        address_line2: '',
        city: 'Anytown',
        zip_code: '12345',
        hiring_date: '2021-01-01',
        job_title: 'Software Engineer'
    }, { name: 'Farah Doe',
        email: 'john.doe@gmail.com',
        address_line1: '2 bis chemin',
        address_line2: '',
        city: 'Anytown',
        zip_code: '12345',
        hiring_date: '2021-01-0"',
        job_title: 'Data Engineer'}]
    employees.forEach(async (employee) => {
        await addEmployee(employee)
    })

    const res = await client.query('SELECT COUNT(*) FROM hr_basicinfo WHERE email ="john.doe@gmail.com"')

    expect(res).toEqual(1)

    await client.end()
})
