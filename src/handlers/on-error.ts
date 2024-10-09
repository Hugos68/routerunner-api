import type { ErrorHandler } from "hono";
import type { StatusCode } from "hono/utils/http-status";
import { ValiError } from "valibot";
import {
	InvalidFilterError,
	NotFoundError,
	UnauthorizedError,
} from "../utility/errors.ts";
import { RouterunnerResponse } from "../utility/responses.ts";

const errorStatusCodeMap = new Map<unknown, StatusCode>([
	[ValiError, 400],
	[InvalidFilterError, 400],
	[UnauthorizedError, 401],
	[NotFoundError, 404],
	[Error, 500],
]);

export const onError: ErrorHandler = (err, c) => {
	const error =
		err instanceof Error
			? err
			: { name: "Unknown", message: "An unknown error occurred" };
	const statusCode = errorStatusCodeMap.get(err) || 500;
	return c.json(RouterunnerResponse.error(error), statusCode);
};
