import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
// biome-ignore lint/style/noNamespaceImport: Required by Drizzle
import * as schema from "./schema.js";

const client = postgres({
	host: process.env.POSTGRES_HOST as string,
	port: Number.parseInt(process.env.POSTGRES_PORT as string),
	database: process.env.POSTGRES_DATABASE as string,
	user: process.env.POSTGRES_USERNAME as string,
	password: process.env.POSTGRES_PASSWORD as string,
});

export const database = drizzle(client, { schema: schema, logger: true });
