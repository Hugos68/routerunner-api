import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import {
	CreateUserSchema,
	UpdateUserSchema,
	UserParamsSchema,
	UserSchema,
} from "../schemas/users.ts";
import {
	createUser,
	deleteUser,
	getUser,
	getUsers,
	updateUser,
} from "../services/users.ts";
import type { Environment } from "../types/environment.ts";
import { createResponses } from "../utility/create-responses.ts";
import { RouterunnerResponse, createOkSchema } from "../utility/response.ts";

const app = new OpenAPIHono<Environment>();

app.openapi(
	createRoute({
		tags: ["users"],
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
				description: "User to create",
			},
		},
		responses: {
			201: {
				content: {
					"application/json": {
						schema: createOkSchema(UserSchema),
					},
				},
				description: "User created",
			},
			...createResponses("User"),
		},
	}),
	async (c) => {
		const actor = c.get("actor");
		const userToCreate = c.req.valid("json");
		const user = await createUser(actor, userToCreate);
		return c.json(RouterunnerResponse.ok(user), 201);
	},
);

app.openapi(
	createRoute({
		tags: ["users"],
		method: "get",
		path: "/",
		responses: {
			200: {
				content: {
					"application/json": {
						schema: createOkSchema(UserSchema.array()),
					},
				},
				description: "Users retrieved",
			},
			...createResponses("User"),
		},
	}),
	async (c) => {
		const actor = c.get("actor");
		const users = await getUsers(actor);
		return c.json(RouterunnerResponse.ok(users), 200);
	},
);

app.openapi(
	createRoute({
		tags: ["users"],
		method: "get",
		path: "/:id",
		request: {
			params: UserParamsSchema,
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: createOkSchema(UserSchema),
					},
				},
				description: "User retrieved",
			},
			...createResponses("User"),
		},
	}),
	async (c) => {
		const actor = c.get("actor");
		const id = c.req.param("id");
		const user = await getUser(actor, id);
		return c.json(RouterunnerResponse.ok(user), 200);
	},
);

app.openapi(
	createRoute({
		tags: ["users"],
		method: "patch",
		path: "/:id",
		request: {
			params: UserParamsSchema,
			body: {
				required: true,
				content: {
					"application/json": {
						schema: UpdateUserSchema,
					},
				},
				description: "User to update",
			},
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: createOkSchema(UserSchema),
					},
				},
				description: "User updated",
			},
			...createResponses("User"),
		},
	}),
	async (c) => {
		const actor = c.get("actor");
		const id = c.req.param("id");
		const userToUpdate = c.req.valid("json");
		const user = await updateUser(actor, id, userToUpdate);
		return c.json(RouterunnerResponse.ok(user), 200);
	},
);

app.openapi(
	createRoute({
		tags: ["users"],
		method: "delete",
		path: "/:id",
		request: {
			params: UserParamsSchema,
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: createOkSchema(UserSchema),
					},
				},
				description: "User deleted",
			},
			...createResponses("User"),
		},
	}),
	async (c) => {
		const actor = c.get("actor");
		const id = c.req.param("id");
		const user = await deleteUser(actor, id);
		return c.json(RouterunnerResponse.ok(user), 200);
	},
);

export default app;
