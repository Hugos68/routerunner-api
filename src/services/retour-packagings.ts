import { and, eq } from "drizzle-orm";
import { database } from "../database/database.ts";
import { retourPackagingsTable } from "../database/tables/retour-packagings.ts";
import type { Actor } from "../types/actor.ts";
import type {
	RetourPackaging,
	RetourPackagingQuery,
	RetourPackagingToCreate,
	RetourPackagingToUpdate,
} from "../types/retour-packaging.ts";
import { ResourceNotFoundError, UnauthorizedError } from "../utility/errors.ts";

import { authorize } from "../utility/authorize.ts";
import { createFilterConditions } from "../utility/create-filter-conditions.ts";

export const getRetourPackagings = async (
	actor: Actor,
	query: RetourPackagingQuery,
) => {
	authorize(actor)
		.hasRole("DRIVER", "PLANNER", "ADMIN")
		.orElseThrow(new UnauthorizedError());
	const retourPackagings = await database
		.select()
		.from(retourPackagingsTable)
		.where(and(...createFilterConditions(query, retourPackagingsTable)));
	return retourPackagings;
};

export const getRetourPackaging = async (
	actor: Actor,
	id: RetourPackaging["id"],
) => {
	authorize(actor)
		.hasRole("DRIVER", "PLANNER", "ADMIN")
		.orElseThrow(new ResourceNotFoundError());
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
	authorize(actor)
		.hasRole("DRIVER", "PLANNER", "ADMIN")
		.orElseThrow(new UnauthorizedError());
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
		.hasRole("DRIVER", "PLANNER", "ADMIN")
		.orElseThrow(new ResourceNotFoundError());
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
		.hasRole("DRIVER", "PLANNER", "ADMIN")
		.orElseThrow(new ResourceNotFoundError());
	const [retourPackaging] = await database
		.delete(retourPackagingsTable)
		.where(eq(retourPackagingsTable.id, id))
		.returning();
	if (retourPackaging === undefined) {
		throw new Error("Failed to delete retourPackaging");
	}
	return retourPackaging;
};
