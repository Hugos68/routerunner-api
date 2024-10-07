import { and, eq } from "drizzle-orm";
import { parse, pick } from "valibot";
import { database } from "../database/database.js";
import {
	CreateUserSchema,
	type Session,
	sessionsTable,
} from "../database/schema.js";
import { usersTable } from "../database/schema.js";
import { HASH_CONFIG } from "../utility/constants.js";
import { createFilterCondition } from "../utility/create-filter-conditions.js";
import { BadCredentialsError, NotFoundError } from "../utility/errors.js";

export const createSession = async (input: unknown) => {
	const values = parse(pick(CreateUserSchema, ["username", "password"]), input);
	const [user] = await database
		.select()
		.from(usersTable)
		.where(eq(usersTable.username, values.username));
	if (user === undefined) {
		throw new NotFoundError(
			`User with username "${values.username}" not found`,
		);
	}
	const passwordMatches = await Bun.password.verify(
		values.password,
		user.password,
		HASH_CONFIG.algorithm,
	);
	if (!passwordMatches) {
		throw new BadCredentialsError();
	}
	const [session] = await database
		.insert(sessionsTable)
		.values({
			userId: user.id,
		})
		.returning();
	if (session === undefined) {
		throw new Error("Failed to create session");
	}
	return session;
};

export const getSessions = async (filter: Record<string, unknown> = {}) => {
	const conditions = createFilterCondition(filter, sessionsTable);
	const sessions = await database
		.select()
		.from(sessionsTable)
		.where(and(...conditions));
	return sessions;
};

export const getSession = async (id: Session["id"]) => {
	const [session] = await database
		.select()
		.from(sessionsTable)
		.where(eq(sessionsTable.id, id));
	if (session === undefined) {
		throw new NotFoundError(`Session with id ${id} not found`);
	}
	return session;
};

export const deleteSession = async (id: Session["id"]) => {
	const [session] = await database
		.delete(sessionsTable)
		.where(eq(sessionsTable.id, id))
		.returning();
	if (session === undefined) {
		throw new NotFoundError(`Session with id ${id} not found`);
	}
	return session;
};
