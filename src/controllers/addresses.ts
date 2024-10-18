import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { validationHook } from "../handlers/validation-hook.ts";
import {
	AddressParamsSchema,
	AddressQuerySchema,
	AddressSchema,
	CreateAddressSchema,
	UpdateAddressSchema,
} from "../schemas/addresses.ts";
import { createOkSchema } from "../schemas/responses.ts";
import {
	createAddress,
	deleteAddress,
	getAddress,
	getAddresses,
	updateAddress,
} from "../services/addresses.ts";
import type { Environment } from "../types/environment.ts";
import { createErrorResponses } from "../utility/create-error-responses.ts";
import { RouterunnerResponse } from "../utility/routerunner-response.ts";

const app = new OpenAPIHono<Environment>({ defaultHook: validationHook });

app.openapi(
	createRoute({
		tags: ["addresses"],
		method: "post",
		path: "/",
		request: {
			body: {
				required: true,
				content: {
					"application/json": {
						schema: CreateAddressSchema,
					},
				},
				description: "Address to create",
			},
		},
		responses: {
			201: {
				content: {
					"application/json": {
						schema: createOkSchema(AddressSchema),
					},
				},
				description: "Address created",
			},
			...createErrorResponses("Address"),
		},
	}),
	async (c) => {
		const actor = c.get("actor");
		const addressToCreate = c.req.valid("json");
		const address = await createAddress(actor, addressToCreate);
		return c.json(RouterunnerResponse.ok(address), 201);
	},
);

app.openapi(
	createRoute({
		tags: ["addresses"],
		method: "get",
		path: "/",
		request: {
			query: AddressQuerySchema,
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: createOkSchema(AddressSchema.array()),
					},
				},
				description: "Addresses found",
			},
			...createErrorResponses("Address"),
		},
	}),
	async (c) => {
		const actor = c.get("actor");
		const query = c.req.valid("query");
		const address = await getAddresses(actor, query);
		return c.json(RouterunnerResponse.ok(address));
	},
);

app.openapi(
	createRoute({
		tags: ["addresses"],
		method: "get",
		path: "/:id",
		request: {
			params: AddressParamsSchema,
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: createOkSchema(AddressSchema),
					},
				},
				description: "Address found",
			},
			...createErrorResponses("Address"),
		},
	}),
	async (c) => {
		const actor = c.get("actor");
		const id = c.req.param("id");
		const address = await getAddress(actor, id);
		return c.json(RouterunnerResponse.ok(address));
	},
);

app.openapi(
	createRoute({
		tags: ["addresses"],
		method: "patch",
		path: "/:id",
		request: {
			params: AddressParamsSchema,
			body: {
				required: true,
				content: {
					"application/json": {
						schema: UpdateAddressSchema,
					},
				},
				description: "Address to update",
			},
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: createOkSchema(AddressSchema),
					},
				},
				description: "Address updated",
			},
			...createErrorResponses("Address"),
		},
	}),
	async (c) => {
		const actor = c.get("actor");
		const id = c.req.param("id");
		const addressToUpdate = c.req.valid("json");
		const address = await updateAddress(actor, id, addressToUpdate);
		return c.json(RouterunnerResponse.ok(address));
	},
);

app.openapi(
	createRoute({
		tags: ["addresses"],
		method: "delete",
		path: "/:id",
		request: {
			params: AddressParamsSchema,
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: createOkSchema(AddressSchema),
					},
				},
				description: "Address deleted",
			},
			...createErrorResponses("Address"),
		},
	}),
	async (c) => {
		const actor = c.get("actor");
		const id = c.req.param("id");
		const address = await deleteAddress(actor, id);
		return c.json(RouterunnerResponse.ok(address));
	},
);

export default app;
