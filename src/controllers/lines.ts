import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import {
	CreateLineSchema,
	LineParamsSchema,
	LineQuerySchema,
	LineSchema,
} from "../schemas/lines.ts";
import {
	createLine,
	deleteLine,
	getLine,
	getLines,
	updateLine,
} from "../services/lines.ts";
import type { Environment } from "../types/environment.ts";
import { createErrorResponses } from "../utility/create-error-responses.ts";
import { RouterunnerResponse, createOkSchema } from "../utility/response.ts";

const app = new OpenAPIHono<Environment>();

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
						schema: createOkSchema(LineSchema),
					},
				},
				description: "Line found",
			},
			...createErrorResponses("Line"),
		},
	}),
	async (c) => {
		const lines = await getLines(c.get("actor"));
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
		const line = await getLine(c.get("actor"), c.req.param("id"));
		return c.json(RouterunnerResponse.ok(line));
	},
);

app.openapi(
	createRoute({
		tags: ["lines"],
		method: "put",
		path: "/:id",
		request: {
			params: LineParamsSchema,
			body: {
				required: true,
				content: {
					"application/json": {
						schema: CreateLineSchema,
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
		const lineToUpdate = c.req.valid("json");
		const line = await updateLine(actor, c.req.param("id"), lineToUpdate);
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
		const line = await deleteLine(actor, c.req.param("id"));
		return c.json(RouterunnerResponse.ok(line));
	},
);

export default app;
