import { eq } from "drizzle-orm";
import { parse } from "valibot";
import { database } from "../database/database.js";
import {
	CreateNoteSchema,
	type Note,
	notes_table,
} from "../database/tables/notes.js";
import { NotFoundError } from "../utility/errors.js";

export const create_note = async (input: unknown) => {
	const values = parse(CreateNoteSchema, input);
	const [note] = await database.insert(notes_table).values(values).returning();
	if (note === undefined) {
		throw new Error("Failed to create note");
	}
	return note;
};

export const get_notes = async () => {
	const notes = await database.select().from(notes_table);
	return notes;
};

export const get_note = async (id: Note["id"]) => {
	const [note] = await database
		.select()
		.from(notes_table)
		.where(eq(notes_table.id, id));
	if (note === undefined) {
		throw new NotFoundError(`Note with id ${id} not found`);
	}
	return note;
};

export const update_note = async (id: Note["id"], input: unknown) => {
	const values = parse(CreateNoteSchema, input);
	const [note] = await database
		.update(notes_table)
		.set(values)
		.where(eq(notes_table.id, id))
		.returning();
	if (note === undefined) {
		throw new NotFoundError(`Note with id ${id} not found`);
	}
	return note;
};

export const delete_note = async (id: Note["id"]) => {
	const [note] = await database
		.delete(notes_table)
		.where(eq(notes_table.id, id));
	if (note === undefined) {
		throw new NotFoundError(`Note with id ${id} not found`);
	}
	return note;
};
