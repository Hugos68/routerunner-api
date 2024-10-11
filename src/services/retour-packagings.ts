import { eq } from "drizzle-orm";
import { database } from "../database/database.ts";
import { retourPackagingsTable } from "../database/tables/retour-packagings.ts";
import type { Actor } from "../types/actor.ts";
import type {
	RetourPackaging,
	RetourPackagingToCreate,
	RetourPackagingToUpdate,
} from "../types/retour-packaging.ts";
import { ResourceNotFoundError } from "../utility/errors.ts";

import { authorize } from "../utility/authorize.ts";

export const getRetourPackagings = async (actor: Actor) => {
	authorize(actor).isAuthenticated();
	const retourPackagings = await database.select().from(retourPackagingsTable);
	return retourPackagings;
};

export const getRetourPackaging = async (
	actor: Actor,
	id: RetourPackaging["id"],
) => {
	authorize(actor)
		.isAuthenticated()
		.throwCustomError(new ResourceNotFoundError());
	const [retourPackaging] = await database
		.select()
		.from(retourPackagingsTable)
		.where(eq(retourPackagingsTable.id, id));
	if (retourPackaging === undefined) {
		throw new ResourceNotFoundError();
	}
	return retourPackaging;
};

export const createRetourPackaging = async (
	actor: Actor,
	retourPackagingToCreate: RetourPackagingToCreate,
) => {
	authorize(actor).isAuthenticated();
	const [retourPackaging] = await database
		.insert(retourPackagingsTable)
		.values(retourPackagingToCreate)
		.returning();
	if (retourPackaging === undefined) {
		throw new Error("Failed to create retourPackaging");
	}
	return retourPackaging;
};

export const updateRetourPackaging = async (
	actor: Actor,
	id: RetourPackaging["id"],
	retourPackagingToUpdate: RetourPackagingToUpdate,
) => {
	authorize(actor)
		.isAuthenticated()
		.throwCustomError(new ResourceNotFoundError());
	const [retourPackaging] = await database
		.update(retourPackagingsTable)
		.set(retourPackagingToUpdate)
		.where(eq(retourPackagingsTable.id, id))
		.returning();
	if (retourPackaging === undefined) {
		throw new Error("Failed to update retourPackaging");
	}
	return retourPackaging;
};

export const deleteRetourPackaging = async (
	actor: Actor,
	id: RetourPackaging["id"],
) => {
	authorize(actor)
		.isAuthenticated()
		.throwCustomError(new ResourceNotFoundError());
	const [retourPackaging] = await database
		.delete(retourPackagingsTable)
		.where(eq(retourPackagingsTable.id, id))
		.returning();
	if (retourPackaging === undefined) {
		throw new Error("Failed to delete retourPackaging");
	}
	return retourPackaging;
};
