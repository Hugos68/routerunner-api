import type { ErrorHandler } from "hono";
import { ValiError } from "valibot";
import { NotFoundError } from "../utility/errors.js";

export const on_error: ErrorHandler = (err, c) => {
	if (err instanceof ValiError) {
		return c.json(
			{
				error: {
					code: err.name,
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
					code: err.name,
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
					code: err.name,
					message: err.message,
				},
			},
			500,
		);
	}
	return c.json({
		error: {
			code: "Unknown",
			message: "An unknown error occurred",
		},
	});
};
