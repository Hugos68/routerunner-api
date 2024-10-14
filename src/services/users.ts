import { and, eq, getTableColumns } from "drizzle-orm";
import { database } from "../database/database.ts";
import { usersTable } from "../database/tables/users.ts";
import type { Actor } from "../types/actor.ts";
import type {
	User,
	UserQuery,
	UserToCreate,
	UserToUpdate,
} from "../types/user.ts";
import { authorize } from "../utility/authorize.ts";
import { createFilterConditions } from "../utility/create-filter-conditions.ts";
import { ResourceNotFoundError, UnauthorizedError } from "../utility/errors.ts";

const { password: _, ...columns } = getTableColumns(usersTable);

export const createUser = async (
	actor: Actor | null,
	userToCreate: UserToCreate,
) => {
	authorize(actor).hasRole("ADMIN").orElseThrow(new UnauthorizedError());
	const [user] = await database
		.insert(usersTable)
		.values(userToCreate)
		.returning(columns);
	if (user === undefined) {
		throw new Error("Failed to create user");
	}
	return user;
};

export const getUser = async (actor: Actor, id: User["id"]) => {
	const [user] = await database
		.select(columns)
		.from(usersTable)
		.where(eq(usersTable.id, id));
	if (user === undefined) {
		throw new ResourceNotFoundError();
	}
	authorize(actor)
		.hasRole("DRIVER", "PLANNER")
		.satisfies(() => actor?.id === user.id)
		.or()
		.hasRole("ADMIN")
		.orElseThrow(new ResourceNotFoundError());
	return user;
};

export const getUsers = async (actor: Actor, query: UserQuery) => {
	authorize(actor).hasRole("ADMIN").orElseThrow(new UnauthorizedError());
	const users = await database
		.select(columns)
		.from(usersTable)
		.where(and(...createFilterConditions(query, usersTable)));
	return users;
};

export const updateUser = async (
	actor: Actor,
	id: User["id"],
	userToUpdate: UserToUpdate,
) => {
	const [user] = await database
		.select(columns)
		.from(usersTable)
		.where(eq(usersTable.id, id));
	if (user === undefined) {
		throw new ResourceNotFoundError();
	}
	authorize(actor)
		.hasRole("DRIVER", "PLANNER")
		.satisfies(() => actor?.id === user.id)
		.or()
		.hasRole("ADMIN")
		.orElseThrow(new ResourceNotFoundError());
	const [updatedUser] = await database
		.update(usersTable)
		.set(userToUpdate)
		.where(eq(usersTable.id, id))
		.returning(columns);
	if (updatedUser === undefined) {
		throw new Error("Failed to update user");
	}
	return updatedUser;
};

export const deleteUser = async (actor: Actor, id: User["id"]) => {
	const [user] = await database
		.select(columns)
		.from(usersTable)
		.where(eq(usersTable.id, id));
	if (user === undefined) {
		throw new ResourceNotFoundError();
	}
	authorize(actor)
		.hasRole("DRIVER", "PLANNER")
		.satisfies(() => actor?.id === user.id)
		.or()
		.hasRole("ADMIN")
		.orElseThrow(new ResourceNotFoundError());
	const [deletedUser] = await database
		.delete(usersTable)
		.where(eq(usersTable.id, id))
		.returning(columns);
	if (deletedUser === undefined) {
		throw new Error("Failed to delete user");
	}
	return deletedUser;
};
