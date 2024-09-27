import { eq } from "drizzle-orm";
import { parse } from "valibot";
import { database } from "../database/database.js";
import {
	CreateRoleSchema,
	type Role,
	UpdateRoleSchema,
	roles,
} from "../database/models/roles.model.js";
import { NotFoundError } from "../utility/errors.js";

export const createRole = async (input: unknown) => {
	const values = parse(CreateRoleSchema, input);
	const [result] = await database.insert(roles).values(values).returning();
	return result;
};

export const getRoles = async () => {
	const result = await database.select().from(roles);
	return result;
};

export const getRole = async (id: Role["id"]) => {
	const [result] = await database.select().from(roles).where(eq(roles.id, id));
	if (result === undefined) {
		throw new NotFoundError(`Role with id ${id} not found`);
	}
	return result;
};

export const updateRole = async (id: Role["id"], input: unknown) => {
	const values = parse(UpdateRoleSchema, input);
	const [result] = await database
		.update(roles)
		.set(values)
		.where(eq(roles.id, id))
		.returning();
	if (result === undefined) {
		throw new NotFoundError(`Role with id ${id} not found`);
	}
	return result;
};

export const deleteRole = async (id: Role["id"]) => {
	const [result] = await database.delete(roles).where(eq(roles.id, id));
	if (result === undefined) {
		throw new NotFoundError(`Role with id ${id} not found`);
	}
	return result;
};
