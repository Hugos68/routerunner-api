import { beforeEach, describe, expect, it } from "bun:test";
// biome-ignore lint/style/noNamespaceImport: <explanation>
import * as uuid from "uuid";
import {
	createNote,
	deleteNote,
	getNote,
	getNotes,
	updateNote,
} from "../src/services/notes.ts";
import type { Note } from "../src/types/note.ts";
import { ResourceNotFoundError } from "../src/utility/errors.ts";
import { seedDatabase } from "./seed.ts";

let seedData: Awaited<ReturnType<typeof seedDatabase>>;

beforeEach(async () => {
	seedData = await seedDatabase();
});

describe.skip("Notes Service Tests", () => {
	it("should get all notes as an admin", async () => {
		const adminActor = { ...seedData.admin, role: seedData.adminRole };

		const notes = await getNotes(adminActor, {});
		expect(notes).toBeDefined();
		expect(notes.length).toBeGreaterThan(0);
	});

	it("should get a note by ID as a planner", async () => {
		const plannerActor = { ...seedData.planner, role: seedData.plannerRole };
		const noteId = seedData.note.id;

		const note = await getNote(plannerActor, noteId);
		expect(note).toBeDefined();
		expect(note.id).toBe(noteId);
	});

	it("should create a new note as a driver", async () => {
		const driverActor = { ...seedData.driver, role: seedData.driverRole };
		const noteToCreate = { orderId: seedData.order.id, content: "test" };

		const createdNote: Note = await createNote(driverActor, noteToCreate);
		expect(createdNote).toBeDefined();
		expect(createdNote.content).toBe("test");
	});

	it("should update a note as a planner", async () => {
		const plannerActor = { ...seedData.planner, role: seedData.plannerRole };
		const noteId = seedData.note.id;
		const noteToUpdate = {
			orderId: seedData.order.id,
			content: "An updated note",
		};

		const updatedNote = await updateNote(plannerActor, noteId, noteToUpdate);
		expect(updatedNote).toBeDefined();
		expect(updatedNote.content).toBe("An updated note");
	});

	it("should delete a note as a driver", async () => {
		const driverActor = { ...seedData.driver, role: seedData.driverRole };
		const noteId = seedData.note.id;

		const note = await deleteNote(driverActor, noteId);
		expect(note).toBeDefined();
	});

	it("should throw ResourceNotFoundError when getting a nonexistent note", async () => {
		const adminActor = { ...seedData.admin, role: seedData.adminRole };
		const nonexistentNoteId = uuid.v4();

		await expect(getNote(adminActor, nonexistentNoteId)).rejects.toThrow(
			ResourceNotFoundError,
		);
	});
});
