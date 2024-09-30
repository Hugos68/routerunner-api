import { eq } from "drizzle-orm";
import { parse } from "valibot";
import { database } from "../database/database.js";
import {
	CreateRetourEmballageSchema,
	type RetourEmballage,
	retour_packaging_table,
} from "../database/schema.js";
import { NotFoundError } from "../utility/errors.js";

export const create_retour_packaging = async (input: unknown) => {
	const values = parse(CreateRetourEmballageSchema, input);
	const [retour_packaging] = await database
		.insert(retour_packaging_table)
		.values(values)
		.returning();
	if (retour_packaging === undefined) {
		throw new Error("Failed to create retour packaging");
	}
	return retour_packaging;
};

export const get_retour_packagings = async () => {
	const retour_packagings = await database
		.select()
		.from(retour_packaging_table);
	return retour_packagings;
};

export const get_retour_packaging = async (id: RetourEmballage["id"]) => {
	const [retour_packaging] = await database
		.select()
		.from(retour_packaging_table)
		.where(eq(retour_packaging_table.id, id));
	if (retour_packaging === undefined) {
		throw new NotFoundError(`RetourEmballage with id ${id} not found`);
	}
	return retour_packaging;
};

export const update_retour_packaging = async (
	id: RetourEmballage["id"],
	input: unknown,
) => {
	const values = parse(CreateRetourEmballageSchema, input);
	const [retour_packaging] = await database
		.update(retour_packaging_table)
		.set(values)
		.where(eq(retour_packaging_table.id, id))
		.returning();
	if (retour_packaging === undefined) {
		throw new NotFoundError(`RetourEmballage with id ${id} not found`);
	}
	return retour_packaging;
};

export const delete_retour_packaging = async (id: RetourEmballage["id"]) => {
	const [retour_packaging] = await database
		.delete(retour_packaging_table)
		.where(eq(retour_packaging_table.id, id));
	if (retour_packaging === undefined) {
		throw new NotFoundError(`RetourEmballage with id ${id} not found`);
	}
	return retour_packaging;
};
