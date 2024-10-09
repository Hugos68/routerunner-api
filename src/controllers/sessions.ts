import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import { authorization } from "../middleware/authorization.js";
import {
	createSession,
	deleteSession,
	getSession,
	getSessions,
} from "../services/sessions.js";
import {
	SESSION_COOKIE_CONIG,
	SESSION_COOKIE_KEY,
} from "../utility/constants.js";
import type { Environment } from "../utility/types.js";

export const sessions = new Hono<Environment>();

sessions.post("/", async (c) => {
	const session = await createSession(await c.req.json());
	setCookie(c, SESSION_COOKIE_KEY, session.id, {
		...SESSION_COOKIE_CONIG,
		expires: session.expiresAt,
	});
	return c.json(
		{
			data: session,
		},
		201,
	);
});

sessions.get("/", authorization("ADMIN"), async (c) => {
	const sessions = await getSessions(c.req.query());
	return c.json(
		{
			data: sessions,
		},
		200,
	);
});

sessions.get("/:id", authorization("DRIVER", "PLANNER", "ADMIN"), async (c) => {
	const id = c.req.param("id");
	const session = await getSession(id);
	return c.json(
		{
			data: session,
		},
		200,
	);
});

sessions.delete(
	"/:id",
	authorization("DRIVER", "PLANNER", "ADMIN"),
	async (c) => {
		const id = c.req.param("id");
		const session = await deleteSession(id);
		return c.json(
			{
				data: session,
			},
			200,
		);
	},
);
