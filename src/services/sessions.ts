import { eq } from "drizzle-orm";
import { parse } from "valibot";
import { database } from "../database/database.js";
import {
	CreateSessionSchema,
	type Session,
	sessions_table,
} from "../database/schema.js";
import { users_table } from "../database/schema.js";
import { HASH_CONFIG } from "../utility/constants.js";
import { BadCredentialsError, NotFoundError } from "../utility/errors.js";

export const create_session = async (input: unknown) => {
	const values = parse(CreateSessionSchema, input);
	const [user] = await database
		.select()
		.from(users_table)
		.where(eq(users_table.username, values.username));
	if (user === undefined) {
		throw new NotFoundError(
			`User with username "${values.username}" not found`,
		);
	}
	const password_matches = await Bun.password.verify(
		values.password,
		user.password,
		HASH_CONFIG.algorithm,
	);
	if (!password_matches) {
		throw new BadCredentialsError("Username or password is incorrect");
	}
	const [session] = await database
		.insert(sessions_table)
		.values({
			userId: user.id,
		})
		.returning();
	if (session === undefined) {
		throw new Error("Failed to create session");
	}
	return session;
};

export const get_sessions = async () => {
	const sessions = await database.select().from(sessions_table);
	return sessions;
};

export const get_session = async (id: Session["id"]) => {
	const [session] = await database
		.select()
		.from(sessions_table)
		.where(eq(sessions_table.id, id));
	if (session === undefined) {
		throw new NotFoundError(`Session with id ${id} not found`);
	}
	return session;
};

export const delete_session = async (id: Session["id"]) => {
	const [session] = await database
		.delete(sessions_table)
		.where(eq(sessions_table.id, id));
	if (session === undefined) {
		throw new NotFoundError(`Session with id ${id} not found`);
	}
	return session;
};
