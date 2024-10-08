import { Hono } from "hono";
import {
	createRole,
	deleteRole,
	getRole,
	getRoles,
	updateRole,
} from "../services/roles.js";
import type { Environment } from "../utility/types.js";

export const roles = new Hono<Environment>();

roles.post("/", async (c) => {
	const role = await createRole(await c.req.json());
	return c.json(
		{
			data: role,
		},
		201,
	);
});

roles.get("/", async (c) => {
	const role = await getRoles(c.req.query());
	return c.json(
		{
			data: role,
		},
		200,
	);
});

roles.get("/:id", async (c) => {
	const id = c.req.param("id");
	const role = await getRole(id);
	return c.json(
		{
			data: role,
		},
		200,
	);
});

roles.patch("/:id", async (c) => {
	const id = c.req.param("id");
	const role = await updateRole(id, await c.req.json());
	return c.json(
		{
			data: role,
		},
		200,
	);
});

roles.delete("/:id", async (c) => {
	const id = c.req.param("id");
	const role = await deleteRole(id);
	return c.json(
		{
			data: role,
		},
		200,
	);
});
