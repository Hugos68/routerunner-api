import { eq } from "drizzle-orm";
import { parse } from "valibot";
import { database } from "../database/database.js";
import {
	CreateRetourEmballageSchema,
	type RetourEmballage,
	retourPackagings,
} from "../database/models/retour_packagings.model.js";
import { NotFoundError } from "../utility/errors.js";

export const createRetourPackaging = async (input: unknown) => {
	const values = parse(CreateRetourEmballageSchema, input);
	const [result] = await database
		.insert(retourPackagings)
		.values(values)
		.returning();
	return result;
};

export const getRetourPackagings = async () => {
	const result = await database.select().from(retourPackagings);
	return result;
};

export const getRetourPackaging = async (id: RetourEmballage["id"]) => {
	const [result] = await database
		.select()
		.from(retourPackagings)
		.where(eq(retourPackagings.id, id));
	if (result === undefined) {
		throw new NotFoundError(`RetourEmballage with id ${id} not found`);
	}
	return result;
};

export const deleteRetourPackaging = async (id: RetourEmballage["id"]) => {
	const [result] = await database
		.delete(retourPackagings)
		.where(eq(retourPackagings.id, id));
	if (result === undefined) {
		throw new NotFoundError(`RetourEmballage with id ${id} not found`);
	}
	return result;
};

export const updateRetourPackaging = async (
	id: RetourEmballage["id"],
	input: unknown,
) => {
	const values = parse(CreateRetourEmballageSchema, input);
	const [result] = await database
		.update(retourPackagings)
		.set(values)
		.where(eq(retourPackagings.id, id))
		.returning();
	if (result === undefined) {
		throw new NotFoundError(`RetourEmballage with id ${id} not found`);
	}
	return result;
};
