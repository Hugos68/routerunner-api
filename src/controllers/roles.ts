import { Hono } from "hono";
import {
	create_role,
	delete_role,
	get_role,
	get_roles,
	update_role,
} from "../services/roles.js";
import type { Environment } from "../utility/types.js";

export const roles = new Hono<Environment>();

roles.post("/", async (c) => {
	const role = await create_role(await c.req.json());
	return c.json(
		{
			value: [role],
		},
		201,
	);
});

roles.get("/", async (c) => {
	const role = await get_roles();
	return c.json(
		{
			value: role,
		},
		200,
	);
});

roles.get("/:id", async (c) => {
	const id = c.req.param("id");
	const role = await get_role(id);
	return c.json(
		{
			value: [role],
		},
		200,
	);
});

roles.patch("/:id", async (c) => {
	const id = c.req.param("id");
	const role = await update_role(id, await c.req.json());
	return c.json(
		{
			value: [role],
		},
		200,
	);
});

roles.delete("/:id", async (c) => {
	const id = c.req.param("id");
	const role = await delete_role(id);
	return c.json(
		{
			value: [role],
		},
		200,
	);
});
