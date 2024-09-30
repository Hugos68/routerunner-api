import { eq } from "drizzle-orm";
import { parse } from "valibot";
import { database } from "../database/database.js";
import {
	CreateUserRolesSchema,
	UpdateUserRolesSchema,
	type UserRoles,
	user_roles_table,
} from "../database/schema.js";
import { NotFoundError } from "../utility/errors.js";

export const create_user_role = async (input: unknown) => {
	const values = parse(CreateUserRolesSchema, input);
	const [user_role] = await database
		.insert(user_roles_table)
		.values(values)
		.returning();
	if (user_role === undefined) {
		throw new Error("Failed to create user role");
	}
	return user_role;
};

export const get_user_roles = async () => {
	const user_roles = await database.select().from(user_roles_table);
	return user_roles;
};

export const get_user_role = async (id: UserRoles["id"]) => {
	const [user_role] = await database
		.select()
		.from(user_roles_table)
		.where(eq(user_roles_table.id, id));
	if (user_role === undefined) {
		throw new NotFoundError(`User role with id ${id} not found`);
	}
	return user_role;
};

export const update_user_role = async (id: UserRoles["id"], input: unknown) => {
	const values = parse(UpdateUserRolesSchema, input);
	const [user_role] = await database
		.update(user_roles_table)
		.set(values)
		.where(eq(user_roles_table.id, id))
		.returning();
	if (user_role === undefined) {
		throw new NotFoundError(`User role with id ${id} not found`);
	}
	return user_role;
};

export const delete_user_role = async (id: UserRoles["id"]) => {
	const [user_role] = await database
		.delete(user_roles_table)
		.where(eq(user_roles_table.id, id));
	if (user_role === undefined) {
		throw new NotFoundError(`User role with id ${id} not found`);
	}
	return user_role;
};
