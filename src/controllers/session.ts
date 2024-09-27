import { Hono } from "hono";
import { pick } from "valibot";
import { CreateUserSchema } from "../database/tables/user";
import { createRequestValidator } from "../helpers/request-validator";
import {
	createSession,
	deleteSession,
	getSession,
	getSessions,
} from "../services/session";

const app = new Hono();

app.get("/", async (c) => {
	const sessions = await getSessions();
	return c.json(sessions, 200);
});

app.get("/:id", async (c) => {
	const id = c.req.param("id");
	const session = await getSession(id);
	return c.json(session, 200);
});

app.post(
	"/",
	createRequestValidator(pick(CreateUserSchema, ["email", "password"])),
	async (c) => {
		const credentials = c.req.valid("json");
		const session = await createSession(credentials);
		return c.json(session);
	},
);

app.delete("/:id", (c) => {
	const id = c.req.param("id");
	const result = deleteSession(id);
	return c.json(result, 200);
});

export default app;
