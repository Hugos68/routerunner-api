import { eq } from "drizzle-orm";
import { parse } from "valibot";
import { database } from "../database/database.js";
import {
	CreateSessionSchema,
	type Session,
	sessions,
} from "../database/models/sessions.model.js";
import { users } from "../database/models/users.model.js";
import { HASH_CONFIG } from "../utility/constants.js";
import { NotFoundError } from "../utility/errors.js";

export const createSession = async (input: unknown) => {
	const values = parse(CreateSessionSchema, input);

	const [user] = await database
		.select()
		.from(users)
		.where(eq(users.email, values.email));

	if (user === undefined) {
		throw new NotFoundError(`User with email ${values.email} not found`);
	}

	const passwordMatches = await Bun.password.verify(
		values.password,
		user.password,
		HASH_CONFIG.algorithm,
	);

	if (!passwordMatches) {
		throw new NotFoundError(`User with email ${values.email} not found`);
	}

	const [result] = await database
		.insert(sessions)
		.values({
			userId: user.id,
		})
		.returning();

	if (result === undefined) {
		throw new Error("Failed to create session");
	}

	return result;
};

export const getSessions = async () => {
	const result = await database.select().from(sessions);
	return result;
};

export const getSession = async (id: Session["id"]) => {
	const [result] = await database
		.select()
		.from(sessions)
		.where(eq(sessions.id, id));
	if (result === undefined) {
		throw new NotFoundError(`Session with id ${id} not found`);
	}
	return result;
};

export const deleteSession = async (id: Session["id"]) => {
	const [result] = await database.delete(sessions).where(eq(sessions.id, id));
	if (result === undefined) {
		throw new NotFoundError(`Session with id ${id} not found`);
	}
	return result;
};
