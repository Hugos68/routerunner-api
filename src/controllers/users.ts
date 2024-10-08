import { Hono } from "hono";
import {
	createUser,
	deleteUser,
	getUser,
	getUsers,
	updateUser,
} from "../services/users.js";
import type { Environment } from "../utility/types.js";

export const users = new Hono<Environment>();

users.get("/", async (c) => {
	const users = await getUsers(c.req.query());
	return c.json(
		{
			data: users,
		},
		200,
	);
});

users.get("/:id", async (c) => {
	const id = c.req.param("id");
	const user = await getUser(id);
	return c.json(
		{
			data: user,
		},
		200,
	);
});

users.post("/", async (c) => {
	const user = await createUser(await c.req.json());
	return c.json(
		{
			data: user,
		},
		201,
	);
});

users.patch("/:id", async (c) => {
	const id = c.req.param("id");
	const user = await updateUser(id, await c.req.json());
	return c.json(
		{
			data: user,
		},
		200,
	);
});

users.delete("/:id", async (c) => {
	const id = c.req.param("id");
	const user = await deleteUser(id);
	return c.json(
		{
			data: user,
		},
		200,
	);
});
