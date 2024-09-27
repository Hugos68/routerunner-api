import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const dogs = pgTable("dogs", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
});

export type Dog = typeof dogs.$inferSelect;
