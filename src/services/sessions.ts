import { and, eq } from "drizzle-orm";
import { database } from "../database/database.ts";
import { sessionsTable } from "../database/tables/sessions.ts";
import { usersTable } from "../database/tables/users.ts";
import type { Actor } from "../types/actor.ts";
import type {
	Session,
	SessionQuery,
	SessionToCreate,
} from "../types/session.ts";
import { authorize } from "../utility/authorize.ts";
import { createFilterConditions } from "../utility/create-filter-conditions.ts";
import {
	BadCredentialsError,
	ResourceNotFoundError,
	UnauthorizedError,
} from "../utility/errors.ts";

export const createSession = async (sessionToCreate: SessionToCreate) => {
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
	const [existingSession] = await database
		.select()
		.from(sessionsTable)
		.where(eq(sessionsTable.userId, user.id));
	if (existingSession !== undefined) {
		await database
			.delete(sessionsTable)
			.where(eq(sessionsTable.id, existingSession.id));
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

export const getSessions = async (actor: Actor, query: SessionQuery) => {
	authorize(actor).hasRole("ADMIN").orElseThrow(new UnauthorizedError());
	const sessions = await database
		.select()
		.from(sessionsTable)
		.where(and(...createFilterConditions(query, sessionsTable)));
	return sessions;
};

export const getSession = async (actor: Actor, id: Session["id"]) => {
	authorize(actor).hasRole("ADMIN").orElseThrow(new ResourceNotFoundError());
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
	const [session] = await database
		.select()
		.from(sessionsTable)
		.where(eq(sessionsTable.id, id));
	if (session === undefined) {
		throw new ResourceNotFoundError();
	}
	authorize(actor)
		.hasRole("PLANNER", "DRIVER")
		.satisfies(() => session.userId === actor?.id)
		.or()
		.hasRole("ADMIN")
		.orElseThrow(new ResourceNotFoundError());
	const [deletedSession] = await database
		.delete(sessionsTable)
		.where(eq(sessionsTable.id, id))
		.returning();
	if (deletedSession === undefined) {
		throw new Error("Failed to delete session");
	}
	return deletedSession;
};
