import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { validationHook } from "../handlers/validation-hook.ts";
import { createOkSchema } from "../schemas/responses.ts";
import {
	CreateRetourPackagingSchema,
	RetourPackagingParamsSchema,
	RetourPackagingQuerySchema,
	RetourPackagingSchema,
	UpdateRetourPackagingSchema,
} from "../schemas/retour-packagings.ts";
import {
	createRetourPackaging,
	deleteRetourPackaging,
	getRetourPackaging,
	getRetourPackagings,
	updateRetourPackaging,
} from "../services/retour-packagings.ts";
import type { Environment } from "../types/environment.ts";
import { createErrorResponses } from "../utility/create-error-responses.ts";
import { RouterunnerResponse } from "../utility/routerunner-response.ts";

const app = new OpenAPIHono<Environment>({ defaultHook: validationHook });

app.openapi(
	createRoute({
		tags: ["retour-packagings"],
		method: "post",
		path: "/",
		request: {
			body: {
				required: true,
				content: {
					"application/json": {
						schema: CreateRetourPackagingSchema,
					},
				},
				description: "RetourPackaging to create",
			},
		},
		responses: {
			201: {
				content: {
					"application/json": {
						schema: createOkSchema(RetourPackagingSchema),
					},
				},
				description: "RetourPackaging created",
			},
			...createErrorResponses("RetourPackaging"),
		},
	}),
	async (c) => {
		const actor = c.get("actor");
		const retourPackagingToCreate = c.req.valid("json");
		const retourPackaging = await createRetourPackaging(
			actor,
			retourPackagingToCreate,
		);
		return c.json(RouterunnerResponse.ok(retourPackaging), 201);
	},
);

app.openapi(
	createRoute({
		tags: ["retour-packagings"],
		method: "get",
		path: "/",
		request: {
			query: RetourPackagingQuerySchema,
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: createOkSchema(RetourPackagingSchema.array()),
					},
				},
				description: "Retourpackagings found",
			},
		},
	}),
	async (c) => {
		const actor = c.get("actor");
		const query = c.req.valid("query");
		const retourPackaging = await getRetourPackagings(actor, query);
		return c.json(RouterunnerResponse.ok(retourPackaging));
	},
);

app.openapi(
	createRoute({
		tags: ["retour-packagings"],
		method: "get",
		path: "/:id",
		request: {
			params: RetourPackagingParamsSchema,
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: createOkSchema(RetourPackagingSchema),
					},
				},
				description: "RetourPackaging found",
			},
		},
	}),
	async (c) => {
		const actor = c.get("actor");
		const id = c.req.param("id");
		const retourPackaging = await getRetourPackaging(actor, id);
		return c.json(RouterunnerResponse.ok(retourPackaging));
	},
);

app.openapi(
	createRoute({
		tags: ["retour-packagings"],
		method: "patch",
		path: "/:id",
		request: {
			params: RetourPackagingParamsSchema,
			body: {
				required: true,
				content: {
					"application/json": {
						schema: UpdateRetourPackagingSchema,
					},
				},
				description: "RetourPackaging to update",
			},
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: createOkSchema(RetourPackagingSchema),
					},
				},
				description: "RetourPackaging updated",
			},
		},
	}),
	async (c) => {
		const actor = c.get("actor");
		const id = c.req.param("id");
		const retourPackagingToUpdate = c.req.valid("json");
		const retourPackaging = await updateRetourPackaging(
			actor,
			id,
			retourPackagingToUpdate,
		);
		return c.json(RouterunnerResponse.ok(retourPackaging));
	},
);

app.openapi(
	createRoute({
		tags: ["retour-packagings"],
		method: "delete",
		path: "/:id",
		request: {
			params: RetourPackagingParamsSchema,
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: createOkSchema(RetourPackagingSchema),
					},
				},
				description: "RetourPackaging deleted",
			},
		},
	}),
	async (c) => {
		const actor = c.get("actor");
		const id = c.req.param("id");
		const retourPackaging = await deleteRetourPackaging(actor, id);
		return c.json(RouterunnerResponse.ok(retourPackaging));
	},
);

export default app;
