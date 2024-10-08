import { and, eq } from "drizzle-orm";
import { parse } from "valibot";
import { database } from "../database/database.js";
import {
	CreateLineSchema,
	type Line,
	UpdateLineSchema,
	linesTable,
} from "../database/schema.js";
import { createFilterConditions } from "../utility/create-filter-conditions.js";
import { NotFoundError } from "../utility/errors.js";

export const createLine = async (input: unknown) => {
	const values = parse(CreateLineSchema, input);
	const [line] = await database.insert(linesTable).values(values).returning();
	if (line === undefined) {
		throw new Error("Failed to create line");
	}
	return line;
};

export const getLines = async (filter: Record<string, unknown>) => {
	const conditions = createFilterConditions(filter, linesTable);
	const lines = await database
		.select()
		.from(linesTable)
		.where(and(...conditions));
	return lines;
};

export const getLine = async (id: Line["id"]) => {
	const [line] = await database
		.select()
		.from(linesTable)
		.where(eq(linesTable.id, id));
	if (line === undefined) {
		throw new NotFoundError(`Line with id ${id} not found`);
	}
	return line;
};

export const updateLine = async (id: Line["id"], input: unknown) => {
	const values = parse(UpdateLineSchema, input);
	const [line] = await database
		.update(linesTable)
		.set(values)
		.where(eq(linesTable.id, id))
		.returning();
	if (line === undefined) {
		throw new NotFoundError(`Line with id ${id} not found`);
	}
	return line;
};

export const deleteLine = async (id: Line["id"]) => {
	const [line] = await database
		.delete(linesTable)
		.where(eq(linesTable.id, id))
		.returning();
	if (line === undefined) {
		throw new NotFoundError(`Line with id ${id} not found`);
	}
	return line;
};
