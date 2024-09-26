import { Hono } from "hono";
import { CreateUserSchema, UpdateUserSchema } from "../database/tables/user.js";
import { createRequestValidator } from "../helpers/request-validator.js";
import {
	createUser,
	deleteUser,
	getUser,
	getUsers,
	updateUser,
} from "../services/user.js";

const app = new Hono();

app.get("/", async (c) => {
	const users = await getUsers();
	return c.json(users, 200);
});

app.get("/:id", async (c) => {
	const id = c.req.param("id");
	const result = await getUser(id);
	return c.json(result, 200);
});

app.post("/", createRequestValidator(CreateUserSchema), async (c) => {
	const user = c.req.valid("json");
	const result = await createUser(user);
	return c.json(result, 201);
});

app.patch("/:id", createRequestValidator(UpdateUserSchema), async (c) => {
	const id = c.req.param("id");
	const user = c.req.valid("json");
	const result = await updateUser(id, user);
	return c.json(result, 200);
});

app.delete("/:id", async (c) => {
	const id = c.req.param("id");
	const result = await deleteUser(id);
	return c.json(result, 200);
});

export default app;
