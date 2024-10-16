import { and, eq } from "drizzle-orm";
import { database } from "../database/database.ts";
import { ordersTable } from "../database/tables/orders.ts";
import type { Actor } from "../types/actor.ts";
import type {
	Order,
	OrderQuery,
	OrderToCreate,
	OrderToUpdate,
} from "../types/order.ts";
import { authorize } from "../utility/authorize.ts";
import { createFilterConditions } from "../utility/create-filter-conditions.ts";
import { ResourceNotFoundError, UnauthorizedError } from "../utility/errors.ts";

export const getOrders = async (actor: Actor, query: OrderQuery) => {
	authorize(actor)
		.hasRole("DRIVER", "PLANNER", "ADMIN")
		.orElseThrow(new UnauthorizedError());
	const orders = await database
		.select()
		.from(ordersTable)
		.where(and(...createFilterConditions(query, ordersTable)));
	return orders;
};

export const getOrder = async (actor: Actor, id: Order["id"]) => {
	authorize(actor)
		.hasRole("DRIVER", "PLANNER", "ADMIN")
		.orElseThrow(new ResourceNotFoundError());
	const [order] = await database
		.select()
		.from(ordersTable)
		.where(eq(ordersTable.id, id));
	if (order === undefined) {
		throw new ResourceNotFoundError();
	}
	return order;
};

export const createOrder = async (
	actor: Actor,
	orderToCreate: OrderToCreate,
) => {
	authorize(actor)
		.hasRole("PLANNER", "ADMIN")
		.orElseThrow(new UnauthorizedError());
	const [order] = await database
		.insert(ordersTable)
		.values(orderToCreate)
		.returning();
	if (order === undefined) {
		throw new Error("Failed to create order");
	}
	return order;
};

export const updateOrder = async (
	actor: Actor,
	id: Order["id"],
	orderToUpdate: OrderToUpdate,
) => {
	authorize(actor)
		.hasRole("DRIVER", "PLANNER", "ADMIN")
		.orElseThrow(new ResourceNotFoundError());
	const [order] = await database
		.update(ordersTable)
		.set(orderToUpdate)
		.where(eq(ordersTable.id, id))
		.returning();
	if (order === undefined) {
		throw new Error("Failed to update order");
	}
	return order;
};

export const deleteOrder = async (actor: Actor, id: Order["id"]) => {
	authorize(actor)
		.hasRole("ADMIN", "PLANNER")
		.orElseThrow(new ResourceNotFoundError());
	const [order] = await database
		.delete(ordersTable)
		.where(eq(ordersTable.id, id))
		.returning();
	if (order === undefined) {
		throw new Error("Failed to delete order");
	}
	return order;
};
