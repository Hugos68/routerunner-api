import { Hono } from "hono";
import { authorization } from "../middleware/authorization.js";
import {
	createTrip,
	deleteTrip,
	getTrip,
	getTrips,
	updateTrip,
} from "../services/trips.js";
import { RouterunnerResponse } from "../utility/responses.js";
import type { Environment } from "../utility/types.js";

export const trips = new Hono<Environment>();

trips.post("/", authorization("DRIVER", "PLANNER", "ADMIN"), async (c) => {
	const trip = await createTrip(await c.req.json());
	return c.json(RouterunnerResponse.data(trip), 201);
});

trips.get("/", authorization("DRIVER", "PLANNER", "ADMIN"), async (c) => {
	const trips = await getTrips(c.req.query());
	return c.json(RouterunnerResponse.data(trips), 200);
});

trips.get("/:id", authorization("DRIVER", "PLANNER", "ADMIN"), async (c) => {
	const id = c.req.param("id");
	const trip = await getTrip(id);
	return c.json(RouterunnerResponse.data(trip), 200);
});

trips.patch("/:id", authorization("DRIVER", "PLANNER", "ADMIN"), async (c) => {
	const id = c.req.param("id");
	const trip = await updateTrip(id, await c.req.json());
	return c.json(RouterunnerResponse.data(trip), 200);
});

trips.delete("/:id", authorization("DRIVER", "PLANNER", "ADMIN"), async (c) => {
	const id = c.req.param("id");
	const trip = await deleteTrip(id);
	return c.json(RouterunnerResponse.data(trip), 200);
});
