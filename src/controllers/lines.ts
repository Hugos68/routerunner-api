import { Hono } from "hono";
import {
	create_line,
	delete_line,
	get_line,
	get_lines,
	update_line,
} from "../services/lines.js";
import type { Environment } from "../utility/types.js";

export const lines = new Hono<Environment>();

lines.post("/", async (c) => {
	const line = await create_line(await c.req.json());
	return c.json(
		{
			data: [line],
		},
		201,
	);
});

lines.get("/", async (c) => {
	const lines = await get_lines();
	return c.json(
		{
			data: lines,
		},
		200,
	);
});

lines.get("/:id", async (c) => {
	const id = c.req.param("id");
	const line = await get_line(id);
	return c.json(
		{
			data: [line],
		},
		200,
	);
});

lines.patch("/:id", async (c) => {
	const id = c.req.param("id");
	const line = await update_line(id, await c.req.json());
	return c.json(
		{
			data: [line],
		},
		200,
	);
});

lines.delete("/:id", async (c) => {
	const id = c.req.param("id");
	const line = await delete_line(id);
	return c.json(
		{
			data: [line],
		},
		200,
	);
});
