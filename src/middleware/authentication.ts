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
	const [session] = await database
		.select()
		.from(sessions)
		.where(eq(sessions.id, sessionId));
	const [user] = await database
		.select()
		.from(users)
		.where(eq(users.id, session.userId));
	const [userRole] = await database
		.select()
		.from(userRoles)
		.where(eq(userRoles.userId, user.id));
	const [role] = await database
		.select()
		.from(roles)
		.where(eq(roles.id, userRole.roleId));
	if (
		session === undefined ||
		user === undefined ||
		userRole === undefined ||
		role === undefined
	) {
		await next();
		return;
	}
	c.set("session", {
		authenticated: true,
		user: {
			...user,
			role: role,
		},
	});
	await next();
});
