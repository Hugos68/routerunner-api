import { describe, expect, test } from "bun:test";
import * as uuid from "uuid";
import {
	create_user,
	delete_user,
	get_user,
	get_users,
	update_user,
} from "../src/services/users";
import { NotFoundError } from "../src/utility/errors";

describe("Users", () => {
	test("Create a user", async () => {
		const user = await create_user({
			username: "test",
			password: "1234567890",
		});
		expect(user).toBeDefined();
	});

	test("Get all users", async () => {
		const users = await get_users();
		expect(users).toBeInstanceOf(Array);
		expect(users.length).toBeGreaterThan(0);
	});

	test("Get a user", async () => {
		const users = await get_users();
		const user = await get_user(users[0]?.id ?? "");
		expect(user).toBeDefined();
	});

	test("Getting an unknown user will throw a NotFoundError", async () => {
		expect(() => get_user(uuid.v4())).toThrowError(NotFoundError);
	});

	test("Updating an unknown user will throw a NotFoundError", async () => {
		expect(() =>
			update_user(uuid.v4(), {
				username: "unknown",
				password: "1234567890",
			}),
		).toThrowError(NotFoundError);
	});

	test("Updating an unknown user will throw a NotFoundError", async () => {
		expect(() =>
			update_user(uuid.v4(), {
				username: "unknown",
				password: "1234567890",
			}),
		).toThrowError(NotFoundError);
	});

	test("Deleting an unknown user will throw a NotFoundError", async () => {
		expect(() => delete_user(uuid.v4())).toThrowError(NotFoundError);
	});

	test("Delete a user", async () => {
		const users = await get_users();
		const user = await delete_user(users[0]?.id ?? "");
		expect(user).toBeDefined();
	});

	describe("Sensitive data", () => {
		test("Password is excluded when retrieving all users", async () => {
			const users = await get_users();
			for (const user of users) {
				expect(user).not.toHaveProperty("password");
			}
		});
		test("Password is excluded when retrieving a user", async () => {
			const users = await get_users();
			const user = await get_user(users[0]?.id ?? "");
			expect(user).not.toHaveProperty("password");
		});
		test("Password is excluded when creating a user", async () => {
			const user = await create_user({
				username: "post@test.com",
				password: "1234567890",
			});
			expect(user).not.toHaveProperty("password");
		});
		test("Password is excluded when updating a user", async () => {
			const users = await get_users();
			const response = await update_user(users[0]?.id ?? "", {
				username: "patch@test.com",
				password: "1234567890",
			});
			expect(response).not.toHaveProperty("password");
		});
	});
});
