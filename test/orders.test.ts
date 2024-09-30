import { describe, expect, test } from "bun:test";
import {
	create_order,
	delete_order,
	get_order,
	get_orders,
	update_order,
} from "../src/services/orders";
import * as uuid from "uuid";
import { NotFoundError } from "../src/utility/errors";
import { or } from "drizzle-orm";

describe("Orders", () => {
	test("Create an order", async () => {
		const orders = await get_orders();
		const order = await create_order({
			quantity: 1,
			packageType: "box",
			unloadingAddress: orders[0]?.unloadingAddress ?? "",
			unloadingDateTime: new Date().toDateString(),
			deliveryInstructions: "test",
			status: "OPEN",
		});
		expect(order).toBeDefined();
	});

	test("Get all orders", async () => {
		const orders = await get_orders();
		expect(orders).toBeInstanceOf(Array);
		expect(orders.length).toBeGreaterThan(0);
	});
	test("Get an order", async () => {
		const orders = await get_orders();
		const order = await get_order(orders[0]?.id ?? "");
		expect(order).toBeDefined();
	});
	test("Getting an unknown order will throw a NotFoundError", async () => {
		expect(() => get_order(uuid.v4())).toThrowError(NotFoundError);
	});

	test("Updating an unknown order will throw a NotFoundError", async () => {
		expect(() =>
			update_order(uuid.v4(), {
				quantity: 1,
				packageType: "box",
				unloadingAddress: uuid.v4(),
				unloadingDateTime: new Date().toDateString(),
				deliveryInstructions: "test",
				status: "OPEN",
			}),
		).toThrowError(NotFoundError);
	});

	test("Updating an order", async () => {
		const orders = await get_orders();
		const order = await update_order(orders[0]?.id ?? "", {
			quantity: 1,
			packageType: "box",
			unloadingAddress: orders[0]?.unloadingAddress ?? "",
			unloadingDateTime: new Date().toDateString(),
			deliveryInstructions: "test",
			status: "GESLOTEN",
		});
		expect(order).toBeDefined();
	});

	test("Deleting an unknown order will throw a NotFoundError", async () => {
		expect(() => delete_order(uuid.v4())).toThrowError(NotFoundError);
	});

	test("Delete an order", async () => {
		const orders = await get_orders();
		const order = await delete_order(orders[0]?.id ?? "");
		expect(order).toBeDefined();
	});
});
