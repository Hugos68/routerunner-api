import type { OpenAPIHonoOptions } from "@hono/zod-openapi";
import type { Environment } from "../types/environment.ts";
import { ValidationError } from "../utility/errors.ts";

export const validationHook: OpenAPIHonoOptions<Environment>["defaultHook"] = (
	result,
) => {
	if (!result.success) {
		throw new ValidationError(result);
	}
};
