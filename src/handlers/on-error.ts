import type { ErrorHandler } from "hono";
import { ValiError } from "valibot";
import {
	BadCredentialsError,
	InvalidFilterError,
	NotFoundError,
} from "../utility/errors.js";

export const onError: ErrorHandler = (err, c) => {
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
	if (err instanceof BadCredentialsError) {
		return c.json(
			{
				error: {
					code: err.name,
					message: err.message,
				},
			},
			401,
		);
	}
	if (err instanceof InvalidFilterError) {
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
