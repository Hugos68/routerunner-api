import { eq, getTableColumns } from "drizzle-orm";
import { createInsertSchema } from "drizzle-valibot";
import { ValiError, parse } from "valibot";
import { database } from "../database/database.js";
import {
	CreateUserSchema,
	UpdateUserSchema,
	type User,
	users,
} from "../database/tables/users.table.js";
import { NotFoundError } from "../utility/errors.js";

const HASH_CONFIG = {
	algorithm: "argon2id",
	memoryCost: 19_456,
	timeCost: 2,
} satisfies Parameters<typeof Bun.password.hash>[1];

const safeColumns = (() => {
	const { password: _, ...columns } = getTableColumns(users);
	return columns;
})();

export const createUser = async (input: unknown) => {
	const values = parse(CreateUserSchema, input);
	values.password = await Bun.password.hash(values.password, HASH_CONFIG);
	const [result] = await database.insert(users).values(values).returning();
	return result;
};

export const getUsers = async () => {
	const result = await database.select(safeColumns).from(users);
	return result;
};

export const getUser = async (id: User["id"]) => {
	const [result] = await database
		.select(safeColumns)
		.from(users)
		.where(eq(users.id, id));
	if (result === undefined) {
		throw new NotFoundError(`User with id ${id} not found`);
	}
	return result;
};

export const updateUser = async (id: User["id"], input: unknown) => {
	const values = parse(UpdateUserSchema, input);
	if ("password" in values && values.password !== undefined) {
		values.password = await Bun.password.hash(values.password, HASH_CONFIG);
	}
	const [user] = await database
		.update(users)
		.set(values)
		.where(eq(users.id, id))
		.returning(safeColumns);
	if (user === undefined) {
		throw new NotFoundError(`User with id ${id} not found`);
	}
	return user;
};

export const deleteUser = async (id: User["id"]) => {
	const [user] = await database
		.delete(users)
		.where(eq(users.id, id))
		.returning(safeColumns);
	if (user === undefined) {
		throw new NotFoundError(`User with id ${id} not found`);
	}
	return user;
};
