import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { validationHook } from "../handlers/validation-hook.ts";
import {
	CreateRoleSchema,
	RoleParamsSchema,
	RoleQuerySchema,
	RoleSchema,
	UpdateRoleSchema,
} from "../schemas/roles.ts";
import {
	createRole,
	deleteRole,
	getRole,
	getRoles,
	updateRole,
} from "../services/roles.ts";
import type { Environment } from "../types/environment.ts";
import { createErrorResponses } from "../utility/create-error-responses.ts";
import { RouterunnerResponse, createOkSchema } from "../utility/response.ts";

const app = new OpenAPIHono<Environment>({ defaultHook: validationHook });

app.openapi(
	createRoute({
		tags: ["roles"],
		method: "post",
		path: "/",
		request: {
			body: {
				required: true,
				content: {
					"application/json": {
						schema: CreateRoleSchema,
					},
				},
				description: "Role to create",
			},
		},
		responses: {
			201: {
				content: {
					"application/json": {
						schema: createOkSchema(RoleSchema),
					},
				},
				description: "Role created",
			},
			...createErrorResponses("Role"),
		},
	}),
	async (c) => {
		const actor = c.get("actor");
		const roleToCreate = c.req.valid("json");
		const role = await createRole(actor, roleToCreate);
		return c.json(RouterunnerResponse.ok(role), 201);
	},
);

app.openapi(
	createRoute({
		tags: ["roles"],
		method: "get",
		path: "/",
		request: {
			query: RoleQuerySchema,
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: createOkSchema(RoleSchema),
					},
				},
				description: "Role found",
			},
			...createErrorResponses("Role"),
		},
	}),
	async (c) => {
		const actor = c.get("actor");
		const query = c.req.valid("query");
		const roles = await getRoles(actor, query);
		return c.json(RouterunnerResponse.ok(roles));
	},
);

app.openapi(
	createRoute({
		tags: ["roles"],
		method: "get",
		path: "/:id",
		request: {
			params: RoleParamsSchema,
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: createOkSchema(RoleSchema.array()),
					},
				},
				description: "Roles found",
			},
			...createErrorResponses("Role"),
		},
	}),
	async (c) => {
		const actor = c.get("actor");
		const role = await getRole(actor, c.req.param("id"));
		return c.json(RouterunnerResponse.ok(role));
	},
);

app.openapi(
	createRoute({
		tags: ["roles"],
		method: "patch",
		path: "/:id",
		request: {
			params: RoleParamsSchema,
			body: {
				required: true,
				content: {
					"application/json": {
						schema: UpdateRoleSchema,
					},
				},
				description: "Role to update",
			},
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: createOkSchema(RoleSchema),
					},
				},
				description: "Role updated",
			},
			...createErrorResponses("Role"),
		},
	}),
	async (c) => {
		const actor = c.get("actor");
		const roleToUpdate = c.req.valid("json");
		const role = await updateRole(actor, c.req.param("id"), roleToUpdate);
		return c.json(RouterunnerResponse.ok(role));
	},
);

app.openapi(
	createRoute({
		tags: ["roles"],
		method: "delete",
		path: "/:id",
		request: {
			params: RoleParamsSchema,
		},
		responses: {
			204: {
				description: "Role deleted",
			},
			...createErrorResponses("Role"),
		},
	}),
	async (c) => {
		const actor = c.get("actor");
		await deleteRole(actor, c.req.param("id"));
		return c.json(undefined, 204);
	},
);

export default app;
