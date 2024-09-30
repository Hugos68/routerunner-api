import { Hono } from "hono";
import {
	create_user,
	delete_user,
	get_user,
	get_users,
	update_user,
} from "../services/users.js";
import type { Environment } from "../utility/types.js";

export const users = new Hono<Environment>();

users.get("/", async (c) => {
	const users = await get_users();
	return c.json(
		{
			data: users,
		},
		200,
	);
});

users.get("/:id", async (c) => {
	const id = c.req.param("id");
	const user = await get_user(id);
	return c.json(
		{
			data: [user],
		},
		200,
	);
});

users.post("/", async (c) => {
	const user = await create_user(await c.req.json());
	return c.json(
		{
			data: [user],
		},
		201,
	);
});

users.patch("/:id", async (c) => {
	const id = c.req.param("id");
	const user = await update_user(id, await c.req.json());
	return c.json(
		{
			data: [user],
		},
		200,
	);
});

users.delete("/:id", async (c) => {
	const id = c.req.param("id");
	const user = await delete_user(id);
	return c.json(
		{
			data: [user],
		},
		200,
	);
});
