import { and, eq } from "drizzle-orm";
import { parse } from "valibot";
import { database } from "../database/database.js";
import { CreateNoteSchema, type Note, notesTable } from "../database/schema.js";
import { createFilterCondition } from "../utility/create-filter-conditions.js";
import { NotFoundError } from "../utility/errors.js";

export const createNote = async (input: unknown) => {
	const values = parse(CreateNoteSchema, input);
	const [note] = await database.insert(notesTable).values(values).returning();
	if (note === undefined) {
		throw new Error("Failed to create note");
	}
	return note;
};

export const getNotes = async (filter: Record<string, unknown> = {}) => {
	const conditions = createFilterCondition(filter, notesTable);
	const notes = await database
		.select()
		.from(notesTable)
		.where(and(...conditions));
	return notes;
};

export const getNote = async (id: Note["id"]) => {
	const [note] = await database
		.select()
		.from(notesTable)
		.where(eq(notesTable.id, id));
	if (note === undefined) {
		throw new NotFoundError(`Note with id ${id} not found`);
	}
	return note;
};

export const updateNote = async (id: Note["id"], input: unknown) => {
	const values = parse(CreateNoteSchema, input);
	const [note] = await database
		.update(notesTable)
		.set(values)
		.where(eq(notesTable.id, id))
		.returning();
	if (note === undefined) {
		throw new NotFoundError(`Note with id ${id} not found`);
	}
	return note;
};

export const deleteNote = async (id: Note["id"]) => {
	const [note] = await database
		.delete(notesTable)
		.where(eq(notesTable.id, id))
		.returning();
	if (note === undefined) {
		throw new NotFoundError(`Note with id ${id} not found`);
	}
	return note;
};
