import { and, eq } from "drizzle-orm";
import { parse } from "valibot";
import { database } from "../database/database.js";
import {
	CreateOrderSchema,
	type Order,
	UpdateOrderSchema,
	ordersTable,
} from "../database/schema.js";
import { createFilterConditions } from "../utility/create-filter-conditions.js";
import { NotFoundError } from "../utility/errors.js";

export const createOrder = async (input: unknown) => {
	const values = parse(CreateOrderSchema, input);
	const [order] = await database.insert(ordersTable).values(values).returning();
	if (order === undefined) {
		throw new Error("Failed to create order");
	}
	return order;
};

export const getOrders = async (filter: Record<string, unknown> = {}) => {
	const conditions = createFilterConditions(filter, ordersTable);
	const orders = await database
		.select()
		.from(ordersTable)
		.where(and(...conditions));
	return orders;
};

export const getOrder = async (id: Order["id"]) => {
	const [order] = await database
		.select()
		.from(ordersTable)
		.where(eq(ordersTable.id, id));
	if (order === undefined) {
		throw new NotFoundError(`Order with id ${id} not found`);
	}
	return order;
};

export const updateOrder = async (id: Order["id"], input: unknown) => {
	const values = parse(UpdateOrderSchema, input);
	const [order] = await database
		.update(ordersTable)
		.set(values)
		.where(eq(ordersTable.id, id))
		.returning();
	if (order === undefined) {
		throw new NotFoundError(`Order with id ${id} not found`);
	}
	return order;
};

export const deleteOrder = async (id: Order["id"]) => {
	const [order] = await database
		.delete(ordersTable)
		.where(eq(ordersTable.id, id))
		.returning();
	if (order === undefined) {
		throw new NotFoundError(`Order with id ${id} not found`);
	}
	return order;
};
