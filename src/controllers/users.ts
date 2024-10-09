import { Hono } from "hono";
import { authorization } from "../middleware/authorization.js";
import {
	createUser,
	deleteUser,
	getUser,
	getUsers,
	updateUser,
} from "../services/users.js";
import { RouterunnerResponse } from "../utility/responses.js";
import type { Environment } from "../utility/types.js";

export const users = new Hono<Environment>();

users.post("/", authorization("ADMIN"), async (c) => {
	const user = await createUser(await c.req.json());
	return c.json(RouterunnerResponse.data(user), 201);
});

users.get("/", authorization("ADMIN"), async (c) => {
	const users = await getUsers(c.req.query());
	return c.json(RouterunnerResponse.data(users), 200);
});

users.get("/me", authorization("DRIVER", "PLANNER", "ADMIN"), async (c) => {
	const session = c.get("session");
	// biome-ignore lint/style/noNonNullAssertion: Because of the `authorization` middleware, this cannot ever be null
	const user = await getUser(session!.user.id);
	return c.json(RouterunnerResponse.data(user), 200);
});

users.get("/:id", authorization("ADMIN"), async (c) => {
	const id = c.req.param("id");
	const user = await getUser(id);
	return c.json(RouterunnerResponse.data(user), 200);
});

users.patch("/:id", authorization("ADMIN"), async (c) => {
	const id = c.req.param("id");
	const user = await updateUser(id, await c.req.json());
	return c.json(RouterunnerResponse.data(user), 200);
});

users.delete("/:id", authorization("ADMIN"), async (c) => {
	const id = c.req.param("id");
	const user = await deleteUser(id);
	return c.json(RouterunnerResponse.data(user), 200);
});
