import type { ErrorHandler } from "hono";
import type { StatusCode } from "hono/utils/http-status";
import { ValiError } from "valibot";
import {
	InvalidFilterError,
	NotFoundError,
	UnauthorizedError,
} from "../utility/errors.ts";

const errorStatusCodeMap = new Map<unknown, StatusCode>([
	[ValiError, 400],
	[InvalidFilterError, 400],
	[UnauthorizedError, 401],
	[NotFoundError, 404],
	[Error, 500],
]);

export const onError: ErrorHandler = (err, c) => {
	if (err instanceof Error) {
		const statusCode = errorStatusCodeMap.get(err) || 500;
		return c.json(
			{
				error: {
					name: err.name,
					message: err.message,
				},
			},
			statusCode,
		);
	}
	return c.json(
		{
			error: {
				code: "Unknown",
				message: "An unknown error occurred",
			},
		},
		500,
	);
};
