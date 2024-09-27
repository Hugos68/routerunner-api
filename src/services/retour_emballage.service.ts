import { eq } from "drizzle-orm";
import { parse } from "valibot";
import { database } from "../database/database.js";
import {
	CreateRetourEmballageSchema,
	type RetourEmballage,
	retourEmballage,
} from "../database/tables/retour_emballage.table.js";
import { NotFoundError } from "../utility/errors.js";

export const createRetourEmballage = async (input: unknown) => {
	const values = parse(CreateRetourEmballageSchema, input);
	const [result] = await database
		.insert(retourEmballage)
		.values(values)
		.returning();
	return result;
};

export const getRetourEmballages = async () => {
	const result = await database.select().from(retourEmballage);
	return result;
};

export const getRetourEmballage = async (id: RetourEmballage["id"]) => {
	const [result] = await database
		.select()
		.from(retourEmballage)
		.where(eq(retourEmballage.id, id));
	if (result === undefined) {
		throw new NotFoundError(`RetourEmballage with id ${id} not found`);
	}
	return result;
};

export const deleteRetourEmballage = async (id: RetourEmballage["id"]) => {
	const [result] = await database
		.delete(retourEmballage)
		.where(eq(retourEmballage.id, id));
	if (result === undefined) {
		throw new NotFoundError(`RetourEmballage with id ${id} not found`);
	}
	return result;
};

export const updateRetourEmballage = async (
	id: RetourEmballage["id"],
	input: unknown,
) => {
	const values = parse(CreateRetourEmballageSchema, input);
	const [result] = await database
		.update(retourEmballage)
		.set(values)
		.where(eq(retourEmballage.id, id))
		.returning();
	if (result === undefined) {
		throw new NotFoundError(`RetourEmballage with id ${id} not found`);
	}
	return result;
};
