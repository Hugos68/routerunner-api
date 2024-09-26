import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const driver = pgTable("driver", {
	id: uuid("id").primaryKey().defaultRandom(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	email: text("email").notNull().unique(),
	password: text("password").notNull(),
});
