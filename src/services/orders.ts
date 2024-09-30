import { eq } from "drizzle-orm";
import { parse } from "valibot";
import { database } from "../database/database.js";
import {
	CreateOrderSchema,
	type Order,
	UpdateOrderSchema,
	orders_table,
} from "../database/schema.js";
import { NotFoundError } from "../utility/errors.js";

export const create_order = async (input: unknown) => {
	const values = parse(CreateOrderSchema, input);
	const [order] = await database
		.insert(orders_table)
		.values(values)
		.returning();
	if (order === undefined) {
		throw new Error("Failed to create order");
	}
	return order;
};

export const get_orders = async () => {
	const orders = await database.select().from(orders_table);
	return orders;
};

export const get_order = async (id: Order["id"]) => {
	const [order] = await database
		.select()
		.from(orders_table)
		.where(eq(orders_table.id, id));
	if (order === undefined) {
		throw new NotFoundError(`Order with id ${id} not found`);
	}
	return order;
};

export const update_order = async (id: Order["id"], input: unknown) => {
	const values = parse(UpdateOrderSchema, input);
	const [order] = await database
		.update(orders_table)
		.set(values)
		.where(eq(orders_table.id, id))
		.returning();
	if (order === undefined) {
		throw new NotFoundError(`Order with id ${id} not found`);
	}
	return order;
};

export const delete_order = async (id: Order["id"]) => {
	const [order] = await database
		.delete(orders_table)
		.where(eq(orders_table.id, id))
		.returning();
	if (order === undefined) {
		throw new NotFoundError(`Order with id ${id} not found`);
	}
	return order;
};
