import { Hono } from "hono";
import {
	createNote,
	deleteNote,
	getNote,
	getNotes,
	updateNote,
} from "../services/notes.service";

export const notes = new Hono();

notes.post("/", async (c) => {
	const note = await createNote(await c.req.json());
	return c.json(
		{
			value: [note],
		},
		201,
	);
});

notes.get("/", async (c) => {
	const notes = await getNotes();
	return c.json(
		{
			value: notes,
		},
		200,
	);
});

notes.get("/:id", async (c) => {
	const id = c.req.param("id");
	const note = await getNote(id);
	return c.json(
		{
			value: [note],
		},
		200,
	);
});

notes.patch("/:id", async (c) => {
	const id = c.req.param("id");
	const note = await updateNote(id, await c.req.json());
	return c.json(
		{
			value: [note],
		},
		200,
	);
});

notes.delete("/:id", async (c) => {
	const id = c.req.param("id");
	const note = await deleteNote(id);
	return c.json(
		{
			value: [note],
		},
		200,
	);
});
