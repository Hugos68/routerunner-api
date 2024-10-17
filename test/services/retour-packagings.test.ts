import { describe, expect, it } from "bun:test";
import { v4 } from "uuid";
import {
	createRetourPackaging,
	deleteRetourPackaging,
	getRetourPackaging,
	getRetourPackagings,
	updateRetourPackaging,
} from "../../src/services/retour-packagings.ts";
import type { RetourPackaging } from "../../src/types/retour-packaging.ts";
import { ResourceNotFoundError } from "../../src/utility/errors.ts";
import { seedData } from "../setup.ts";

describe("Retour Packagings Service Tests", () => {
	it("should get all retour packagings as an admin", async () => {
		const adminActor = { ...seedData.admin, role: seedData.adminRole };
		const retourPackagings = await getRetourPackagings(adminActor, {});
		expect(retourPackagings).toBeDefined();
		expect(retourPackagings.length).toBeGreaterThan(0);
	});
	it("should get a retour packaging by ID as a planner", async () => {
		const plannerActor = { ...seedData.planner, role: seedData.plannerRole };
		const retourPackagingId = seedData.retourPackaging.id;
		const retourPackaging = await getRetourPackaging(
			plannerActor,
			retourPackagingId,
		);
		expect(retourPackaging).toBeDefined();
		expect(retourPackaging.id).toBe(retourPackagingId);
	});

	it("should create a new retour packaging as a driver", async () => {
		const driverActor = { ...seedData.driver, role: seedData.driverRole };
		const retourPackagingToCreate = {
			quantity: 10,
			packageType: "Pallet",
			orderId: seedData.order.id,
		};
		const createdRetourPackaging: RetourPackaging = await createRetourPackaging(
			driverActor,
			retourPackagingToCreate,
		);
		expect(createdRetourPackaging).toBeDefined();
		expect(createdRetourPackaging.packageType).toBe("Pallet");
	});
	it("should update a retour packaging as a planner", async () => {
		const plannerActor = { ...seedData.planner, role: seedData.plannerRole };
		const retourPackagingId = seedData.retourPackaging.id;
		const retourPackagingToUpdate = {
			quantity: 99,
			packageType: "Pallet",
		};
		const updatedRetourPackaging = await updateRetourPackaging(
			plannerActor,
			retourPackagingId,
			retourPackagingToUpdate,
		);
		expect(updatedRetourPackaging).toBeDefined();
		expect(updatedRetourPackaging.quantity).toBe(99);
	});
	it("should delete a retour packaging as a driver", async () => {
		const driverActor = { ...seedData.driver, role: seedData.driverRole };
		const retourPackagingId = seedData.retourPackaging.id;
		const retourPackaging = await deleteRetourPackaging(
			driverActor,
			retourPackagingId,
		);
		expect(retourPackaging).toBeDefined();
	});
	it("should throw ResourceNotFoundError when getting a nonexistent retour packaging", () => {
		const adminActor = { ...seedData.admin, role: seedData.adminRole };
		const nonexistentRetourPackagingId = v4();
		expect(
			getRetourPackaging(adminActor, nonexistentRetourPackagingId),
		).rejects.toThrow(ResourceNotFoundError);
	});
});
