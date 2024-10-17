import { describe, expect, it } from "bun:test";
import { v4 } from "uuid";
import {
	createSession,
	deleteSession,
	getSession,
	getSessions,
} from "../../src/services/sessions.ts";
import type { Actor } from "../../src/types/actor.ts";
import {
	BadCredentialsError,
	ResourceNotFoundError,
	UnauthorizedError,
} from "../../src/utility/errors.ts";
import { seedData } from "../setup.ts";

describe("Session Service Tests", () => {
	it("should create a session for a valid user", async () => {
		const sessionToCreate = { username: "admin", password: "1234567890" };
		const session = await createSession(sessionToCreate);
		expect(session).toBeDefined();
	});
	it("should throw BadCredentialsError for invalid password", () => {
		const sessionToCreate = { username: "admin", password: "wrongpassword" };
		expect(createSession(sessionToCreate)).rejects.toThrow(BadCredentialsError);
	});
	it("should throw BadCredentialsError for non-existent user", () => {
		const sessionToCreate = { username: "nonexistent", password: "1234567890" };
		expect(createSession(sessionToCreate)).rejects.toThrow(BadCredentialsError);
	});
	it("should get all sessions for admin user", async () => {
		const adminActor: Actor = { ...seedData.admin, role: seedData.adminRole };
		const sessions = await getSessions(adminActor, {});
		expect(sessions).toBeDefined();
	});
	it("should throw UnauthorizedError when a non-admin tries to get sessions", () => {
		const driverActor: Actor = {
			...seedData.driver,
			role: seedData.driverRole,
		};
		expect(getSessions(driverActor, {})).rejects.toThrow(UnauthorizedError);
	});
	it("should get a specific session by ID for admin", async () => {
		const adminActor: Actor = { ...seedData.admin, role: seedData.adminRole };
		const sessionToCreate = { username: "driver", password: "1234567890" };
		const createdSession = await createSession(sessionToCreate);
		const session = await getSession(adminActor, createdSession.id);
		expect(session).toBeDefined();
		expect(session.id).toBe(createdSession.id);
	});
	it("should throw ResourceNotFoundError when non-existent session is fetched", () => {
		const adminActor: Actor = { ...seedData.admin, role: seedData.adminRole };
		expect(getSession(adminActor, v4())).rejects.toThrow(ResourceNotFoundError);
	});
	it("should delete a session for authorized user", async () => {
		const driverActor: Actor = {
			...seedData.driver,
			role: seedData.driverRole,
		};
		const sessionToCreate = { username: "driver", password: "1234567890" };
		const createdSession = await createSession(sessionToCreate);
		const deletedSession = await deleteSession(driverActor, createdSession.id);
		expect(deletedSession).toBeDefined();
		expect(deletedSession.id).toBe(createdSession.id);
	});
	it("should throw ResourceNotFoundError when trying to delete non-existent session", () => {
		const driverActor: Actor = {
			...seedData.driver,
			role: seedData.driverRole,
		};
		expect(deleteSession(driverActor, v4())).rejects.toThrow(
			ResourceNotFoundError,
		);
	});
	it("should throw ResourceNotFoundError when unauthorized user tries to delete a session", async () => {
		const driverActor: Actor = {
			...seedData.driver,
			role: seedData.driverRole,
		};
		const sessionToCreate = { username: "planner", password: "1234567890" };
		const createdSession = await createSession(sessionToCreate);
		expect(deleteSession(driverActor, createdSession.id)).rejects.toThrow(
			ResourceNotFoundError,
		);
	});
});
