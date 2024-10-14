import { drizzle } from "drizzle-orm/connect";

export const database = await drizzle(
	"node-postgres",
	String(process.env.DATABASE_URL),
);
