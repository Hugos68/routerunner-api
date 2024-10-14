import { beforeEach, describe, expect, it } from "bun:test";
// biome-ignore lint/style/noNamespaceImport: <explanation>
import * as uuid from "uuid";
import {
	createLine,
	deleteLine,
	getLine,
	getLines,
	updateLine,
} from "../src/services/lines.ts";
import type { Line } from "../src/types/line.ts";
import {
	ResourceNotFoundError,
	UnauthorizedError,
} from "../src/utility/errors.ts";
import { seedDatabase } from "./seed.ts";

let seedData: Awaited<ReturnType<typeof seedDatabase>>;

beforeEach(async () => {
	seedData = await seedDatabase();
});

describe.skip("Lines Service Tests", () => {
	it("should get all lines as an admin", async () => {
		const adminActor = { ...seedData.admin, role: seedData.adminRole };

		const lines = await getLines(adminActor, {});
		expect(lines).toBeDefined();
		expect(lines.length).toBeGreaterThan(0);
	});

	it("should get a line by ID as a planner", async () => {
		const plannerActor = { ...seedData.planner, role: seedData.plannerRole };
		const lineId = seedData.line.id;

		const line = await getLine(plannerActor, lineId);
		expect(line).toBeDefined();
		expect(line.id).toBe(lineId);
	});

	it("should create a new line as an admin", async () => {
		const adminActor = { ...seedData.admin, role: seedData.adminRole };
		const lineToCreate = {
			quantity: 10,
			packageType: "Europallet",
			palletId: "P006",
			productName: "Product 1",
			orderId: seedData.order.id,
		};

		const createdLine: Line = await createLine(adminActor, lineToCreate);
		expect(createdLine).toBeDefined();
		expect(createdLine.quantity).toBe(10);
	});

	it("should update a line as a planner", async () => {
		const plannerActor = { ...seedData.planner, role: seedData.plannerRole };
		const lineId = seedData.line.id;
		const lineToUpdate = { quantity: 99, packageType: "Europallet" };

		const updatedLine = await updateLine(plannerActor, lineId, lineToUpdate);
		expect(updatedLine).toBeDefined();
		expect(updatedLine.quantity).toBe(99);
	});

	it("should delete a line as an admin", async () => {
		const adminActor = { ...seedData.admin, role: seedData.adminRole };
		const lineId = seedData.line.id;

		const line = await deleteLine(adminActor, lineId);

		expect(line).toBeDefined();
	});

	it("should throw UnauthorizedError when a driver tries to create a line", async () => {
		const driverActor = { ...seedData.driver, role: seedData.driverRole };
		const lineToCreate = {
			quantity: 10,
			packageType: "Europallet",
			palletId: "P006",
			productName: "Product 1",
			orderId: seedData.order.id,
		};

		await expect(createLine(driverActor, lineToCreate)).rejects.toThrow(
			UnauthorizedError,
		);
	});

	it("should throw ResourceNotFoundError when getting a nonexistent line", async () => {
		const adminActor = { ...seedData.admin, role: seedData.adminRole };
		const nonexistentLineId = uuid.v4();

		await expect(getLine(adminActor, nonexistentLineId)).rejects.toThrow(
			ResourceNotFoundError,
		);
	});
});
