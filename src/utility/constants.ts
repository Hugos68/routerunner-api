import type { CookieOptions } from "hono/utils/cookie";

export const HASH_CONFIG = {
	algorithm: "argon2id",
	memoryCost: 19_456,
	timeCost: 2,
} satisfies Parameters<typeof Bun.password.hash>[1];

export const SESSION_COOKIE_KEY = "session_id";

export const SESSION_COOKIE_CONIG = {
	sameSite: "strict",
	secure: true,
	httpOnly: true,
} satisfies CookieOptions;

export const SESSION_LIFETIME = 30 * 24 * 60 * 60 * 1000;
