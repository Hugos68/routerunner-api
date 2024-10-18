import type { ErrorHandler } from "hono";
import { RouterunnerError, getStatusCode } from "../utility/errors.ts";
import { RouterunnerResponse } from "../utility/routerunner-response.ts";

export const onError: ErrorHandler = (err, c) => {
	if (err instanceof RouterunnerError) {
		return c.json(RouterunnerResponse.error(err), getStatusCode(err));
	}
	return c.json(
		RouterunnerResponse.error({
			message: "Internal server error",
			name: "An unknown error occurred",
		}),
		500,
	);
};
