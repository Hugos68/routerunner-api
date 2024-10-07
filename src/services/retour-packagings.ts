import { and, eq } from "drizzle-orm";
import { parse, partial } from "valibot";
import { database } from "../database/database.js";
import {
	CreateRetourPackagingSchema,
	type RetourPackaging,
	UpdateRetourPackagingSchema,
	retour_packaging_table,
} from "../database/schema.js";
import { create_filter_conditions } from "../utility/create-filter-conditions.js";
import { NotFoundError } from "../utility/errors.js";

export const create_retour_packaging = async (input: unknown) => {
	const values = parse(CreateRetourPackagingSchema, input);
	const [retour_packaging] = await database
		.insert(retour_packaging_table)
		.values(values)
		.returning();
	if (retour_packaging === undefined) {
		throw new Error("Failed to create retour packaging");
	}
	return retour_packaging;
};

export const get_retour_packagings = async (
	filter: Record<string, unknown>,
) => {
	const conditions = create_filter_conditions(filter, retour_packaging_table);
	const retour_packaging = await database
		.select()
		.from(retour_packaging_table)
		.where(and(...conditions));
	return retour_packaging;
};

export const get_retour_packaging = async (id: RetourPackaging["id"]) => {
	const [retour_packaging] = await database
		.select()
		.from(retour_packaging_table)
		.where(eq(retour_packaging_table.id, id));
	if (retour_packaging === undefined) {
		throw new NotFoundError(`Retour packaging with id ${id} not found`);
	}
	return retour_packaging;
};

export const update_retour_packaging = async (
	id: RetourPackaging["id"],
	input: unknown,
) => {
	const values = parse(UpdateRetourPackagingSchema, input);
	const [retour_packaging] = await database
		.update(retour_packaging_table)
		.set(values)
		.where(eq(retour_packaging_table.id, id))
		.returning();
	if (retour_packaging === undefined) {
		throw new NotFoundError(`Retour packaging with id ${id} not found`);
	}
	return retour_packaging;
};

export const delete_retour_packaging = async (id: RetourPackaging["id"]) => {
	const [retour_packaging] = await database
		.delete(retour_packaging_table)
		.where(eq(retour_packaging_table.id, id));
	if (retour_packaging === undefined) {
		throw new NotFoundError(`Retour packaging with id ${id} not found`);
	}
	return retour_packaging;
};
