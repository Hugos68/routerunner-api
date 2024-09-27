import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-valibot";
import { email, minLength, string } from "valibot";

export const users = pgTable("users", {
	id: uuid("id").primaryKey().defaultRandom(),
	email: text("name").notNull(),
	password: text("password").notNull(),
});

export const InsertUserSchema = createInsertSchema(users, {
	email: string([email()]),
	password: string([minLength(10)]),
});

export type Dog = typeof users.$inferSelect;
