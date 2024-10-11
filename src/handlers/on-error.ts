import type { ErrorHandler } from "hono";
import { RouterunnerError, getStatusCode } from "../utility/errors.ts";
import { RouterunnerResponse } from "../utility/response.ts";

export const onError: ErrorHandler = (err, c) => {
	if (err instanceof RouterunnerError) {
		return c.json(RouterunnerResponse.error(err), getStatusCode(err));
	}
	return c.json(
		RouterunnerResponse.error({
			message: err.message,
			name: err.name,
		}),
		500,
	);
};