import { Hono } from "hono";
import {
	createTrip,
	deleteTrip,
	getTrip,
	getTrips,
	updateTrip,
} from "../services/trips.service";
import type { Environment } from "../utility/types.js";

export const trips = new Hono<Environment>();

trips.post("/", async (c) => {
	const trip = await createTrip(await c.req.json());
	return c.json(
		{
			value: [trip],
		},
		201,
	);
});

trips.get("/", async (c) => {
	const trips = await getTrips();
	return c.json(
		{
			value: trips,
		},
		200,
	);
});

trips.get("/:id", async (c) => {
	const id = c.req.param("id");
	const trip = await getTrip(id);
	return c.json(
		{
			value: [trip],
		},
		200,
	);
});

trips.patch("/:id", async (c) => {
	const id = c.req.param("id");
	const trip = await updateTrip(id, await c.req.json());
	return c.json(
		{
			value: [trip],
		},
		200,
	);
});

trips.delete("/:id", async (c) => {
	const id = c.req.param("id");
	const trip = await deleteTrip(id);
	return c.json(
		{
			value: [trip],
		},
		200,
	);
});
