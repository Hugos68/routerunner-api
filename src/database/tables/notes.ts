import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-valibot";
import { partial } from "valibot";

export const notes_table = pgTable("notes", {
	id: uuid("id").primaryKey().defaultRandom(),
	content: text("content").notNull(),
	photo: text("photo").notNull(),
});

export type Note = typeof notes_table.$inferSelect;

export const CreateNoteSchema = createInsertSchema(notes_table);

export const UpdateNoteSchema = partial(CreateNoteSchema);
