import { Hono } from "hono";
import { createDog } from "../services/dogs.service.js";

const app = new Hono();

app.post("/", async (c) => {
	const result = await createDog(await c.req.json());

	if (result.isErr()) {
		return c.json(result, 400);
	}

	return c.json(result, 201);
});

export default app;
