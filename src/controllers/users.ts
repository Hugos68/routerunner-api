import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { CreateUserSchema, UserSchema } from "../schemas/users.ts";
import { createUser, getUsers } from "../services/users.ts";
import type { Environment } from "../types/environment.ts";
import {
	ErrorSchema,
	RouterunnerResponse,
	createOkSchema,
} from "../utility/responses.ts";

const app = new OpenAPIHono<Environment>();

app.openapi(
	createRoute({
		method: "get",
		path: "/",
		responses: {
			200: {
				content: {
					"application/json": {
						schema: createOkSchema(UserSchema.array()),
					},
				},
				description: "OK",
			},
			401: {
				content: {
					"application/json": {
						schema: ErrorSchema,
					},
				},
				description: "Unauthorized",
			},
		},
	}),
	async (c) => {
		const users = await getUsers({ session: c.get("session") });
		return c.json(RouterunnerResponse.ok(users), 200);
	},
);

app.openapi(
	createRoute({
		method: "post",
		path: "/",
		request: {
			body: {
				required: true,
				content: {
					"application/json": {
						schema: CreateUserSchema,
					},
				},
				description: "Create user",
			},
		},
		responses: {
			201: {
				content: {
					"application/json": {
						schema: createOkSchema(UserSchema),
					},
				},
				description: "OK",
			},
			401: {
				content: {
					"application/json": {
						schema: ErrorSchema,
					},
				},
				description: "Unauthorized",
			},
			500: {
				content: {
					"application/json": {
						schema: ErrorSchema,
					},
				},
				description: "Internal Server Error",
			},
		},
	}),
	async (c) => {
		const user = c.req.valid("json");
		await createUser({ session: c.get("session") }, user);
		return c.json(RouterunnerResponse.ok(user), 201);
	},
);

export default app;
