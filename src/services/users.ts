import { and, eq, getTableColumns } from "drizzle-orm";
import { parse, partial } from "valibot";
import { database } from "../database/database.js";
import {
	CreateUserSchema,
	UpdateUserSchema,
	type User,
	users_table,
} from "../database/schema.js";
import { create_filter_conditions } from "../utility/create-filter-conditions.js";
import { NotFoundError } from "../utility/errors.js";

const safe_columns = (() => {
	const { password: _, ...columns } = getTableColumns(users_table);
	return columns;
})();

export const create_user = async (input: unknown) => {
	const values = parse(CreateUserSchema, input);
	const [user] = await database
		.insert(users_table)
		.values(values)
		.returning(safe_columns);
	if (user === undefined) {
		throw new Error("Failed to create user");
	}
	return user;
};

export const get_users = async (filter: Record<string, unknown> = {}) => {
	const conditions = create_filter_conditions(
		filter,
		partial(CreateUserSchema),
		users_table,
	);
	const users = await database
		.select(safe_columns)
		.from(users_table)
		.where(and(...conditions));
	return users;
};

export const get_user = async (id: User["id"]) => {
	const [user] = await database
		.select(safe_columns)
		.from(users_table)
		.where(eq(users_table.id, id));
	if (user === undefined) {
		throw new NotFoundError(`User with id ${id} not found`);
	}
	return user;
};

export const update_user = async (id: User["id"], input: unknown) => {
	const values = parse(UpdateUserSchema, input);
	const [user] = await database
		.update(users_table)
		.set(values)
		.where(eq(users_table.id, id))
		.returning(safe_columns);
	if (user === undefined) {
		throw new NotFoundError(`User with id ${id} not found`);
	}
	return user;
};

export const delete_user = async (id: User["id"]) => {
	const [user] = await database
		.delete(users_table)
		.where(eq(users_table.id, id))
		.returning(safe_columns);
	if (user === undefined) {
		throw new NotFoundError(`User with id ${id} not found`);
	}
	return user;
};
