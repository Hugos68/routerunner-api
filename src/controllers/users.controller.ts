import { Hono } from "hono";
import {
	createUser,
	deleteUser,
	getUser,
	getUsers,
	updateUser,
} from "../services/users.service";

export const users = new Hono();

users.get("/", async (c) => {
	const users = await getUsers();
	return c.json(
		{
			value: users,
		},
		200,
	);
});

users.get("/:id", async (c) => {
	const id = c.req.param("id");
	const user = await getUser(id);
	return c.json(
		{
			value: [user],
		},
		200,
	);
});

users.post("/", async (c) => {
	const user = await createUser(await c.req.json());
	return c.json(
		{
			value: [user],
		},
		201,
	);
});

users.patch("/:id", async (c) => {
	const id = c.req.param("id");
	const user = await updateUser(id, await c.req.json());
	return c.json(
		{
			value: [user],
		},
		200,
	);
});

users.delete("/:id", async (c) => {
	const id = c.req.param("id");
	const user = await deleteUser(id);
	return c.json(
		{
			value: [user],
		},
		200,
	);
});
