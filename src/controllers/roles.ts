import { Hono } from "hono";
import { authorization } from "../middleware/authorization.js";
import {
	createRole,
	deleteRole,
	getRole,
	getRoles,
	updateRole,
} from "../services/roles.js";
import type { Environment } from "../utility/types.js";

export const roles = new Hono<Environment>();

roles.post("/", authorization("ADMIN"), async (c) => {
	const role = await createRole(await c.req.json());
	return c.json(
		{
			data: role,
		},
		201,
	);
});

roles.get("/", authorization("ADMIN"), async (c) => {
	const role = await getRoles(c.req.query());
	return c.json(
		{
			data: role,
		},
		200,
	);
});

roles.get("/:id", authorization("ADMIN"), async (c) => {
	const id = c.req.param("id");
	const role = await getRole(id);
	return c.json(
		{
			data: role,
		},
		200,
	);
});

roles.patch("/:id", authorization("ADMIN"), async (c) => {
	const id = c.req.param("id");
	const role = await updateRole(id, await c.req.json());
	return c.json(
		{
			data: role,
		},
		200,
	);
});

roles.delete("/:id", authorization("ADMIN"), async (c) => {
	const id = c.req.param("id");
	const role = await deleteRole(id);
	return c.json(
		{
			data: role,
		},
		200,
	);
});
