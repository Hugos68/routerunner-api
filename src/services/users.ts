import { eq } from "drizzle-orm";
import { database } from "../database/database.ts";
import { usersTable } from "../database/tables/users.ts";
import type { Actor } from "../types/actor.ts";
import type { User, UserToCreate, UserToUpdate } from "../types/user.ts";
import { ResourceNotFoundError, UnauthorizedError } from "../utility/errors.ts";

export const createUser = async (
	caller: Actor | null,
	userToCreate: UserToCreate,
) => {
	if (caller === null || caller.role.name !== "ADMIN") {
		throw new UnauthorizedError();
	}
	const [user] = await database.insert(usersTable).values(userToCreate);
	if (user === undefined) {
		throw new Error("Failed to create user");
	}
	return user;
};

export const getUser = async (actor: Actor, id: User["id"]) => {
	if (actor === null || actor.role.name !== "ADMIN" || id !== actor.id) {
		throw new ResourceNotFoundError();
	}
	const [user] = await database
		.select()
		.from(usersTable)
		.where(eq(usersTable.id, id));
	if (user === undefined) {
		throw new ResourceNotFoundError();
	}
	return user;
};

export const getUsers = async (actor: Actor) => {
	if (actor === null || actor.role.name !== "ADMIN") {
		throw new UnauthorizedError();
	}
	const users = await database.select().from(usersTable);
	return users;
};

export const updateUser = async (
	actor: Actor,
	id: User["id"],
	userToUpdate: UserToUpdate,
) => {
	if (actor === null || actor.role.name !== "ADMIN" || id !== actor.id) {
		throw new ResourceNotFoundError();
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

export const deleteUser = async (actor: Actor, id: User["id"]) => {
	if (actor === null || actor.role.name !== "ADMIN" || id !== actor.id) {
		throw new ResourceNotFoundError();
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
