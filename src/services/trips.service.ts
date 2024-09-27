import { eq } from "drizzle-orm";
import { parse } from "valibot";
import { database } from "../database/database.js";
import {
	CreateTripSchema,
	type Trip,
	UpdateTripSchema,
	trips,
} from "../database/tables/trips.tables.js";
import { NotFoundError } from "../utility/errors.js";

export const createTrip = async (input: unknown) => {
	const values = parse(CreateTripSchema, input);
	const [result] = await database.insert(trips).values(values).returning();
	return result;
};

export const getTrips = async () => {
	const result = await database.select().from(trips);
	return result;
};

export const getTrip = async (id: Trip["id"]) => {
	const [result] = await database.select().from(trips).where(eq(trips.id, id));
	if (result === undefined) {
		throw new NotFoundError(`Trip with id ${id} not found`);
	}
	return result;
};

export const updateTrip = async (id: Trip["id"], input: unknown) => {
	const values = parse(UpdateTripSchema, input);
	const [result] = await database
		.update(trips)
		.set(values)
		.where(eq(trips.id, id))
		.returning();
	if (result === undefined) {
		throw new NotFoundError(`Trip with id ${id} not found`);
	}
	return result;
};

export const deleteTrip = async (id: Trip["id"]) => {
	const [result] = await database.delete(trips).where(eq(trips.id, id));
	if (result === undefined) {
		throw new NotFoundError(`Trip with id ${id} not found`);
	}
	return result;
};
