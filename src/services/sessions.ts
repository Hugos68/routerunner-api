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
} from "../utility/errors.ts";

export const createSession = async (
	actor: Actor | null,
	sessionToCreate: SessionToCreate,
) => {
	authorize(actor).isAuthenticated();
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

export const getSessions = async (actor: Actor, query: SessionQuery) => {
	authorize(actor).hasRoles("ADMIN");
	const sessions = await database
		.select()
		.from(sessionsTable)
		.where(and(...createFilterConditions(query, sessionsTable)));
	return sessions;
};

export const getSession = async (actor: Actor, id: Session["id"]) => {
	authorize(actor)
		.hasRoles("ADMIN")
		.throwCustomError(new ResourceNotFoundError());
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
	authorize(actor)
		.hasRoles("ADMIN")
		.throwCustomError(new ResourceNotFoundError());
	const [session] = await database
		.delete(sessionsTable)
		.where(eq(sessionsTable.id, id))
		.returning();
	if (session === undefined) {
		throw new Error("Failed to delete session");
	}
	return session;
};
