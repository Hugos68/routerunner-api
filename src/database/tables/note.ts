import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const note = pgTable("note", {
	id: uuid("id").primaryKey().defaultRandom(),
	content: text("content").notNull(),
	photo: text("photo").notNull(),
});
