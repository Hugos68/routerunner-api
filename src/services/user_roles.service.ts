import { eq } from "drizzle-orm";
import { parse } from "valibot";
import { database } from "../database/database.js";
import {
	CreateUserRoleSchema,
	UpdateUserRoleSchema,
	type UserRole,
	userRoles,
} from "../database/models/user_roles.model.js";
import { NotFoundError } from "../utility/errors.js";

export const createUserRole = async (input: unknown) => {
	const values = parse(CreateUserRoleSchema, input);
	const [result] = await database.insert(userRoles).values(values).returning();
	return result;
};

export const getUserRoles = async () => {
	const result = await database.select().from(userRoles);
	return result;
};

export const getUserRole = async (id: UserRole["id"]) => {
	const [result] = await database
		.select()
		.from(userRoles)
		.where(eq(userRoles.id, id));
	if (result === undefined) {
		throw new NotFoundError(`User role with id ${id} not found`);
	}
	return result;
};

export const updateUserRole = async (id: UserRole["id"], input: unknown) => {
	const values = parse(UpdateUserRoleSchema, input);
	const [result] = await database
		.update(userRoles)
		.set(values)
		.where(eq(userRoles.id, id))
		.returning();
	if (result === undefined) {
		throw new NotFoundError(`User role with id ${id} not found`);
	}
	return result;
};

export const deleteUserRole = async (id: UserRole["id"]) => {
	const [result] = await database.delete(userRoles).where(eq(userRoles.id, id));
	if (result === undefined) {
		throw new NotFoundError(`User role with id ${id} not found`);
	}
	return result;
};
