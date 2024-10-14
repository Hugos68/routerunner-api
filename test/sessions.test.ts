import { beforeEach, describe, expect, it } from "bun:test";
import * as uuid from "uuid";
import {
	createSession,
	deleteSession,
	getSession,
	getSessions,
} from "../src/services/sessions.ts";
import type { Actor } from "../src/types/actor.ts";
import {
	BadCredentialsError,
	ResourceNotFoundError,
	UnauthorizedError,
} from "../src/utility/errors.ts";
import { seedDatabase } from "./seed.ts";
import type { SeedData } from "./seedDataType.ts";

let seedData: SeedData;
beforeEach(async () => {
	seedData = await seedDatabase();
});

describe("Session Service Tests", () => {
	it("should create a session for a valid user", async () => {
		const sessionToCreate = { username: "admin", password: "1234567890" };
		const session = await createSession(sessionToCreate);
		expect(session).toBeDefined();
	});

	it("should throw BadCredentialsError for invalid password", async () => {
		const sessionToCreate = { username: "admin", password: "wrongpassword" };
		try {
			await createSession(sessionToCreate);
		} catch (error) {
			expect(error).toBeInstanceOf(BadCredentialsError);
		}
	});

	it("should throw BadCredentialsError for non-existent user", async () => {
		const sessionToCreate = { username: "nonexistent", password: "1234567890" };
		try {
			await createSession(sessionToCreate);
		} catch (error) {
			expect(error).toBeInstanceOf(BadCredentialsError);
		}
	});

	it("should get all sessions for admin user", async () => {
		const adminActor: Actor = { ...seedData.admin, role: seedData.adminRole };

		const sessions = await getSessions(adminActor, {});
		expect(sessions).toBeDefined();
	});

	it("should throw UnauthorizedError when a non-admin tries to get sessions", async () => {
		const driverActor: Actor = {
			...seedData.driver,
			role: seedData.driverRole,
		};
		try {
			await getSessions(driverActor, {});
		} catch (error) {
			expect(error).toBeInstanceOf(UnauthorizedError);
		}
	});

	it("should get a specific session by ID for admin", async () => {
		const adminActor: Actor = { ...seedData.admin, role: seedData.adminRole };
		const sessionToCreate = { username: "driver", password: "1234567890" };
		const createdSession = await createSession(sessionToCreate);
		const session = await getSession(adminActor, createdSession.id);
		expect(session).toBeDefined();
		expect(session.id).toBe(createdSession.id);
	});

	it("should throw ResourceNotFoundError when non-existent session is fetched", async () => {
		const adminActor: Actor = { ...seedData.admin, role: seedData.adminRole };
		try {
			await getSession(adminActor, uuid.v4());
		} catch (error) {
			expect(error).toBeInstanceOf(ResourceNotFoundError);
		}
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

	it("should throw ResourceNotFoundError when trying to delete non-existent session", async () => {
		const driverActor: Actor = {
			...seedData.driver,
			role: seedData.driverRole,
		};
		try {
			await deleteSession(driverActor, uuid.v4());
		} catch (error) {
			expect(error).toBeInstanceOf(ResourceNotFoundError);
		}
	});

	it("should throw ResourceNotFoundError when unauthorized user tries to delete a session", async () => {
		const driverActor: Actor = {
			...seedData.driver,
			role: seedData.driverRole,
		};
		const sessionToCreate = { username: "planner", password: "1234567890" };
		const createdSession = await createSession(sessionToCreate);

		try {
			await deleteSession(driverActor, createdSession.id);
		} catch (error) {
			expect(error).toBeInstanceOf(ResourceNotFoundError);
		}
	});
});
