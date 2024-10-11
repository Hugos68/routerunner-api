import { createSelectSchema } from "drizzle-zod";
import { notesTable } from "../database/tables/notes.ts";

export const NoteSchema = createSelectSchema(notesTable);
export const CreateNoteSchema = NoteSchema.omit({ id: true });
export const UpdateNoteSchema = CreateNoteSchema.partial();
export const NoteParamsSchema = NoteSchema.pick({ id: true });
export const NoteQuerySchema = NoteSchema.partial();
