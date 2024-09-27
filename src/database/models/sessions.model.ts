import { pgTable, uuid } from "drizzle-orm/pg-core";
import { pick } from "valibot";
import { CreateUserSchema, users } from "./users.model";

export const sessions = pgTable("sessions", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id),
});

export type Session = typeof sessions.$inferSelect;

export const CreateSessionSchema = pick(CreateUserSchema, [
	"email",
	"password",
]);
