import { eq } from "drizzle-orm";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { database } from "../database/database.js";
import { rolesTable } from "../database/tables/roles.js";
import { sessionsTable } from "../database/tables/sessions.js";
import { usersTable } from "../database/tables/users.js";
import type { Environment } from "../types/environment.js";
import { SESSION_COOKIE_KEY, SESSION_LIFETIME } from "../utility/constants.js";

export const authentication = createMiddleware<Environment>(async (c, next) => {
	const sessionId = getCookie(c, SESSION_COOKIE_KEY);
	/**
	 * If no session ID is present, the user is not logged in.
	 */
	if (sessionId === undefined) {
		c.set("actor", null);
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
	/**
	 * If no session is found, the user is not logged in.
	 */
	if (result === undefined) {
		c.set("actor", null);
		await next();
		return;
	}
	const sessionExpired = result.session.expiresAt < new Date();
	/**
	 * If the session is expired, the user is logged out.
	 */
	if (sessionExpired) {
		await database.delete(sessionsTable).where(eq(sessionsTable.id, sessionId));
		c.set("actor", null);
		await next();
		return;
	}
	/**
	 * If the session is not expired, the user is logged in and the session `expiresAt` is updated.
	 */
	await database
		.update(sessionsTable)
		.set({ expiresAt: new Date(Date.now() + SESSION_LIFETIME) })
		.where(eq(sessionsTable.id, sessionId));
	c.set("actor", {
		...result.user,
		role: result.role,
	});
	await next();
});
