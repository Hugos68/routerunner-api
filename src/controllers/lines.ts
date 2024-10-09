import { Hono } from "hono";
import { authorization } from "../middleware/authorization.js";
import {
	createLine,
	deleteLine,
	getLine,
	getLines,
	updateLine,
} from "../services/lines.js";
import { RouterunnerResponse } from "../utility/responses.js";
import type { Environment } from "../utility/types.js";

export const lines = new Hono<Environment>();

lines.post("/", authorization("PLANNER", "ADMIN"), async (c) => {
	const line = await createLine(await c.req.json());
	return c.json(RouterunnerResponse.data(line), 201);
});

lines.get("/", authorization("DRIVER", "PLANNER", "ADMIN"), async (c) => {
	const lines = await getLines(c.req.query());
	return c.json(RouterunnerResponse.data(lines), 200);
});

lines.get("/:id", authorization("DRIVER", "PLANNER", "ADMIN"), async (c) => {
	const id = c.req.param("id");
	const line = await getLine(id);
	return c.json(RouterunnerResponse.data(line), 200);
});

lines.patch("/:id", authorization("PLANNER", "ADMIN"), async (c) => {
	const id = c.req.param("id");
	const line = await updateLine(id, await c.req.json());
	return c.json(RouterunnerResponse.data(line), 200);
});

lines.delete("/:id", authorization("PLANNER", "ADMIN"), async (c) => {
	const id = c.req.param("id");
	const line = await deleteLine(id);
	return c.json(RouterunnerResponse.data(line), 200);
});
