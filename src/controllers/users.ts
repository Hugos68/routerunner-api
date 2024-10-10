import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { UserSchema } from "../schemas/users.ts";
import type { Environment } from "../types/environment.ts";

const app = new OpenAPIHono<Environment>();

app.openapi(
	createRoute({
		method: "get",
		path: "/users",
		responses: {
			200: {
				content: {
					"application/json": {
						schema: z.object({
							data: z.array(UserSchema),
							error: z.null(),
							timestamp: z.date(),
						}),
					},
				},
				description: "Get all users",
			},
		},
	}),
	async (c) => {},
);

export default app;
