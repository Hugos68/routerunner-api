import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const role = pgTable("role", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("role", { enum: ["ADMIN", "USER", "GUEST"] })
		.notNull()
		.unique(),
});
