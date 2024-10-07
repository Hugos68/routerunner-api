import { and, eq } from "drizzle-orm";
import { parse, partial } from "valibot";
import { database } from "../database/database.js";
import {
	CreateTripSchema,
	type Trip,
	UpdateTripSchema,
	trips_table,
} from "../database/schema.js";
import { create_filter_conditions } from "../utility/create-filter-conditions.js";
import { NotFoundError } from "../utility/errors.js";

export const create_trip = async (input: unknown) => {
	const values = parse(CreateTripSchema, input);
	const [trip] = await database.insert(trips_table).values(values).returning();
	if (trip === undefined) {
		throw new Error("Failed to create trip");
	}
	return trip;
};

export const get_trips = async (filter: Record<string, unknown> = {}) => {
	const conditions = create_filter_conditions(
		filter,
		partial(CreateTripSchema),
		trips_table,
	);
	const trips = await database
		.select()
		.from(trips_table)
		.where(and(...conditions));
	return trips;
};

export const get_trip = async (id: Trip["id"]) => {
	const [trip] = await database
		.select()
		.from(trips_table)
		.where(eq(trips_table.id, id));
	if (trip === undefined) {
		throw new NotFoundError(`Trip with id ${id} not found`);
	}
	return trip;
};

export const update_trip = async (id: Trip["id"], input: unknown) => {
	const values = parse(UpdateTripSchema, input);
	const [trip] = await database
		.update(trips_table)
		.set(values)
		.where(eq(trips_table.id, id))
		.returning();
	if (trip === undefined) {
		throw new NotFoundError(`Trip with id ${id} not found`);
	}
	return trip;
};

export const delete_trip = async (id: Trip["id"]) => {
	const [trip] = await database
		.delete(trips_table)
		.where(eq(trips_table.id, id));
	if (trip === undefined) {
		throw new NotFoundError(`Trip with id ${id} not found`);
	}
	return trip;
};
