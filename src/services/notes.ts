import { and, eq } from "drizzle-orm";
import { parse, partial } from "valibot";
import { database } from "../database/database.js";
import {
	CreateNoteSchema,
	type Note,
	notes_table,
} from "../database/schema.js";
import { create_filter_conditions } from "../utility/create-filter-conditions.js";
import { NotFoundError } from "../utility/errors.js";

export const create_note = async (input: unknown) => {
	const values = parse(CreateNoteSchema, input);
	const [note] = await database.insert(notes_table).values(values).returning();
	if (note === undefined) {
		throw new Error("Failed to create note");
	}
	return note;
};

export const get_notes = async (filter: Record<string, unknown> = {}) => {
	const conditions = create_filter_conditions(
		filter,
		partial(CreateNoteSchema),
		notes_table,
	);
	const notes = await database
		.select()
		.from(notes_table)
		.where(and(...conditions));
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
