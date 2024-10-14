import type { z } from "zod";

import type {
	CreateNoteSchema,
	NoteQuerySchema,
	NoteSchema,
	UpdateNoteSchema,
} from "../schemas/notes.ts";

export type Note = z.infer<typeof NoteSchema>;
export type NoteToCreate = z.infer<typeof CreateNoteSchema>;
export type NoteToUpdate = z.infer<typeof UpdateNoteSchema>;
export type NoteQuery = z.infer<typeof NoteQuerySchema>;
