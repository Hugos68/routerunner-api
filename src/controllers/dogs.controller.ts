import { Hono } from "hono";
import { createUser } from "../services/users.service";

const app = new Hono();

app.post("/", async (c) => {
	const user = await createUser(await c.req.json());
	return c.json(user, 201);
});

export default app;
