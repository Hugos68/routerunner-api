import { eq } from "drizzle-orm";
import { parse } from "valibot";
import { database } from "../database/database.js";
import {
	CreateNoteSchema,
	type Note,
	notes,
} from "../database/tables/notes.tables.js";
import { NotFoundError } from "../utility/errors.js";

export const createNote = async (input: unknown) => {
	const values = parse(CreateNoteSchema, input);
	const [result] = await database.insert(notes).values(values).returning();
	return result;
};

export const getNotes = async () => {
	const result = await database.select().from(notes);
	return result;
};

export const getNote = async (id: Note["id"]) => {
	const [result] = await database.select().from(notes).where(eq(notes.id, id));
	if (result === undefined) {
		throw new NotFoundError(`Note with id ${id} not found`);
	}
	return result;
};

export const updateNote = async (id: Note["id"], input: unknown) => {
	const values = parse(CreateNoteSchema, input);
	const [result] = await database
		.update(notes)
		.set(values)
		.where(eq(notes.id, id))
		.returning();
	if (result === undefined) {
		throw new NotFoundError(`Note with id ${id} not found`);
	}
	return result;
};

export const deleteNote = async (id: Note["id"]) => {
	const [result] = await database.delete(notes).where(eq(notes.id, id));
	if (result === undefined) {
		throw new NotFoundError(`Note with id ${id} not found`);
	}
	return result;
};
