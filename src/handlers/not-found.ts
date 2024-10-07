import type { NotFoundHandler } from "hono";
import { NotFoundError } from "../utility/errors.js";

export const notFound: NotFoundHandler = (c) => {
	throw new NotFoundError(
		`Resource "${new URL(c.req.url).pathname}" not found`,
	);
};
