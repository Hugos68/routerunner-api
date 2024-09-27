import { eq } from "drizzle-orm";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { database } from "../database/database.js";
import { sessions } from "../database/models/sessions.model.js";
import { users } from "../database/models/users.model.js";
import { SESSION_COOKIE_KEY } from "../utility/constants.js";
import type { Environment } from "../utility/types.js";

export const authentication = createMiddleware<Environment>(async (c, next) => {
	c.set("session", {
		authenticated: false,
	});
	const sessionId = getCookie(c, SESSION_COOKIE_KEY);
	if (sessionId === undefined) {
		return;
	}
	const [session] = await database
		.select({ user: users })
		.from(sessions)
		.where(eq(sessions.id, sessionId))
		.innerJoin(users, eq(users.id, sessions.userId));
	if (session === undefined || session.user === null) {
		return;
	}
	c.set("session", {
		authenticated: true,
		user: session.user,
	});
	await next();
});
