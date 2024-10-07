import { and, eq, getTableColumns } from "drizzle-orm";
import { parse } from "valibot";
import { database } from "../database/database.js";
import {
	CreateUserSchema,
	UpdateUserSchema,
	type User,
	usersTable,
} from "../database/schema.js";
import { createFilterCondition } from "../utility/create-filter-conditions.js";
import { NotFoundError } from "../utility/errors.js";

const safeColumns = (() => {
	const { password: _, ...columns } = getTableColumns(usersTable);
	return columns;
})();

export const createUser = async (input: unknown) => {
	const values = parse(CreateUserSchema, input);
	const [user] = await database
		.insert(usersTable)
		.values(values)
		.returning(safeColumns);
	if (user === undefined) {
		throw new Error("Failed to create user");
	}
	return user;
};

export const getUsers = async (filter: Record<string, unknown> = {}) => {
	const conditions = createFilterCondition(filter, usersTable);
	const users = await database
		.select(safeColumns)
		.from(usersTable)
		.where(and(...conditions));
	return users;
};

export const getUser = async (id: User["id"]) => {
	const [user] = await database
		.select(safeColumns)
		.from(usersTable)
		.where(eq(usersTable.id, id));
	if (user === undefined) {
		throw new NotFoundError(`User with id ${id} not found`);
	}
	return user;
};

export const updateUser = async (id: User["id"], input: unknown) => {
	const values = parse(UpdateUserSchema, input);
	const [user] = await database
		.update(usersTable)
		.set(values)
		.where(eq(usersTable.id, id))
		.returning(safeColumns);
	if (user === undefined) {
		throw new NotFoundError(`User with id ${id} not found`);
	}
	return user;
};

export const deleteUser = async (id: User["id"]) => {
	const [user] = await database
		.delete(usersTable)
		.where(eq(usersTable.id, id))
		.returning(safeColumns);
	if (user === undefined) {
		throw new NotFoundError(`User with id ${id} not found`);
	}
	return user;
};
