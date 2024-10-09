import { eq } from "drizzle-orm";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { database } from "../database/database.js";
import { rolesTable, sessionsTable, usersTable } from "../database/schema.js";
import { SESSION_COOKIE_KEY, SESSION_LIFETIME } from "../utility/constants.js";
import type { Environment } from "../utility/types.js";

export const authentication = createMiddleware<Environment>(async (c, next) => {
	const sessionId = getCookie(c, SESSION_COOKIE_KEY);
	if (sessionId === undefined) {
		c.set("session", null);
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
		.innerJoin(usersTable, eq(usersTable.id, sessionsTable.userId))
		.innerJoin(rolesTable, eq(rolesTable.id, usersTable.roleId));

	if (result === undefined) {
		c.set("session", null);
		await next();
		return;
	}
	const expired = result.session.expiresAt < new Date();
	if (expired) {
		await database.delete(sessionsTable).where(eq(sessionsTable.id, sessionId));
		c.set("session", null);
		await next();
		return;
	}
	await database
		.update(sessionsTable)
		.set({ expiresAt: new Date(Date.now() + SESSION_LIFETIME) })
		.where(eq(sessionsTable.id, sessionId));
	c.set("session", {
		user: {
			...result.user,
			role: result.role,
		},
	});
	await next();
});
