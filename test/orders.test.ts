import { describe, expect, it } from "bun:test";
// biome-ignore lint/style/noNamespaceImport: <explanation>
import * as uuid from "uuid";
import {
	createOrder,
	deleteOrder,
	getOrder,
	getOrders,
	updateOrder,
} from "../src/services/orders.ts";
import type { Order } from "../src/types/order.ts";
import {
	ResourceNotFoundError,
	UnauthorizedError,
} from "../src/utility/errors.ts";
import { seedData } from "./setup.ts";

describe("Orders Service Tests", () => {
	it("should get all orders as an admin", async () => {
		const adminActor = { ...seedData.admin, role: seedData.adminRole };
		const orders = await getOrders(adminActor, {});
		expect(orders).toBeDefined();
		expect(orders.length).toBeGreaterThan(0);
	});
	it("should get an order by ID as a planner", async () => {
		const plannerActor = { ...seedData.planner, role: seedData.plannerRole };
		const orderId = seedData.order.id;
		const order = await getOrder(plannerActor, orderId);
		expect(order).toBeDefined();
		expect(order.id).toBe(orderId);
	});
	it("should create a new order as an admin", async () => {
		const adminActor = { ...seedData.admin, role: seedData.adminRole };
		const orderToCreate = {
			quantity: 10,
			packageType: "Europallet",
			unloadingAddress: seedData.order.unloadingAddress,
			loadingAddress: seedData.address.id,
			status: "OPEN" as const,
			deliveryInstructions: "Handle with care",
			tripId: seedData.trip.id,
			unloadingDateTime: new Date().toDateString(),
		};
		const createdOrder: Order = await createOrder(adminActor, orderToCreate);
		expect(createdOrder).toBeDefined();
		expect(createdOrder.quantity).toBe(10);
	});
	it("should update an order as a planner", async () => {
		const plannerActor = { ...seedData.planner, role: seedData.plannerRole };
		const orderId = seedData.order.id;
		const orderToUpdate = { quantity: 20 };
		const updatedOrder = await updateOrder(
			plannerActor,
			orderId,
			orderToUpdate,
		);
		expect(updatedOrder).toBeDefined();
		expect(updatedOrder.quantity).toBe(20);
	});
	it("should delete an order as an admin", async () => {
		const adminActor = { ...seedData.admin, role: seedData.adminRole };
		const orderId = seedData.order.id;
		const order = await deleteOrder(adminActor, orderId);
		await expect(order).toBeDefined();
	});
	it("should throw ResourceNotFoundError when deleting a order as as driver", async () => {
		const driverActor = { ...seedData.driver, role: seedData.driverRole };
		const orderId = seedData.order.id;
		await expect(deleteOrder(driverActor, orderId)).rejects.toThrow(
			ResourceNotFoundError,
		);
	});
	it("should throw UnauthorizedError when a driver tries to create an order", async () => {
		const driverActor = { ...seedData.driver, role: seedData.driverRole };
		const orderToCreate = {
			quantity: 10,
			packageType: "Europallet",
			unloadingAddress: seedData.order.unloadingAddress,
			loadingAddress: seedData.address.id,
			status: "OPEN" as const,
			deliveryInstructions: "Handle with care",
			tripId: seedData.trip.id,
			unloadingDateTime: new Date().toDateString(),
		};
		await expect(createOrder(driverActor, orderToCreate)).rejects.toThrow(
			UnauthorizedError,
		);
	});
	it("should throw ResourceNotFoundError when getting a nonexistent order", async () => {
		const adminActor = { ...seedData.admin, role: seedData.adminRole };
		const nonexistentOrderId = uuid.v4();
		await expect(getOrder(adminActor, nonexistentOrderId)).rejects.toThrow(
			ResourceNotFoundError,
		);
	});
});
