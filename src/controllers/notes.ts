import { Hono } from "hono";
import {
	create_note,
	delete_note,
	get_note,
	get_notes,
	update_note,
} from "../services/notes.js";
import type { Environment } from "../utility/types.js";

export const notes = new Hono<Environment>();

notes.post("/", async (c) => {
	const note = await create_note(await c.req.json());
	return c.json(
		{
			value: [note],
		},
		201,
	);
});

notes.get("/", async (c) => {
	const notes = await get_notes();
	return c.json(
		{
			value: notes,
		},
		200,
	);
});

notes.get("/:id", async (c) => {
	const id = c.req.param("id");
	const note = await get_note(id);
	return c.json(
		{
			value: [note],
		},
		200,
	);
});

notes.patch("/:id", async (c) => {
	const id = c.req.param("id");
	const note = await update_note(id, await c.req.json());
	return c.json(
		{
			value: [note],
		},
		200,
	);
});

notes.delete("/:id", async (c) => {
	const id = c.req.param("id");
	const note = await delete_note(id);
	return c.json(
		{
			value: [note],
		},
		200,
	);
});
