import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-valibot";
import { partial } from "valibot";

export const notes = pgTable("notes", {
	id: uuid("id").primaryKey().defaultRandom(),
	content: text("content").notNull(),
	photo: text("photo").notNull(),
});

export type Note = typeof notes.$inferSelect;

export const CreateNoteSchema = createInsertSchema(notes);

export const UpdateNoteSchema = partial(CreateNoteSchema);
