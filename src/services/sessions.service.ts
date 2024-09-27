import { eq } from "drizzle-orm";
import { parse } from "valibot";
import { database } from "../database/database.js";
import {
	CreateSessionSchema,
	type Session,
	sessions,
} from "../database/models/sessions.model.js";
import { NotFoundError } from "../utility/errors.js";

export const createSession = async (input: unknown) => {
	const values = parse(CreateSessionSchema, input);
	const [result] = await database.insert(sessions).values(values).returning();
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
