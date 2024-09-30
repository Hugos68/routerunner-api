import { Hono } from "hono";
import {
	create_user_role,
	delete_user_role,
	get_user_role,
	get_user_roles,
	update_user_role,
} from "../services/user-roles.js";
import type { Environment } from "../utility/types.js";

export const user_roles = new Hono<Environment>();

user_roles.post("/", async (c) => {
	const user_role = await create_user_role(await c.req.json());
	return c.json(
		{
			data: [user_role],
		},
		201,
	);
});

user_roles.get("/", async (c) => {
	const user_roles = await get_user_roles();
	return c.json(
		{
			data: user_roles,
		},
		200,
	);
});

user_roles.get("/:id", async (c) => {
	const id = c.req.param("id");
	const user_role = await get_user_role(id);
	return c.json(
		{
			data: [user_role],
		},
		200,
	);
});

user_roles.patch("/:id", async (c) => {
	const id = c.req.param("id");
	const user_role = await update_user_role(id, await c.req.json());
	return c.json(
		{
			data: [user_role],
		},
		200,
	);
});

user_roles.delete("/:id", async (c) => {
	const id = c.req.param("id");
	const user_role = await delete_user_role(id);
	return c.json(
		{
			data: [user_role],
		},
		200,
	);
});
