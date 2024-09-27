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
import { HASH_CONFIG } from "../utility/constants.js";
import { NotFoundError } from "../utility/errors.js";

const safeColumns = (() => {
	const { password: _, ...columns } = getTableColumns(users);
	return columns;
})();

export const createUser = async (input: unknown) => {
	const values = parse(CreateUserSchema, input);
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
		throw new NotFoundError("User not found");
	}
	return result;
};

export const updateUser = async (id: User["id"], input: unknown) => {
	const values = parse(UpdateUserSchema, input);

	if ("password" in values && values.password !== undefined) {
		const hashedPassword = await Bun.password.hash(
			values.password,
			HASH_CONFIG,
		);
		values.password = hashedPassword;
	}

	const [user] = await database
		.update(users)
		.set(values)
		.where(eq(users.id, id))
		.returning(safeColumns);

	if (user === undefined) {
		throw new NotFoundError("User not found");
	}

	return user;
};

export const deleteUser = async (id: User["id"]) => {
	const [user] = await database
		.delete(users)
		.where(eq(users.id, id))
		.returning(safeColumns);
	if (user === undefined) {
		throw new NotFoundError("User not found");
	}
	return user;
};

// export async function createUser(data: Omit<User, "id">) {
// 	try {
// 		const userObject = parse(createInsertSchema(users), data);
// 		const result = await database
// 			.insert(users)
// 			.values({
// 				...userObject,
// 				password: await Bun.password.hash(userObject.password, {
// 					algorithm: "argon2id",
// 					memoryCost: 19_456,
// 					timeCost: 2,
// 				}),
// 			})
// 			.returning();
// 		return Result.ok(result);
// 	} catch (error) {
// 		if (error instanceof ValiError) {
// 			return Result.err("Validation", error.message);
// 		}
// 		if (error instanceof Error) {
// 			return Result.err("Unknown", error.message);
// 		}
// 		return Result.err("Unknown", "Something went wrong");
// 	}
// }

// export async function getUser(id: User["id"]) {
// 	try {
// 		const { password: _, ...columns } = getTableColumns(users);
// 		const result = await database
// 			.select(columns)
// 			.from(users)
// 			.where(eq(users.id, id));

// 		if (result.length === 0) {
// 			throw new Error("User not found");
// 		}

// 		return Result.ok(result);
// 	} catch (error) {
// 		if (error instanceof Error) {
// 			return Result.err("Unknown", error.message);
// 		}
// 		return Result.err("Unknown", "Something went wrong");
// 	}
// }

// export async function getUsers() {
// 	try {
// 		const { password: _, ...columns } = getTableColumns(users);
// 		const result = await database.select(columns).from(users);
// 		return Result.ok(result);
// 	} catch (error) {
// 		if (error instanceof Error) {
// 			return Result.err("Unknown", error.message);
// 		}
// 		return Result.err("Unknown", "Something went wrong");
// 	}
// }

// export async function updateUser(
// 	id: User["id"],
// 	data: Partial<Omit<User, "id">>,
// ) {
// 	try {
// 		const result = await database
// 			.update(users)
// 			.set({
// 				...(data.password
// 					? {
// 							...data,
// 							password: await Bun.password.hash(data.password, {
// 								algorithm: "argon2id",
// 								memoryCost: 19_456,
// 								timeCost: 2,
// 							}),
// 						}
// 					: data),
// 			})
// 			.where(eq(users.id, id))
// 			.returning();
// 		return Result.ok(result);
// 	} catch (error) {
// 		if (error instanceof Error) {
// 			return Result.err("Unknown", error.message);
// 		}
// 		return Result.err("Unknown", "Something went wrong");
// 	}
// }

// export async function deleteUser(id: User["id"]) {
// 	try {
// 		const result = await database
// 			.delete(users)
// 			.where(eq(users.id, id))
// 			.returning();
// 		return Result.ok(result);
// 	} catch (error) {
// 		if (error instanceof Error) {
// 			return Result.err("Unknown", error.message);
// 		}
// 		return Result.err("Unknown", "Something went wrong");
// 	}
// }
