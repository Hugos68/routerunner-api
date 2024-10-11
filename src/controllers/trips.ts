import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { validationHook } from "../handlers/validation-hook.ts";
import {
	CreateTripSchema,
	TripParamsSchema,
	TripQuerySchema,
	TripSchema,
	UpdateTripSchema,
} from "../schemas/trips.ts";
import {
	createTrip,
	deleteTrip,
	getTrip,
	getTrips,
	updateTrip,
} from "../services/trips.ts";
import type { Environment } from "../types/environment.ts";
import { createErrorResponses } from "../utility/create-error-responses.ts";
import { RouterunnerResponse, createOkSchema } from "../utility/response.ts";

const app = new OpenAPIHono<Environment>({ defaultHook: validationHook });

app.openapi(
	createRoute({
		tags: ["trips"],
		method: "post",
		path: "/",
		request: {
			body: {
				required: true,
				content: {
					"application/json": {
						schema: CreateTripSchema,
					},
				},
				description: "Trip to create",
			},
		},
		responses: {
			201: {
				content: {
					"application/json": {
						schema: createOkSchema(TripSchema),
					},
				},
				description: "Trip created",
			},
			...createErrorResponses("Trip"),
		},
	}),
	async (c) => {
		const actor = c.get("actor");
		const tripToCreate = c.req.valid("json");
		const trip = await createTrip(actor, tripToCreate);
		return c.json(RouterunnerResponse.ok(trip), 201);
	},
);

app.openapi(
	createRoute({
		tags: ["trips"],
		method: "get",
		path: "/",
		request: {
			query: TripQuerySchema,
		},

		responses: {
			200: {
				content: {
					"application/json": {
						schema: createOkSchema(TripSchema.array()),
					},
				},
				description: "Trips found",
			},
			...createErrorResponses("Trip"),
		},
	}),
	async (c) => {
		const actor = c.get("actor");
		const trips = await getTrips(actor);
		return c.json(RouterunnerResponse.ok(trips));
	},
);

app.openapi(
	createRoute({
		tags: ["trips"],
		method: "get",
		path: "/:id",
		request: {
			params: TripParamsSchema,
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: createOkSchema(TripSchema),
					},
				},
				description: "Trip found",
			},
			...createErrorResponses("Trip"),
		},
	}),
	async (c) => {
		const actor = c.get("actor");
		const id = c.req.param("id");
		const trip = await getTrip(actor, id);
		return c.json(RouterunnerResponse.ok(trip));
	},
);

app.openapi(
	createRoute({
		tags: ["trips"],
		method: "patch",
		path: "/:id",
		request: {
			params: TripParamsSchema,
			body: {
				required: true,
				content: {
					"application/json": {
						schema: UpdateTripSchema,
					},
				},
				description: "Trip to update",
			},
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: createOkSchema(TripSchema),
					},
				},
				description: "Trip updated",
			},
			...createErrorResponses("Trip"),
		},
	}),
	async (c) => {
		const actor = c.get("actor");
		const id = c.req.param("id");
		const tripToUpdate = c.req.valid("json");
		const trip = await updateTrip(actor, id, tripToUpdate);
		return c.json(RouterunnerResponse.ok(trip));
	},
);

app.openapi(
	createRoute({
		tags: ["trips"],
		method: "delete",
		path: "/:id",
		request: {
			params: TripParamsSchema,
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: createOkSchema(TripSchema),
					},
				},
				description: "Trip deleted",
			},
			...createErrorResponses("Trip"),
		},
	}),
	async (c) => {
		const actor = c.get("actor");
		const id = c.req.param("id");
		const trip = await deleteTrip(actor, id);
		return c.json(RouterunnerResponse.ok(trip));
	},
);
export default app;
