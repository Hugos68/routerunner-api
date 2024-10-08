import { describe, expect, test } from "bun:test";
import { v4 } from "uuid";
import {
	createOrder,
	deleteOrder,
	getOrder,
	getOrders,
	updateOrder,
} from "../src/services/orders.ts";
import { NotFoundError } from "../src/utility/errors.ts";

describe("Orders", () => {
	test("Create an order", async () => {
		const orders = await getOrders();
		const order = await createOrder({
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
		const orders = await getOrders();
		expect(orders).toBeInstanceOf(Array);
		expect(orders.length).toBeGreaterThan(0);
	});
	test("Get an order", async () => {
		const orders = await getOrders();
		const order = await getOrder(orders[0]?.id ?? "");
		expect(order).toBeDefined();
	});
	test("Getting an unknown order will throw a NotFoundError", async () => {
		expect(() => getOrder(v4())).toThrowError(NotFoundError);
	});

	test("Updating an unknown order will throw a NotFoundError", async () => {
		expect(() =>
			updateOrder(v4(), {
				quantity: 1,
				packageType: "box",
				unloadingAddress: v4(),
				unloadingDateTime: new Date().toDateString(),
				deliveryInstructions: "test",
				status: "OPEN",
			}),
		).toThrowError(NotFoundError);
	});

	test("Updating an order", async () => {
		const orders = await getOrders();
		const order = await updateOrder(orders[0]?.id ?? "", {
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
		expect(() => deleteOrder(v4())).toThrowError(NotFoundError);
	});

	test("Delete an order", async () => {
		const orders = await getOrders();
		const order = await deleteOrder(orders[0]?.id ?? "");
		expect(order).toBeDefined();
	});
});
