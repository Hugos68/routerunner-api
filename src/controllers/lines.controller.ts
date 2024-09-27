import { Hono } from "hono";
import {
	createLine,
	deleteLine,
	getLine,
	getLines,
	updateLine,
} from "../services/lines.service";

export const lines = new Hono();

lines.post("/", async (c) => {
	const line = await createLine(await c.req.json());
	return c.json(
		{
			value: [line],
		},
		201,
	);
});

lines.get("/", async (c) => {
	const lines = await getLines();
	return c.json(
		{
			value: lines,
		},
		200,
	);
});

lines.get("/:id", async (c) => {
	const id = c.req.param("id");
	const line = await getLine(id);
	return c.json(
		{
			value: [line],
		},
		200,
	);
});

lines.patch("/:id", async (c) => {
	const id = c.req.param("id");
	const line = await updateLine(id, await c.req.json());
	return c.json(
		{
			value: [line],
		},
		200,
	);
});

lines.delete("/:id", async (c) => {
	const id = c.req.param("id");
	const line = await deleteLine(id);
	return c.json(
		{
			value: [line],
		},
		200,
	);
});
