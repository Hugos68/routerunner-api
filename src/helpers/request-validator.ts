import { vValidator } from "@hono/valibot-validator";
import { type BaseSchema, flatten } from "valibot";

/**
 * TODO: Change back to GenericSchema when drizzle-valibot supports latest valibot version
 * @see: https://github.com/drizzle-team/drizzle-orm/issues/2521
 */

export function createRequestValidator<T>(schema: BaseSchema<T>) {
	return vValidator("json", schema, (result, c) => {
		if (!result.success) {
			return c.json(
				{
					error: flatten(result.issues),
				},
				400,
			);
		}
	});
}
