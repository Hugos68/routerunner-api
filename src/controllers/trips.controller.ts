import { Hono } from "hono";
import {
	createTrip,
	deleteTrip,
	getTrip,
	getTrips,
	updateTrip,
} from "../services/trips.service";
const app = new Hono();

app.post("/", async (c) => {
	const trip = await createTrip(await c.req.json());
	return c.json(
		{
			value: [trip],
		},
		201,
	);
});

app.get("/", async (c) => {
	const trips = await getTrips();
	return c.json(
		{
			value: trips,
		},
		200,
	);
});

app.get("/:id", async (c) => {
	const id = c.req.param("id");
	const trip = await getTrip(id);
	return c.json(
		{
			value: [trip],
		},
		200,
	);
});

app.patch("/:id", async (c) => {
	const id = c.req.param("id");
	const trip = await updateTrip(id, await c.req.json());
	return c.json(
		{
			value: [trip],
		},
		200,
	);
});

app.delete("/:id", async (c) => {
	const id = c.req.param("id");
	const trip = await deleteTrip(id);
	return c.json(
		{
			value: [trip],
		},
		200,
	);
});
