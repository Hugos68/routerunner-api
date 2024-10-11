import { eq } from "drizzle-orm";
import { database } from "../database/database.ts";
import { notesTable } from "../database/tables/notes.ts";
import type { Actor } from "../types/actor.ts";
import type { Note, NoteToCreate, NoteToUpdate } from "../types/note.ts";
import { authorize } from "../utility/authorize.ts";
import { ResourceNotFoundError } from "../utility/errors.ts";

export const getNotes = async (actor: Actor) => {
	authorize(actor).isAuthenticated();
	const notes = await database.select().from(notesTable);
	return notes;
};

export const getNote = async (actor: Actor, id: Note["id"]) => {
	authorize(actor)
		.isAuthenticated()
		.throwCustomError(new ResourceNotFoundError());
	const [note] = await database
		.select()
		.from(notesTable)
		.where(eq(notesTable.id, id));
	if (note === undefined) {
		throw new ResourceNotFoundError();
	}
	return note;
};

export const createNote = async (actor: Actor, noteToCreate: NoteToCreate) => {
	authorize(actor).isAuthenticated();
	const [note] = await database
		.insert(notesTable)
		.values(noteToCreate)
		.returning();
	if (note === undefined) {
		throw new Error("Failed to create note");
	}
	return note;
};

export const updateNote = async (
	actor: Actor,
	id: Note["id"],
	noteToUpdate: NoteToUpdate,
) => {
	authorize(actor)
		.isAuthenticated()
		.throwCustomError(new ResourceNotFoundError());
	const [note] = await database
		.update(notesTable)
		.set(noteToUpdate)
		.where(eq(notesTable.id, id))
		.returning();
	if (note === undefined) {
		throw new Error("Failed to update note");
	}
	return note;
};

export const deleteNote = async (actor: Actor, id: Note["id"]) => {
	authorize(actor)
		.isAuthenticated()
		.throwCustomError(new ResourceNotFoundError());
	const [note] = await database
		.delete(notesTable)
		.where(eq(notesTable.id, id))
		.returning();
	if (note === undefined) {
		throw new Error("Failed to delete note");
	}
	return note;
};
