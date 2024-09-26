import { eq } from "drizzle-orm";
import { type Output, pick } from "valibot";
import { database } from "../database/database.js";
import { type Order, order } from "../database/tables/order.js";

export async function createOrder(data: Omit<Order, "id">) {
	return await database.insert(order).values(data).returning();
}

export async function getOrder(id: Order["id"]) {
	return await database.select().from(order).where(eq(order.id, id));
}

export async function getOrders() {
	return await database.select().from(order);
}

export async function updateOrder(
	id: Order["id"],
	data: Partial<Omit<Order, "id">>,
) {
	return await database
		.update(order)
		.set(data)
		.where(eq(order.id, id))
		.returning();
}

export async function deleteOrder(id: Order["id"]) {
	return await database.delete(order).where(eq(order.id, id)).returning();
}
