import { eq } from "drizzle-orm";
import { database } from "../database/database.ts";
import { linesTable } from "../database/tables/lines.ts";
import type { Actor } from "../types/actor.ts";
import type { Line, LineToCreate, LineToUpdate } from "../types/line.ts";
import { authorize } from "../utility/authorize.ts";
import { ResourceNotFoundError } from "../utility/errors.ts";

export const getLines = async (actor: Actor) => {
	authorize(actor).isAuthenticated();
	const lines = await database.select().from(linesTable);
	return lines;
};

export const getLine = async (actor: Actor, id: Line["id"]) => {
	authorize(actor)
		.isAuthenticated()
		.throwCustomError(new ResourceNotFoundError());
	const [line] = await database
		.select()
		.from(linesTable)
		.where(eq(linesTable.id, id));
	if (line === undefined) {
		throw new ResourceNotFoundError();
	}
	return line;
};

export const createLine = async (actor: Actor, lineToCreate: LineToCreate) => {
	authorize(actor).hasRoles("ADMIN", "PLANNER");
	const [line] = await database
		.insert(linesTable)
		.values(lineToCreate)
		.returning();
	if (line === undefined) {
		throw new Error("Failed to create line");
	}
	return line;
};

export const updateLine = async (
	actor: Actor,
	id: Line["id"],
	lineToUpdate: LineToUpdate,
) => {
	authorize(actor)
		.hasRoles("ADMIN", "PLANNER")
		.throwCustomError(new ResourceNotFoundError());
	const [line] = await database
		.update(linesTable)
		.set(lineToUpdate)
		.where(eq(linesTable.id, id))
		.returning();
	if (line === undefined) {
		throw new Error("Failed to update line");
	}
	return line;
};

export const deleteLine = async (actor: Actor, id: Line["id"]) => {
	authorize(actor)
		.hasRoles("ADMIN", "PLANNER")
		.throwCustomError(new ResourceNotFoundError());
	const [line] = await database
		.delete(linesTable)
		.where(eq(linesTable.id, id))
		.returning();
	if (line === undefined) {
		throw new Error("Failed to delete line");
	}
	return line;
};
