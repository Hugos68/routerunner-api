import { and, eq } from "drizzle-orm";
import { parse } from "valibot";
import { database } from "../database/database.js";
import {
	CreateRetourPackagingSchema,
	type RetourPackaging,
	UpdateRetourPackagingSchema,
	retourPackagingsTable,
} from "../database/schema.js";
import { createFilterConditions } from "../utility/create-filter-conditions.js";
import { NotFoundError } from "../utility/errors.js";

export const createRetourPackaging = async (input: unknown) => {
	const values = parse(CreateRetourPackagingSchema, input);
	const [retourPackaging] = await database
		.insert(retourPackagingsTable)
		.values(values)
		.returning();
	if (retourPackaging === undefined) {
		throw new Error("Failed to create retour packaging");
	}
	return retourPackaging;
};

export const getRetourPackagings = async (filter: Record<string, unknown>) => {
	const conditions = createFilterConditions(filter, retourPackagingsTable);
	const retourPackaging = await database
		.select()
		.from(retourPackagingsTable)
		.where(and(...conditions));
	return retourPackaging;
};

export const getRetourPackaging = async (id: RetourPackaging["id"]) => {
	const [retourPackaging] = await database
		.select()
		.from(retourPackagingsTable)
		.where(eq(retourPackagingsTable.id, id));
	if (retourPackaging === undefined) {
		throw new NotFoundError(`Retour packaging with id ${id} not found`);
	}
	return retourPackaging;
};

export const updateRetourPackaging = async (
	id: RetourPackaging["id"],
	input: unknown,
) => {
	const values = parse(UpdateRetourPackagingSchema, input);
	const [retourPackaging] = await database
		.update(retourPackagingsTable)
		.set(values)
		.where(eq(retourPackagingsTable.id, id))
		.returning();
	if (retourPackaging === undefined) {
		throw new NotFoundError(`Retour packaging with id ${id} not found`);
	}
	return retourPackaging;
};

export const deleteRetourPackaging = async (id: RetourPackaging["id"]) => {
	const [retourPackaging] = await database
		.delete(retourPackagingsTable)
		.where(eq(retourPackagingsTable.id, id))
		.returning();
	if (retourPackaging === undefined) {
		throw new NotFoundError(`Retour packaging with id ${id} not found`);
	}
	return retourPackaging;
};
