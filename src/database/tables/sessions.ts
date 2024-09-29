import { pgTable, uuid } from "drizzle-orm/pg-core";
import { pick } from "valibot";
import { CreateUserSchema, users_table } from "./users.js";

export const sessions_table = pgTable("sessions", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users_table.id),
});

export type Session = typeof sessions_table.$inferSelect;

export const CreateSessionSchema = pick(CreateUserSchema, [
	"email",
	"password",
]);
