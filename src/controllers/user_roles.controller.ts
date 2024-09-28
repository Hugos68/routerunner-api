import { Hono } from "hono";
import {
	createUserRole,
	deleteUserRole,
	getUserRole,
	getUserRoles,
	updateUserRole,
} from "../services/user_roles.service";
import type { Environment } from "../utility/types.js";

export const userRoles = new Hono<Environment>();

userRoles.post("/", async (c) => {
	const userRole = await createUserRole(await c.req.json());
	return c.json(
		{
			value: [userRole],
		},
		201,
	);
});

userRoles.get("/", async (c) => {
	const userRoles = await getUserRoles();
	return c.json(
		{
			value: userRoles,
		},
		200,
	);
});

userRoles.get("/:id", async (c) => {
	const id = c.req.param("id");
	const userRole = await getUserRole(id);
	return c.json(
		{
			value: [userRole],
		},
		200,
	);
});

userRoles.patch("/:id", async (c) => {
	const id = c.req.param("id");
	const userRole = await updateUserRole(id, await c.req.json());
	return c.json(
		{
			value: [userRole],
		},
		200,
	);
});

userRoles.delete("/:id", async (c) => {
	const id = c.req.param("id");
	const userRole = await deleteUserRole(id);
	return c.json(
		{
			value: [userRole],
		},
		200,
	);
});
