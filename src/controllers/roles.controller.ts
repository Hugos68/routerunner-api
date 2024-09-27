import { Hono } from "hono";
import {
	createRole,
	deleteRole,
	getRole,
	getRoles,
	updateRole,
} from "../services/roles.service";

const app = new Hono();

app.post("/", async (c) => {
	const role = await createRole(await c.req.json());
	return c.json(
		{
			value: [role],
		},
		201,
	);
});

app.get("/", async (c) => {
	const role = await getRoles();
	return c.json(
		{
			value: role,
		},
		200,
	);
});

app.get("/:id", async (c) => {
	const id = c.req.param("id");
	const role = await getRole(id);
	return c.json(
		{
			value: [role],
		},
		200,
	);
});

app.patch("/:id", async (c) => {
	const id = c.req.param("id");
	const role = await updateRole(id, await c.req.json());
	return c.json(
		{
			value: [role],
		},
		200,
	);
});

app.delete("/:id", async (c) => {
	const id = c.req.param("id");
	const role = await deleteRole(id);
	return c.json(
		{
			value: [role],
		},
		200,
	);
});
