import { and, eq } from "drizzle-orm";
import { parse } from "valibot";
import { database } from "../database/database.js";
import {
	CreateUserRolesSchema,
	UpdateUserRolesSchema,
	type UserRoles,
	userRolesTable,
} from "../database/schema.js";
import { createFilterConditions } from "../utility/create-filter-conditions.js";
import { NotFoundError } from "../utility/errors.js";

export const createUserRole = async (input: unknown) => {
	const values = parse(CreateUserRolesSchema, input);
	const [userRole] = await database
		.insert(userRolesTable)
		.values(values)
		.returning();
	if (userRole === undefined) {
		throw new Error("Failed to create user role");
	}
	return userRole;
};

export const getUserRoles = async (filter: Record<string, unknown> = {}) => {
	const conditions = createFilterConditions(filter, userRolesTable);
	const userRoles = await database
		.select()
		.from(userRolesTable)
		.where(and(...conditions));
	return userRoles;
};

export const getUserRole = async (id: UserRoles["id"]) => {
	const [userRole] = await database
		.select()
		.from(userRolesTable)
		.where(eq(userRolesTable.id, id));
	if (userRole === undefined) {
		throw new NotFoundError(`User role with id ${id} not found`);
	}
	return userRole;
};

export const updateUserRole = async (id: UserRoles["id"], input: unknown) => {
	const values = parse(UpdateUserRolesSchema, input);
	const [userRole] = await database
		.update(userRolesTable)
		.set(values)
		.where(eq(userRolesTable.id, id))
		.returning();
	if (userRole === undefined) {
		throw new NotFoundError(`User role with id ${id} not found`);
	}
	return userRole;
};

export const deleteUserRole = async (id: UserRoles["id"]) => {
	const [userRole] = await database
		.delete(userRolesTable)
		.where(eq(userRolesTable.id, id))
		.returning();
	if (userRole === undefined) {
		throw new NotFoundError(`User role with id ${id} not found`);
	}
	return userRole;
};
