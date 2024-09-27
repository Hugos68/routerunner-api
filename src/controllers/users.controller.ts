import { Hono } from "hono";
import {
	createUser,
	deleteUser,
	getUser,
	getUsers,
	updateUser,
} from "../services/users.service";

const app = new Hono();

app.get("/", async (c) => {
	const users = await getUsers();
	return c.json(
		{
			value: users,
		},
		200,
	);
});

app.get("/:id", async (c) => {
	const id = c.req.param("id");
	const user = await getUser(id);
	return c.json(
		{
			value: [user],
		},
		200,
	);
});

app.post("/", async (c) => {
	const user = await createUser(await c.req.json());
	return c.json(
		{
			value: [user],
		},
		201,
	);
});

app.patch("/:id", async (c) => {
	const id = c.req.param("id");
	const user = await updateUser(id, await c.req.json());
	return c.json(
		{
			value: [user],
		},
		200,
	);
});

app.delete("/:id", async (c) => {
	const id = c.req.param("id");
	const user = await deleteUser(id);
	return c.json(
		{
			value: [user],
		},
		200,
	);
});

export default app;
