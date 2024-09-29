import { Hono } from "hono";
import {
	create_trip,
	delete_trip,
	get_trip,
	get_trips,
	update_trip,
} from "../services/trips.js";
import type { Environment } from "../utility/types.js";

export const trips = new Hono<Environment>();

trips.post("/", async (c) => {
	const trip = await create_trip(await c.req.json());
	return c.json(
		{
			value: [trip],
		},
		201,
	);
});

trips.get("/", async (c) => {
	const trips = await get_trips();
	return c.json(
		{
			value: trips,
		},
		200,
	);
});

trips.get("/:id", async (c) => {
	const id = c.req.param("id");
	const trip = await get_trip(id);
	return c.json(
		{
			value: [trip],
		},
		200,
	);
});

trips.patch("/:id", async (c) => {
	const id = c.req.param("id");
	const trip = await update_trip(id, await c.req.json());
	return c.json(
		{
			value: [trip],
		},
		200,
	);
});

trips.delete("/:id", async (c) => {
	const id = c.req.param("id");
	const trip = await delete_trip(id);
	return c.json(
		{
			value: [trip],
		},
		200,
	);
});
