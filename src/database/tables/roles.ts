import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const rolesTable = pgTable("roles", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("role", { enum: ["DRIVER", "PLANNER", "ADMIN"] })
		.notNull()
		.unique(),
});
