import { and, eq } from "drizzle-orm";
import { parse } from "valibot";
import { database } from "../database/database.js";
import {
	CreateLineSchema,
	type Line,
	UpdateLineSchema,
	lines_table,
} from "../database/schema.js";
import { create_filter_conditions } from "../utility/create-filter-conditions.js";
import { NotFoundError } from "../utility/errors.js";

export const create_line = async (input: unknown) => {
	const values = parse(CreateLineSchema, input);
	const [line] = await database.insert(lines_table).values(values).returning();
	if (line === undefined) {
		throw new Error("Failed to create line");
	}
	return line;
};

export const get_lines = async (filter: Record<string, unknown>) => {
	const conditions = create_filter_conditions(filter, lines_table);
	const lines = await database
		.select()
		.from(lines_table)
		.where(and(...conditions));
	return lines;
};

export const get_line = async (id: Line["id"]) => {
	const [line] = await database
		.select()
		.from(lines_table)
		.where(eq(lines_table.id, id));
	if (line === undefined) {
		throw new NotFoundError(`Line with id ${id} not found`);
	}
	return line;
};

export const update_line = async (id: Line["id"], input: unknown) => {
	const values = parse(UpdateLineSchema, input);
	const [line] = await database
		.update(lines_table)
		.set(values)
		.where(eq(lines_table.id, id))
		.returning();
	if (line === undefined) {
		throw new NotFoundError(`Line with id ${id} not found`);
	}
	return line;
};

export const delete_line = async (id: Line["id"]) => {
	const [line] = await database
		.delete(lines_table)
		.where(eq(lines_table.id, id));
	if (line === undefined) {
		throw new NotFoundError(`Line with id ${id} not found`);
	}
	return line;
};
