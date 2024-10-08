import { and, eq } from "drizzle-orm";
import { parse } from "valibot";
import { database } from "../database/database.js";
import {
	CreateTripSchema,
	type Trip,
	UpdateTripSchema,
	tripsTable,
} from "../database/schema.js";
import { createFilterConditions } from "../utility/create-filter-conditions.js";
import { NotFoundError } from "../utility/errors.js";

export const createTrip = async (input: unknown) => {
	const values = parse(CreateTripSchema, input);
	const [trip] = await database.insert(tripsTable).values(values).returning();
	if (trip === undefined) {
		throw new Error("Failed to create trip");
	}
	return trip;
};

export const getTrips = async (filter: Record<string, unknown> = {}) => {
	const conditions = createFilterConditions(filter, tripsTable);
	const trips = await database
		.select()
		.from(tripsTable)
		.where(and(...conditions));
	return trips;
};

export const getTrip = async (id: Trip["id"]) => {
	const [trip] = await database
		.select()
		.from(tripsTable)
		.where(eq(tripsTable.id, id));
	if (trip === undefined) {
		throw new NotFoundError(`Trip with id ${id} not found`);
	}
	return trip;
};

export const updateTrip = async (id: Trip["id"], input: unknown) => {
	const values = parse(UpdateTripSchema, input);
	const [trip] = await database
		.update(tripsTable)
		.set(values)
		.where(eq(tripsTable.id, id))
		.returning();
	if (trip === undefined) {
		throw new NotFoundError(`Trip with id ${id} not found`);
	}
	return trip;
};

export const deleteTrip = async (id: Trip["id"]) => {
	const [trip] = await database
		.delete(tripsTable)
		.where(eq(tripsTable.id, id))
		.returning();
	if (trip === undefined) {
		throw new NotFoundError(`Trip with id ${id} not found`);
	}
	return trip;
};
