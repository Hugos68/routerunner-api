import { and, eq } from "drizzle-orm";
import { parse } from "valibot";
import { database } from "../database/database.js";
import {
	CreateRoleSchema,
	type Role,
	UpdateRoleSchema,
	rolesTable,
} from "../database/schema.js";
import { createFilterConditions } from "../utility/create-filter-conditions.js";
import { NotFoundError } from "../utility/errors.js";

export const createRole = async (input: unknown) => {
	const values = parse(CreateRoleSchema, input);
	const [role] = await database.insert(rolesTable).values(values).returning();
	if (role === undefined) {
		throw new Error("Failed to create role");
	}
	return role;
};

export const getRoles = async (filter: Record<string, unknown> = {}) => {
	const conditions = createFilterConditions(filter, rolesTable);
	const roles = await database
		.select()
		.from(rolesTable)
		.where(and(...conditions));
	return roles;
};

export const getRole = async (id: Role["id"]) => {
	const [role] = await database
		.select()
		.from(rolesTable)
		.where(eq(rolesTable.id, id));
	if (role === undefined) {
		throw new NotFoundError();
	}
	return role;
};

export const updateRole = async (id: Role["id"], input: unknown) => {
	const values = parse(UpdateRoleSchema, input);
	const [role] = await database
		.update(rolesTable)
		.set(values)
		.where(eq(rolesTable.id, id))
		.returning();
	if (role === undefined) {
		throw new NotFoundError();
	}
	return role;
};

export const deleteRole = async (id: Role["id"]) => {
	const [role] = await database.delete(rolesTable).where(eq(rolesTable.id, id));
	if (role === undefined) {
		throw new NotFoundError();
	}
	return role;
};
