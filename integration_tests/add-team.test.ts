import axios from 'axios'
import {Client} from 'pg'
import {afterAll, beforeAll, expect, test} from '@jest/globals'
import {addTeam} from "./helper";

const DATABASE_URL = 'postgresql://hr:hr@localhost:5433/hr'
let client: Client

beforeAll(async () => {
    client = new Client({connectionString: DATABASE_URL})
    await client.connect()
})

afterAll(async () => {
    await client.end()
})

test('adding a team', async () => {
    let url = 'http://127.0.0.1:8000/reset_db'
    await axios.post(url)

    await addTeam({name: 'Typescript devs'})

    const res = await client.query('SELECT name FROM hr_team')

    expect(res.rows).toEqual([{name: 'Typescript devs'}])

    await client.end()
})
