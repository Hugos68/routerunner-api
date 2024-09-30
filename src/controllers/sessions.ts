import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import {
	create_session,
	delete_session,
	get_session,
	get_sessions,
} from "../services/sessions.js";
import {
	SESSION_COOKIE_CONIG,
	SESSION_COOKIE_KEY,
} from "../utility/constants.js";
import type { Environment } from "../utility/types.js";

export const sessions = new Hono<Environment>();

sessions.post("/", async (c) => {
	const session = await create_session(await c.req.json());
	setCookie(c, SESSION_COOKIE_KEY, session.id, SESSION_COOKIE_CONIG);
	return c.json(
		{
			data: [session],
		},
		201,
	);
});

sessions.get("/", async (c) => {
	const sessions = await get_sessions();
	return c.json(
		{
			data: sessions,
		},
		200,
	);
});

sessions.get("/:id", async (c) => {
	const id = c.req.param("id");
	const session = await get_session(id);
	return c.json(
		{
			data: [session],
		},
		200,
	);
});

sessions.delete("/:id", async (c) => {
	const id = c.req.param("id");
	const session = await delete_session(id);
	return c.json(
		{
			data: [session],
		},
		200,
	);
});
