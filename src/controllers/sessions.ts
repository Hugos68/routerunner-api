import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import {
	CreateSessionSchema,
	SessionParamsSchema,
	SessionQuerySchema,
	SessionSchema,
} from "../schemas/sessions.ts";
import {
	createSession,
	deleteSession,
	getSession,
	getSessions,
} from "../services/sessions.ts";
import type { Environment } from "../types/environment.ts";
import { createErrorResponses } from "../utility/create-error-responses.ts";
import { RouterunnerResponse, createOkSchema } from "../utility/response.ts";

const app = new OpenAPIHono<Environment>();

app.openapi(
	createRoute({
		tags: ["sessions"],
		method: "post",
		path: "/",
		request: {
			body: {
				required: true,
				content: {
					"application/json": {
						schema: CreateSessionSchema,
					},
				},
				description: "Session to create",
			},
		},
		responses: {
			201: {
				content: {
					"application/json": {
						schema: createOkSchema(SessionSchema),
					},
				},
				description: "Session created",
			},
			...createErrorResponses("User"),
		},
	}),
	async (c) => {
		const actor = c.get("actor");
		const sessionToCreate = c.req.valid("json");
		const session = await createSession(actor, sessionToCreate);
		return c.json(RouterunnerResponse.ok(session), 201);
	},
);

app.openapi(
	createRoute({
		tags: ["sessions"],
		method: "get",
		path: "/",
		request: {
			query: SessionQuerySchema,
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: createOkSchema(SessionSchema.array()),
					},
				},
				description: "Sessions retrieved",
			},
			...createErrorResponses("User"),
		},
	}),
	async (c) => {
		const actor = c.get("actor");
		const query = c.req.valid("query");
		const sessions = await getSessions(actor, query);
		return c.json(RouterunnerResponse.ok(sessions), 200);
	},
);

app.openapi(
	createRoute({
		tags: ["sessions"],
		method: "get",
		path: "/:id",
		request: {
			params: SessionParamsSchema,
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: createOkSchema(SessionSchema),
					},
				},
				description: "Session retrieved",
			},
			...createErrorResponses("User"),
		},
	}),
	async (c) => {
		const actor = c.get("actor");
		const id = c.req.param("id");
		const session = await getSession(actor, id);
		return c.json(RouterunnerResponse.ok(session), 200);
	},
);

app.openapi(
	createRoute({
		tags: ["sessions"],
		method: "delete",
		path: "/:id",
		request: {
			params: SessionParamsSchema,
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: createOkSchema(SessionSchema),
					},
				},
				description: "Session deleted",
			},
			...createErrorResponses("User"),
		},
	}),
	async (c) => {
		const actor = c.get("actor");
		const id = c.req.param("id");
		const session = await deleteSession(actor, id);
		return c.json(RouterunnerResponse.ok(session), 200);
	},
);

export default app;
