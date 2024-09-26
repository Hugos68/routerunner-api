import { Hono } from "hono";
import { InsertUserSchema } from "../database/tables/user.js";
import { createRequestValidator } from "../helpers/request-validator.js";
import { createUser } from "../services/user.js";

const app = new Hono();

app.post("/", createRequestValidator(InsertUserSchema), async (c) => {
	const user = await createUser(c.req.valid("json"));
	return c.json(user);
});

export default app;
