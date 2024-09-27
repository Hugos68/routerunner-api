import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import type { CookieOptions } from "hono/utils/cookie";
import {
	createSession,
	deleteSession,
	getSession,
	getSessions,
} from "../services/sessions.service";

const SESSION_COOKIE_KEY = "session_id";

const SESSION_COOKIE_CONIG = {
	sameSite: "strict",
	secure: true,
	httpOnly: true,
} satisfies CookieOptions;

export const sessions = new Hono();

sessions.post("/", async (c) => {
	const session = await createSession(await c.req.json());
	setCookie(c, SESSION_COOKIE_KEY, session.id, SESSION_COOKIE_CONIG);
	return c.json(
		{
			value: [session],
		},
		201,
	);
});

sessions.get("/", async (c) => {
	const sessions = await getSessions();
	return c.json(
		{
			value: sessions,
		},
		200,
	);
});

sessions.get("/:id", async (c) => {
	const id = c.req.param("id");
	const session = await getSession(id);
	return c.json(
		{
			value: [session],
		},
		200,
	);
});

sessions.delete("/:id", async (c) => {
	const id = c.req.param("id");
	const session = await deleteSession(id);
	return c.json(
		{
			value: [session],
		},
		200,
	);
});
