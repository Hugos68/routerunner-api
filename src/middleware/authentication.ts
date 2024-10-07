import { eq } from "drizzle-orm";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { database } from "../database/database.js";
import { rolesTable } from "../database/schema.js";
import { sessionsTable } from "../database/schema.js";
import { userRolesTable } from "../database/schema.js";
import { usersTable } from "../database/schema.js";
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
			session: sessionsTable,
			user: usersTable,
			role: rolesTable,
		})
		.from(sessionsTable)
		.where(eq(sessionsTable.id, sessionId))
		.leftJoin(usersTable, eq(sessionsTable.userId, usersTable.id))
		.leftJoin(userRolesTable, eq(usersTable.id, userRolesTable.userId))
		.leftJoin(rolesTable, eq(userRolesTable.roleId, rolesTable.id));
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
