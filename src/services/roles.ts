import { and, eq } from "drizzle-orm";
import { database } from "../database/database.ts";
import { rolesTable } from "../database/tables/roles.ts";
import type { Actor } from "../types/actor.ts";
import type {
	Role,
	RoleQuery,
	RoleToCreate,
	RoleToUpdate,
} from "../types/role.ts";
import { authorize } from "../utility/authorize.ts";
import { createFilterConditions } from "../utility/create-filter-conditions.ts";
import { ResourceNotFoundError, UnauthorizedError } from "../utility/errors.ts";

export const getRoles = async (actor: Actor, query: RoleQuery) => {
	authorize(actor)
		.hasRole("DRIVER", "PLANNER", "ADMIN")
		.orElseThrow(new UnauthorizedError());
	const roles = await database
		.select()
		.from(rolesTable)
		.where(and(...createFilterConditions(query, rolesTable)));
	return roles;
};

export const getRole = async (actor: Actor, id: Role["id"]) => {
	authorize(actor).hasRole("ADMIN").orElseThrow(new ResourceNotFoundError());
	const [role] = await database
		.select()
		.from(rolesTable)
		.where(eq(rolesTable.id, id));
	if (role === undefined) {
		throw new ResourceNotFoundError();
	}
	return role;
};

export const createRole = async (actor: Actor, roleToCreate: RoleToCreate) => {
	authorize(actor).hasRole("ADMIN").orElseThrow(new UnauthorizedError());
	const [role] = await database
		.insert(rolesTable)
		.values(roleToCreate)
		.returning();
	if (role === undefined) {
		throw new Error("Failed to create role");
	}
	return role;
};

export const updateRole = async (
	actor: Actor,
	id: Role["id"],
	roleToUpdate: RoleToUpdate,
) => {
	authorize(actor).hasRole("ADMIN").orElseThrow(new ResourceNotFoundError());
	const [role] = await database
		.update(rolesTable)
		.set(roleToUpdate)
		.where(eq(rolesTable.id, id))
		.returning();
	if (role === undefined) {
		throw new Error("Failed to update role");
	}
	return role;
};

export const deleteRole = async (actor: Actor, id: Role["id"]) => {
	authorize(actor).hasRole("ADMIN").orElseThrow(new ResourceNotFoundError());
	const [role] = await database
		.delete(rolesTable)
		.where(eq(rolesTable.id, id))
		.returning();
	if (role === undefined) {
		throw new Error("Failed to delete role");
	}
	return role;
};
