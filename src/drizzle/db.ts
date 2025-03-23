import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "./schema"

export const client = new Client({
    connectionString: process.env.DATABASE_URL as string,
    ssl: {
        rejectUnauthorized: false
    }
})

const main = async () => {
    try {
        await client.connect();
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
}
main();

const db = drizzle(client, { schema, logger: true })

export default db;