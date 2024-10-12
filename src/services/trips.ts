import { eq } from "drizzle-orm";
import { database } from "../database/database.ts";
import { tripsTable } from "../database/tables/trips.ts";
import type { Actor } from "../types/actor.ts";
import type { Trip, TripToCreate, TripToUpdate } from "../types/trip.ts";
import { authorize } from "../utility/authorize.ts";
import { ResourceNotFoundError, UnauthorizedError } from "../utility/errors.ts";

export const createTrip = async (actor: Actor, tripToCreate: TripToCreate) => {
	authorize(actor)
		.hasRole("PLANNER", "ADMIN")
		.orElseThrow(new UnauthorizedError());
	const [trip] = await database
		.insert(tripsTable)
		.values(tripToCreate)
		.returning();
	if (trip === undefined) {
		throw new Error("Failed to create trip");
	}
	return trip;
};

export const getTrips = async (actor: Actor) => {
	authorize(actor)
		.hasRole("DRIVER", "PLANNER", "ADMIN")
		.orElseThrow(new UnauthorizedError());
	const trips = await database.select().from(tripsTable);
	return trips;
};

export const getTrip = async (actor: Actor, id: Trip["id"]) => {
	authorize(actor)
		.hasRole("DRIVER", "PLANNER", "ADMIN")
		.orElseThrow(new ResourceNotFoundError());
	const [trip] = await database
		.select()
		.from(tripsTable)
		.where(eq(tripsTable.id, id));
	if (trip === undefined) {
		throw new ResourceNotFoundError();
	}
	return trip;
};

export const updateTrip = async (
	actor: Actor,
	id: Trip["id"],
	tripToUpdate: TripToUpdate,
) => {
	authorize(actor)
		.hasRole("ADMIN", "PLANNER")
		.orElseThrow(new ResourceNotFoundError());
	const [trip] = await database
		.update(tripsTable)
		.set(tripToUpdate)
		.where(eq(tripsTable.id, id))
		.returning();
	if (trip === undefined) {
		throw new Error("Failed to update trip");
	}
	return trip;
};

export const deleteTrip = async (actor: Actor, id: Trip["id"]) => {
	authorize(actor)
		.hasRole("ADMIN", "PLANNER")
		.orElseThrow(new ResourceNotFoundError());
	const [trip] = await database
		.delete(tripsTable)
		.where(eq(tripsTable.id, id))
		.returning();
	if (trip === undefined) {
		throw new Error("Failed to delete trip");
	}
	return trip;
};
