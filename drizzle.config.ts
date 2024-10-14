import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "postgresql",
	schema: "./src/database/tables/*.ts",

	dbCredentials: {
		url: String(process.env.DATABASE_URL),
	},
});
