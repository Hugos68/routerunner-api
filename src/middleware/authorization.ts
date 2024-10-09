import { createMiddleware } from "hono/factory";
import type { Role } from "../database/schema.ts";
import { NotFoundError, UnauthorizedError } from "../utility/errors.ts";

export const authorization = (...roles: Role["name"][]) => {
	return createMiddleware(async (c, next) => {
		const session = c.get("session");
		if (session === null || !roles.includes(session.user.role.name)) {
			if (c.req.method === "GET") {
				throw new NotFoundError();
			}
			throw new UnauthorizedError();
		}
		await next();
	});
};
