import { pgTable, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-valibot";
import { users } from "./users.model";

export const sessions = pgTable("sessions", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id),
});

export type Session = typeof sessions.$inferSelect;

export const CreateSessionSchema = createInsertSchema(sessions);
