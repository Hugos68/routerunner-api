import { Hono } from "hono";
import {
	createNote,
	deleteNote,
	getNote,
	getNotes,
	updateNote,
} from "../services/notes.js";
import type { Environment } from "../utility/types.js";

export const notes = new Hono<Environment>();

notes.post("/", async (c) => {
	const note = await createNote(await c.req.json());
	return c.json(
		{
			data: note,
		},
		201,
	);
});

notes.get("/", async (c) => {
	const notes = await getNotes(c.req.query());
	return c.json(
		{
			data: notes,
		},
		200,
	);
});

notes.get("/:id", async (c) => {
	const id = c.req.param("id");
	const note = await getNote(id);
	return c.json(
		{
			data: note,
		},
		200,
	);
});

notes.patch("/:id", async (c) => {
	const id = c.req.param("id");
	const note = await updateNote(id, await c.req.json());
	return c.json(
		{
			data: note,
		},
		200,
	);
});

notes.delete("/:id", async (c) => {
	const id = c.req.param("id");
	const note = await deleteNote(id);
	return c.json(
		{
			data: note,
		},
		200,
	);
});
