import { Hono } from "hono";
import {
	create_order,
	delete_order,
	getOrders,
	get_order,
	update_order,
} from "../services/orders.js";
import type { Environment } from "../utility/types.js";

export const orders = new Hono<Environment>();

orders.post("/", async (c) => {
	const order = await create_order(await c.req.json());
	return c.json(
		{
			value: [order],
		},
		201,
	);
});

orders.get("/", async (c) => {
	const orders = await getOrders();
	return c.json(
		{
			value: orders,
		},
		200,
	);
});

orders.get("/:id", async (c) => {
	const id = c.req.param("id");
	const order = await get_order(id);
	return c.json(
		{
			value: [order],
		},
		200,
	);
});

orders.patch("/:id", async (c) => {
	const id = c.req.param("id");
	const order = await update_order(id, await c.req.json());
	return c.json(
		{
			value: [order],
		},
		200,
	);
});

orders.delete("/:id", async (c) => {
	const id = c.req.param("id");
	const order = await delete_order(id);
	return c.json(
		{
			value: [order],
		},
		200,
	);
});
