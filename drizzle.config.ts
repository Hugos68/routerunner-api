import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "postgresql",
	schema: "./src/database/tables/*.ts",
	schemaFilter: "public",
	dbCredentials: {
		host: process.env.POSTGRES_HOST as string,
		port: Number.parseInt(process.env.POSTGRES_PORT as string),
		database: process.env.POSTGRES_DATABASE as string,
		user: process.env.POSTGRES_USERNAME as string,
		password: process.env.POSTGRES_PASSWORD as string,
	},
});
