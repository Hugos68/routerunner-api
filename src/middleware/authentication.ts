import { eq } from "drizzle-orm";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { database } from "../database/database.js";
import { roles } from "../database/models/roles.model.js";
import { sessions } from "../database/models/sessions.model.js";
import { userRoles } from "../database/models/user_roles.model.js";
import { users } from "../database/models/users.model.js";
import { SESSION_COOKIE_KEY } from "../utility/constants.js";
import type { Environment } from "../utility/types.js";

export const authentication = createMiddleware<Environment>(async (c, next) => {
	c.set("session", {
		authenticated: false,
	});
	const sessionId = getCookie(c, SESSION_COOKIE_KEY);
	if (sessionId === undefined) {
		await next();
		return;
	}
	const [result] = await database
		.select({
			session: sessions,
			user: users,
			role: roles,
		})
		.from(sessions)
		.where(eq(sessions.id, sessionId))
		.leftJoin(users, eq(sessions.userId, users.id))
		.leftJoin(userRoles, eq(users.id, userRoles.userId))
		.leftJoin(roles, eq(userRoles.roleId, roles.id));
	if (
		result === undefined ||
		result.session === null ||
		result.user === null ||
		result.role === null
	) {
		await next();
		return;
	}
	c.set("session", {
		authenticated: true,
		user: {
			...result.user,
			role: result.role,
		},
	});
	await next();
});
