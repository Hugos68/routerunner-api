import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { validationHook } from "../handlers/validation-hook.ts";
import {
	CreateLineSchema,
	LineParamsSchema,
	LineQuerySchema,
	LineSchema,
	UpdateLineSchema,
} from "../schemas/lines.ts";
import { createOkSchema } from "../schemas/responses.ts";
import {
	createLine,
	deleteLine,
	getLine,
	getLines,
	updateLine,
} from "../services/lines.ts";
import type { Environment } from "../types/environment.ts";
import { createErrorResponses } from "../utility/create-error-responses.ts";
import { RouterunnerResponse } from "../utility/routerunner-response.ts";

const app = new OpenAPIHono<Environment>({ defaultHook: validationHook });

app.openapi(
	createRoute({
		tags: ["lines"],
		method: "post",
		path: "/",
		request: {
			body: {
				required: true,
				content: {
					"application/json": {
						schema: CreateLineSchema,
					},
				},
				description: "Line to create",
			},
		},
		responses: {
			201: {
				content: {
					"application/json": {
						schema: createOkSchema(LineSchema),
					},
				},
				description: "Line created",
			},
			...createErrorResponses("Line"),
		},
	}),
	async (c) => {
		const actor = c.get("actor");
		const lineToCreate = c.req.valid("json");
		const line = await createLine(actor, lineToCreate);
		return c.json(RouterunnerResponse.ok(line), 201);
	},
);

app.openapi(
	createRoute({
		tags: ["lines"],
		method: "get",
		path: "/",
		request: {
			query: LineQuerySchema,
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: createOkSchema(LineSchema.array()),
					},
				},
				description: "Lines found",
			},
			...createErrorResponses("Line"),
		},
	}),
	async (c) => {
		const actor = c.get("actor");
		const query = c.req.valid("query");
		const lines = await getLines(actor, query);
		return c.json(RouterunnerResponse.ok(lines));
	},
);

app.openapi(
	createRoute({
		tags: ["lines"],
		method: "get",
		path: "/:id",
		request: {
			params: LineParamsSchema,
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: createOkSchema(LineSchema),
					},
				},
				description: "Line found",
			},
			...createErrorResponses("Line"),
		},
	}),
	async (c) => {
		const actor = c.get("actor");
		const id = c.req.param("id");
		const line = await getLine(actor, id);
		return c.json(RouterunnerResponse.ok(line));
	},
);

app.openapi(
	createRoute({
		tags: ["lines"],
		method: "patch",
		path: "/:id",
		request: {
			params: LineParamsSchema,
			body: {
				required: true,
				content: {
					"application/json": {
						schema: UpdateLineSchema,
					},
				},
				description: "Line to update",
			},
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: createOkSchema(LineSchema),
					},
				},
				description: "Line updated",
			},
			...createErrorResponses("Line"),
		},
	}),
	async (c) => {
		const actor = c.get("actor");
		const id = c.req.param("id");
		const lineToUpdate = c.req.valid("json");
		const line = await updateLine(actor, id, lineToUpdate);
		return c.json(RouterunnerResponse.ok(line));
	},
);

app.openapi(
	createRoute({
		tags: ["lines"],
		method: "delete",
		path: "/:id",
		request: {
			params: LineParamsSchema,
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: createOkSchema(LineSchema),
					},
				},
				description: "Line deleted",
			},
			...createErrorResponses("Line"),
		},
	}),
	async (c) => {
		const actor = c.get("actor");
		const id = c.req.param("id");
		const line = await deleteLine(actor, id);
		return c.json(RouterunnerResponse.ok(line));
	},
);

export default app;
