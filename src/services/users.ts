import { eq } from "drizzle-orm";
import { database } from "../database/database.ts";
import { usersTable } from "../database/tables/users.ts";
import type { ServiceContext } from "../types/service-context.ts";
import type { User, UserToCreate, UserToUpdate } from "../types/users.ts";
import { NotFoundError, UnauthorizedError } from "../utility/errors.ts";

export const getUser = async (ctx: ServiceContext, id: User["id"]) => {
	if (
		ctx.session === null ||
		ctx.session.user.role.name !== "ADMIN" ||
		id !== ctx.session.user.id
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

export const getUsers = async (ctx: ServiceContext) => {
	if (ctx.session === null || ctx.session.user.role.name !== "ADMIN") {
		throw new UnauthorizedError();
	}
	const users = await database.select().from(usersTable);
	return users;
};

export const createUser = async (
	ctx: ServiceContext,
	userToCreate: UserToCreate,
) => {
	if (ctx.session === null || ctx.session.user.role.name !== "ADMIN") {
		throw new UnauthorizedError();
	}
	const [user] = await database.insert(usersTable).values(userToCreate);
	if (user === undefined) {
		throw new Error("Failed to create user");
	}
	return user;
};

export const updateUser = async (
	ctx: ServiceContext,
	id: User["id"],
	userToUpdate: UserToUpdate,
) => {
	if (
		ctx.session === null ||
		ctx.session.user.role.name !== "ADMIN" ||
		id !== ctx.session.user.id
	) {
		throw new UnauthorizedError();
	}
	const [user] = await database
		.update(usersTable)
		.set(userToUpdate)
		.where(eq(usersTable.id, id))
		.returning();
	if (user === undefined) {
		throw new Error("Failed to update user");
	}
	return user;
};

export const deleteUser = async (ctx: ServiceContext, id: User["id"]) => {
	if (
		ctx.session === null ||
		ctx.session.user.role.name !== "ADMIN" ||
		id !== ctx.session.user.id
	) {
		throw new UnauthorizedError();
	}
	const [user] = await database
		.delete(usersTable)
		.where(eq(usersTable.id, id))
		.returning();
	if (user === undefined) {
		throw new Error("Failed to delete user");
	}
	return user;
};
