import { pgTable, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-valibot";
import { partial } from "valibot";
import { users } from "./users.table";

export const sessions = pgTable("sessions", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id),
});

export type Session = typeof sessions.$inferSelect;

export const CreateSessionSchema = createInsertSchema(sessions);
