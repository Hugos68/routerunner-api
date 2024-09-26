import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-valibot";
import { email, minLength, string } from "valibot";

export const user = pgTable("user", {
	id: uuid("id").primaryKey().defaultRandom(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	email: text("email").notNull().unique(),
	password: text("password").notNull(),
});

export type User = typeof user.$inferSelect;

export const InsertUserSchema = createInsertSchema(user, {
	email: () => string([email()]),
	password: () => string([minLength(10)]),
});
