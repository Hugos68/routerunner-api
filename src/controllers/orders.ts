import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { validationHook } from "../handlers/validation-hook.ts";
import {
	CreateOrderSchema,
	OrderParamsSchema,
	OrderQuerySchema,
	OrderSchema,
	UpdateOrderSchema,
} from "../schemas/orders.ts";
import { createOkSchema } from "../schemas/responses.ts";
import {
	createOrder,
	deleteOrder,
	getOrder,
	getOrders,
	updateOrder,
} from "../services/orders.ts";
import type { Environment } from "../types/environment.ts";
import { createErrorResponses } from "../utility/create-error-responses.ts";
import { RouterunnerResponse } from "../utility/response.ts";

const app = new OpenAPIHono<Environment>({ defaultHook: validationHook });

app.openapi(
	createRoute({
		tags: ["orders"],
		method: "post",
		path: "/",
		request: {
			body: {
				required: true,
				content: {
					"application/json": {
						schema: CreateOrderSchema,
					},
				},
				description: "Order to create",
			},
		},
		responses: {
			201: {
				content: {
					"application/json": {
						schema: createOkSchema(OrderSchema),
					},
				},
				description: "Order created",
			},
			...createErrorResponses("Order"),
		},
	}),
	async (c) => {
		const actor = c.get("actor");
		const orderToCreate = c.req.valid("json");
		const order = await createOrder(actor, orderToCreate);
		return c.json(RouterunnerResponse.ok(order), 201);
	},
);

app.openapi(
	createRoute({
		tags: ["orders"],
		method: "get",
		path: "/",
		request: {
			query: OrderQuerySchema,
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: createOkSchema(OrderSchema.array()),
					},
				},
				description: "Order found",
			},
			...createErrorResponses("Order"),
		},
	}),
	async (c) => {
		const actor = c.get("actor");
		const query = c.req.valid("query");
		const order = await getOrders(actor, query);
		return c.json(RouterunnerResponse.ok(order));
	},
);

app.openapi(
	createRoute({
		tags: ["orders"],
		method: "get",
		path: "/:id",
		request: {
			params: OrderParamsSchema,
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: createOkSchema(OrderSchema),
					},
				},
				description: "Order found",
			},
			...createErrorResponses("Order"),
		},
	}),
	async (c) => {
		const actor = c.get("actor");
		const id = c.req.param("id");
		const order = await getOrder(actor, id);
		return c.json(RouterunnerResponse.ok(order));
	},
);

app.openapi(
	createRoute({
		tags: ["orders"],
		method: "patch",
		path: "/:id",
		request: {
			params: OrderParamsSchema,
			body: {
				required: true,
				content: {
					"application/json": {
						schema: UpdateOrderSchema,
					},
				},
				description: "Order to update",
			},
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: createOkSchema(OrderSchema),
					},
				},
				description: "Order updated",
			},
			...createErrorResponses("Order"),
		},
	}),
	async (c) => {
		const actor = c.get("actor");
		const orderToUpdate = c.req.valid("json");
		const id = c.req.param("id");
		const order = await updateOrder(actor, id, orderToUpdate);
		return c.json(RouterunnerResponse.ok(order));
	},
);

app.openapi(
	createRoute({
		tags: ["orders"],
		method: "delete",
		path: "/:id",
		request: {
			params: OrderParamsSchema,
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: createOkSchema(OrderSchema),
					},
				},
				description: "Order deleted",
			},
			...createErrorResponses("Order"),
		},
	}),
	async (c) => {
		const actor = c.get("actor");
		const id = c.req.param("id");
		const order = await deleteOrder(actor, id);
		return c.json(RouterunnerResponse.ok(order));
	},
);

export default app;
