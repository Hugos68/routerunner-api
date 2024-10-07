import type { NotFoundHandler } from "hono";

export const notFound: NotFoundHandler = (c) => {
	return c.json(
		{
			error: {
				code: "NotFoundError",
				message: "Resource not found",
			},
		},
		404,
	);
};
