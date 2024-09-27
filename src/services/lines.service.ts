import { eq } from "drizzle-orm";
import { parse } from "valibot";
import { database } from "../database/database.js";
import {
	CreateLineSchema,
	type Line,
	UpdateLineSchema,
	lines,
} from "../database/models/lines.model.js";
import { NotFoundError } from "../utility/errors.js";

export const createLine = async (input: unknown) => {
	const values = parse(CreateLineSchema, input);
	const [result] = await database.insert(lines).values(values).returning();
	return result;
};

export const getLines = async () => {
	const result = await database.select().from(lines);
	return result;
};

export const getLine = async (id: Line["id"]) => {
	const [result] = await database.select().from(lines).where(eq(lines.id, id));
	if (result === undefined) {
		throw new NotFoundError(`Line with id ${id} not found`);
	}
	return result;
};

export const updateLine = async (id: Line["id"], input: unknown) => {
	const values = parse(UpdateLineSchema, input);
	const [result] = await database
		.update(lines)
		.set(values)
		.where(eq(lines.id, id))
		.returning();
	if (result === undefined) {
		throw new NotFoundError(`Line with id ${id} not found`);
	}
	return result;
};

export const deleteLine = async (id: Line["id"]) => {
	const [result] = await database.delete(lines).where(eq(lines.id, id));
	if (result === undefined) {
		throw new NotFoundError(`Line with id ${id} not found`);
	}
	return result;
};
