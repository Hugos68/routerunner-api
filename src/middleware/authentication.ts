import { eq } from "drizzle-orm";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { database } from "../database/database.js";
import { roles_table } from "../database/schema.js";
import { sessions_table } from "../database/schema.js";
import { user_roles_table } from "../database/schema.js";
import { users_table } from "../database/schema.js";
import { SESSION_COOKIE_KEY } from "../utility/constants.js";
import type { Environment } from "../utility/types.js";

export const authentication = createMiddleware<Environment>(async (c, next) => {
	c.set("session", {
		authenticated: false,
	});
	const session_id = getCookie(c, SESSION_COOKIE_KEY);
	if (session_id === undefined) {
		await next();
		return;
	}
	const [result] = await database
		.select({
			session: sessions_table,
			user: users_table,
			role: roles_table,
		})
		.from(sessions_table)
		.where(eq(sessions_table.id, session_id))
		.leftJoin(users_table, eq(sessions_table.userId, users_table.id))
		.leftJoin(user_roles_table, eq(users_table.id, user_roles_table.userId))
		.leftJoin(roles_table, eq(user_roles_table.roleId, roles_table.id));
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
