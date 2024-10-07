import { describe, expect, test } from "bun:test";
import { v4 } from "uuid";
import {
	createUser,
	deleteUser,
	getUser,
	getUsers,
	updateUser,
} from "../src/services/users.ts";
import { NotFoundError } from "../src/utility/errors.ts";

describe("Users", () => {
	test("Create a user", async () => {
		const user = await createUser({
			username: "test",
			password: "1234567890",
		});
		expect(user).toBeDefined();
	});

	test("Get all users", async () => {
		const users = await getUsers();
		expect(users).toBeInstanceOf(Array);
		expect(users.length).toBeGreaterThan(0);
	});

	test("Get a user", async () => {
		const users = await getUsers();
		const user = await getUser(users[0]?.id ?? "");
		expect(user).toBeDefined();
	});

	test("Getting an unknown user will throw a NotFoundError", async () => {
		expect(() => getUser(v4())).toThrowError(NotFoundError);
	});

	test("Updating an unknown user will throw a NotFoundError", async () => {
		expect(() =>
			updateUser(v4(), {
				username: "unknown",
				password: "1234567890",
			}),
		).toThrowError(NotFoundError);
	});

	test("Updating an unknown user will throw a NotFoundError", async () => {
		expect(() =>
			updateUser(v4(), {
				username: "unknown",
				password: "1234567890",
			}),
		).toThrowError(NotFoundError);
	});

	test("Deleting an unknown user will throw a NotFoundError", async () => {
		expect(() => deleteUser(v4())).toThrowError(NotFoundError);
	});

	test("Delete a user", async () => {
		const users = await getUsers();
		const user = await deleteUser(users[0]?.id ?? "");
		expect(user).toBeDefined();
	});

	describe("Sensitive data", () => {
		test("Password is excluded when retrieving all users", async () => {
			const users = await getUsers();
			for (const user of users) {
				expect(user).not.toHaveProperty("password");
			}
		});
		test("Password is excluded when retrieving a user", async () => {
			const users = await getUsers();
			const user = await getUser(users[0]?.id ?? "");
			expect(user).not.toHaveProperty("password");
		});
		test("Password is excluded when creating a user", async () => {
			const user = await createUser({
				username: "post@test.com",
				password: "1234567890",
			});
			expect(user).not.toHaveProperty("password");
		});
		test("Password is excluded when updating a user", async () => {
			const users = await getUsers();
			const response = await updateUser(users[0]?.id ?? "", {
				username: "patch@test.com",
				password: "1234567890",
			});
			expect(response).not.toHaveProperty("password");
		});
	});
});
