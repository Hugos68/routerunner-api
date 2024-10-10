import { eq } from "drizzle-orm";
import { database } from "../database/database.ts";
import { sessionsTable } from "../database/tables/sessions.ts";
import { usersTable } from "../database/tables/users.ts";
import type { Actor } from "../types/actor.ts";
import type { Session, SessionToCreate } from "../types/session.ts";
import {
	BadCredentialsError,
	ResourceNotFoundError,
	UnauthorizedError,
} from "../utility/errors.ts";

export const createSession = async (
	actor: Actor | null,
	sessionToCreate: SessionToCreate,
) => {
	if (actor === null) {
		throw new UnauthorizedError();
	}
	const [user] = await database
		.select()
		.from(usersTable)
		.where(eq(usersTable.username, sessionToCreate.username));
	if (user === undefined) {
		throw new BadCredentialsError();
	}
	const passwordMatches = await Bun.password.verify(
		sessionToCreate.password,
		user.password,
	);
	if (!passwordMatches) {
		throw new BadCredentialsError();
	}
	const [session] = await database.insert(sessionsTable).values({
		userId: user.id,
	});
	if (session === undefined) {
		throw new Error("Failed to create session");
	}
	return session;
};

export const getSessions = async (actor: Actor) => {
	if (actor === null || actor.role.name !== "ADMIN") {
		throw new UnauthorizedError();
	}
	const sessions = await database.select().from(sessionsTable);
	return sessions;
};

export const getSession = async (actor: Actor, id: Session["id"]) => {
	if (actor === null || actor.role.name !== "ADMIN" || actor.id !== id) {
		throw new ResourceNotFoundError();
	}
	const [session] = await database
		.select()
		.from(sessionsTable)
		.where(eq(sessionsTable.id, id));
	if (session === undefined) {
		throw new ResourceNotFoundError();
	}
	return session;
};

export const deleteSession = async (actor: Actor, id: Session["id"]) => {
	if (actor === null || actor.role.name !== "ADMIN" || actor.id !== id) {
		throw new ResourceNotFoundError();
	}
	const [session] = await database
		.delete(sessionsTable)
		.where(eq(sessionsTable.id, id))
		.returning();
	if (session === undefined) {
		throw new Error("Failed to delete session");
	}
	return session;
};
