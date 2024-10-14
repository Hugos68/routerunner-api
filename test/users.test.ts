import { describe, expect, it } from "bun:test";
import { v4 } from "uuid";
import {
	createUser,
	deleteUser,
	getUser,
	getUsers,
	updateUser,
} from "../src/services/users.ts";
import {
	ResourceNotFoundError,
	UnauthorizedError,
} from "../src/utility/errors.ts";
import { seedData } from "./setup.ts";

describe("User Service Tests", () => {
	it("should create a new user as an admin", async () => {
		const adminActor = { ...seedData.admin, role: seedData.adminRole };
		const newUser = {
			username: "newuser",
			password: "password123",
			roleId: seedData.driverRole.id,
		};

		const createdUser = await createUser(adminActor, newUser);
		expect(createdUser).toBeDefined();
		expect(createdUser.username).toBe("newuser");
	});
	it("should get user details for an admin", async () => {
		const adminActor = { ...seedData.admin, role: seedData.adminRole };

		const user = await getUser(adminActor, seedData.driver.id);
		expect(user).toBeDefined();
		expect(user.username).toBe(seedData.driver.username);
	});
	it("should get user details for a driver", async () => {
		const driverActor = { ...seedData.driver, role: seedData.driverRole };

		const user = await getUser(driverActor, seedData.driver.id);
		expect(user).toBeDefined();
		expect(user.username).toBe(seedData.driver.username);
	});
	it("should get all users as an admin", async () => {
		const adminActor = { ...seedData.admin, role: seedData.adminRole };
		const users = await getUsers(adminActor, {});

		expect(users).toBeDefined();
		expect(users.length).toBeGreaterThan(0);
	});
	it("should update user details as an admin", async () => {
		const adminActor = { ...seedData.admin, role: seedData.adminRole };
		const userToUpdate = { username: "updateduser" };

		const updatedUser = await updateUser(
			adminActor,
			seedData.driver.id,
			userToUpdate,
		);
		expect(updatedUser).toBeDefined();
		expect(updatedUser.username).toBe("updateduser");
	});
	it("should delete a user as an admin", async () => {
		const adminActor = { ...seedData.admin, role: seedData.adminRole };
		const deletedUser = await deleteUser(adminActor, seedData.driver.id);
		expect(deletedUser).toBeDefined();
		expect(deletedUser.username).toBe(seedData.driver.username);
	});
	it("should throw UnauthorizedError when a non-admin tries to get users", () => {
		const driverActor = { ...seedData.driver, role: seedData.driverRole };
		expect(getUsers(driverActor, {})).rejects.toThrow(UnauthorizedError);
	});
	it("should throw ResourceNotFoundError when a non-admin tries to update a user", () => {
		const driverActor = { ...seedData.driver, role: seedData.driverRole };
		const userToUpdate = { username: "updateduser" };
		expect(
			updateUser(driverActor, seedData.admin.id, userToUpdate),
		).rejects.toThrow(ResourceNotFoundError);
	});
	it("should throw ResourceNotFoundError when a non-admin tries to delete a user", () => {
		const driverActor = { ...seedData.driver, role: seedData.driverRole };
		expect(deleteUser(driverActor, seedData.admin.id)).rejects.toThrow(
			ResourceNotFoundError,
		);
	});
	it("should throw UnauthorizedError when a non-admin tries to create a user", () => {
		const driverActor = { ...seedData.driver, role: seedData.driverRole };
		const newUser = {
			username: "newuser",
			password: "password123",
			roleId: seedData.driverRole.id,
		};
		expect(createUser(driverActor, newUser)).rejects.toThrow(UnauthorizedError);
	});
	it("should throw ResourceNotFoundError when getting a nonexistent user", () => {
		const adminActor = { ...seedData.admin, role: seedData.adminRole };
		const randomId = v4();
		expect(getUser(adminActor, randomId)).rejects.toThrow(
			ResourceNotFoundError,
		);
	});
});
