import { eq } from "drizzle-orm";
import { parse } from "valibot";
import { database } from "../database/database.js";
import {
	CreateOrderSchema,
	type Order,
	orders,
	updateOrderSchema,
} from "../database/models/orders.model.js";
import { NotFoundError } from "../utility/errors.js";

export const createOrder = async (input: unknown) => {
	const values = parse(CreateOrderSchema, input);
	const [result] = await database.insert(orders).values(values).returning();
	return result;
};

export const getOrders = async () => {
	const result = await database.select().from(orders);
	return result;
};

export const getOrder = async (id: Order["id"]) => {
	const [result] = await database
		.select()
		.from(orders)
		.where(eq(orders.id, id));
	if (result === undefined) {
		throw new NotFoundError(`Order with id ${id} not found`);
	}
	return result;
};

export const updateOrder = async (id: Order["id"], input: unknown) => {
	const values = parse(updateOrderSchema, input);
	const [result] = await database
		.update(orders)
		.set(values)
		.where(eq(orders.id, id))
		.returning();
	if (result === undefined) {
		throw new NotFoundError(`Order with id ${id} not found`);
	}
	return result;
};

export const deleteOrder = async (id: Order["id"]) => {
	const [result] = await database.delete(orders).where(eq(orders.id, id));
	if (result === undefined) {
		throw new NotFoundError(`Order with id ${id} not found`);
	}
	return result;
};
