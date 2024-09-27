import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-valibot";
import { email, minLength, partial, string } from "valibot";

export const users = pgTable("users", {
	id: uuid("id").primaryKey().defaultRandom(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	email: text("email").notNull().unique(),
	password: text("password").notNull(),
});

export type User = typeof users.$inferSelect;

export const CreateUserSchema = createInsertSchema(users, {
	email: () => string([email()]),
	password: () => string([minLength(10)]),
});

export const UpdateUserSchema = partial(CreateUserSchema);
