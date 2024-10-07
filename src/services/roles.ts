import { and, eq } from "drizzle-orm";
import { parse, partial } from "valibot";
import { database } from "../database/database.js";
import {
	CreateRoleSchema,
	type Role,
	UpdateRoleSchema,
	roles_table,
} from "../database/schema.js";
import { create_filter_conditions } from "../utility/create-filter-conditions.js";
import { NotFoundError } from "../utility/errors.js";

export const create_role = async (input: unknown) => {
	const values = parse(CreateRoleSchema, input);
	const [role] = await database.insert(roles_table).values(values).returning();
	if (role === undefined) {
		throw new Error("Failed to create role");
	}
	return role;
};

export const get_roles = async (filter: Record<string, unknown> = {}) => {
	const conditions = create_filter_conditions(filter, roles_table);
	const roles = await database
		.select()
		.from(roles_table)
		.where(and(...conditions));
	return roles;
};

export const get_role = async (id: Role["id"]) => {
	const [role] = await database
		.select()
		.from(roles_table)
		.where(eq(roles_table.id, id));
	if (role === undefined) {
		throw new NotFoundError(`Role with id ${id} not found`);
	}
	return role;
};

export const update_role = async (id: Role["id"], input: unknown) => {
	const values = parse(UpdateRoleSchema, input);
	const [role] = await database
		.update(roles_table)
		.set(values)
		.where(eq(roles_table.id, id))
		.returning();
	if (role === undefined) {
		throw new NotFoundError(`Role with id ${id} not found`);
	}
	return role;
};

export const delete_role = async (id: Role["id"]) => {
	const [role] = await database
		.delete(roles_table)
		.where(eq(roles_table.id, id));
	if (role === undefined) {
		throw new NotFoundError(`Role with id ${id} not found`);
	}
	return role;
};
