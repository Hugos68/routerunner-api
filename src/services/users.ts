import { eq } from "drizzle-orm";
import { database } from "../database/database.ts";
import { usersTable } from "../database/tables/users.ts";
import { CreateUserSchema, UpdateUserSchema } from "../schemas/users.ts";
import type { ServiceContext } from "../types/service-context.ts";
import type { User } from "../types/users.ts";
import { NotFoundError, UnauthorizedError } from "../utility/errors.ts";

export const getUser = async (context: ServiceContext, id: User["id"]) => {
	if (
		context.session === null ||
		context.session.user.role.name !== "ADMIN" ||
		id !== context.session.user.id
	) {
		throw new UnauthorizedError();
	}
	const [user] = await database
		.select()
		.from(usersTable)
		.where(eq(usersTable.id, id));
	if (user === undefined) {
		throw new NotFoundError();
	}
	return user;
};

export const getUsers = async (context: ServiceContext) => {
	if (context.session === null || context.session.user.role.name !== "ADMIN") {
		throw new UnauthorizedError();
	}
	const users = await database.select().from(usersTable);
	return users;
};

export const createUser = async (context: ServiceContext, payload: unknown) => {
	if (context.session === null || context.session.user.role.name !== "ADMIN") {
		throw new UnauthorizedError();
	}
	const user = CreateUserSchema.parse(payload);
	await database.insert(usersTable).values(user);
};

export const updateUser = async (
	context: ServiceContext,
	id: User["id"],
	input: unknown,
) => {
	if (
		context.session === null ||
		context.session.user.role.name !== "ADMIN" ||
		id !== context.session.user.id
	) {
		throw new UnauthorizedError();
	}
	const user = UpdateUserSchema.parse(input);
	await database.update(usersTable).set(user).where(eq(usersTable.id, id));
};

export const deleteUser = async (context: ServiceContext, id: User["id"]) => {
	if (
		context.session === null ||
		context.session.user.role.name !== "ADMIN" ||
		id !== context.session.user.id
	) {
		throw new UnauthorizedError();
	}
	await database.delete(usersTable).where(eq(usersTable.id, id));
};
