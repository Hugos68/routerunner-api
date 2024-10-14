import { beforeEach, describe, expect, it } from "bun:test";
import * as uuid from "uuid";
import {
	createRole,
	deleteRole,
	getRole,
	getRoles,
} from "../src/services/roles.ts";
import { ResourceNotFoundError } from "../src/utility/errors.ts";
import { seedDatabase } from "./seed.ts";
import type { SeedData } from "./seedDataType.ts";

let seedData: SeedData;

beforeEach(async () => {
	seedData = await seedDatabase();
});

describe("Role Service Tests", () => {
	it("should create a role as an admin", async () => {
		const adminActor = { ...seedData.admin, role: seedData.adminRole };
		await deleteRole(adminActor, seedData.driverRole.id);
		const roleToCreate: { name: "DRIVER" | "PLANNER" | "ADMIN" } = {
			name: "DRIVER",
		};
		const role = await createRole(adminActor, roleToCreate);
		expect(role).toBeDefined();
		expect(role.name).toBe(roleToCreate.name);
	});

	it("should get all roles as an admin", async () => {
		const adminActor = { ...seedData.admin, role: seedData.adminRole };

		const roles = await getRoles(adminActor, {});
		expect(roles).toBeDefined();
		expect(roles.length).toBeGreaterThan(0);
	});

	it("Should get all roles as a planner", async () => {
		const plannerActor = { ...seedData.planner, role: seedData.plannerRole };

		const roles = await getRoles(plannerActor, {});
		expect(roles).toBeDefined();
		expect(roles.length).toBeGreaterThan(0);
	});

	it("Should get all roles as a driver", async () => {
		const driverActor = { ...seedData.driver, role: seedData.driverRole };

		const roles = await getRoles(driverActor, {});
		expect(roles).toBeDefined();
		expect(roles.length).toBeGreaterThan(0);
	});

	it("should get a role by ID as an admin", async () => {
		const adminActor = { ...seedData.admin, role: seedData.adminRole };
		const roleId = seedData.adminRole.id;

		const role = await getRole(adminActor, roleId);
		expect(role).toBeDefined();
		expect(role.name).toBe(seedData.adminRole.name);
	});

	it("should delete a role as an admin", async () => {
		const adminActor = { ...seedData.admin, role: seedData.adminRole };
		const roleId = seedData.driverRole.id;

		const role = await deleteRole(adminActor, roleId);

		expect(role).toBeDefined();
	});

	it("should throw ResourceNotFoundError when getting a nonexistent role", async () => {
		const adminActor = { ...seedData.admin, role: seedData.adminRole };
		const nonexistentRoleId = uuid.v4();

		await expect(getRole(adminActor, nonexistentRoleId)).rejects.toThrow(
			ResourceNotFoundError,
		);
	});
});
