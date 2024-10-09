import { Hono } from "hono";
import { authorization } from "../middleware/authorization.js";
import {
	createNote,
	deleteNote,
	getNote,
	getNotes,
	updateNote,
} from "../services/notes.js";
import { RouterunnerResponse } from "../utility/responses.js";
import type { Environment } from "../utility/types.js";

export const notes = new Hono<Environment>();

notes.post("/", authorization("DRIVER", "PLANNER", "ADMIN"), async (c) => {
	const note = await createNote(await c.req.json());
	return c.json(RouterunnerResponse.data(note), 201);
});

notes.get("/", authorization("DRIVER", "PLANNER", "ADMIN"), async (c) => {
	const notes = await getNotes(c.req.query());
	return c.json(RouterunnerResponse.data(notes), 200);
});

notes.get("/:id", authorization("DRIVER", "PLANNER", "ADMIN"), async (c) => {
	const id = c.req.param("id");
	const note = await getNote(id);
	return c.json(RouterunnerResponse.data(note), 200);
});

notes.patch("/:id", authorization("DRIVER", "PLANNER", "ADMIN"), async (c) => {
	const id = c.req.param("id");
	const note = await updateNote(id, await c.req.json());
	return c.json(RouterunnerResponse.data(note), 200);
});

notes.delete("/:id", authorization("DRIVER", "PLANNER", "ADMIN"), async (c) => {
	const id = c.req.param("id");
	const note = await deleteNote(id);
	return c.json(RouterunnerResponse.data(note), 200);
});
