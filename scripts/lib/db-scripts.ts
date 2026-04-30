import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "../../src/db/schema.ts";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL not set");

const client = postgres(url, { max: 1 });
export const db = drizzle(client, { schema });
export { client };
