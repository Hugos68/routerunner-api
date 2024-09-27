import { Hono } from "hono";
import { ValiError } from "valibot";
import users from "./controllers/dogs.controller.js";
import { NotFoundError } from "./utility/errors.js";

const app = new Hono().basePath("/api/v1");

app.onError((err, c) => {
	if (err instanceof ValiError) {
		return c.json(
			{
				error: {
					code: "Validation",
					message: err.message,
				},
			},
			400,
		);
	}
	if (err instanceof NotFoundError) {
		return c.json(
			{
				error: {
					code: "NotFound",
					message: err.message,
				},
			},
			404,
		);
	}
	if (err instanceof Error) {
		return c.json(
			{
				error: {
					code: "Unknown",
					message: err.message,
				},
			},
			400,
		);
	}
	return c.json({
		error: {
			code: "Unknown",
			message: "An unknown error occurred",
		},
	});
});

app.route("/users", users);

export default app;
