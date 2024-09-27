import { Hono } from "hono";
import {
	createOrder,
	deleteOrder,
	getOrder,
	getOrders,
	updateOrder,
} from "../services/orders.service";

const app = new Hono();

app.post("/", async (c) => {
	const order = await createOrder(await c.req.json());
	return c.json(
		{
			value: [order],
		},
		201,
	);
});

app.get("/", async (c) => {
	const orders = await getOrders();
	return c.json(
		{
			value: orders,
		},
		200,
	);
});

app.get("/:id", async (c) => {
	const id = c.req.param("id");
	const order = await getOrder(id);
	return c.json(
		{
			value: [order],
		},
		200,
	);
});

app.patch("/:id", async (c) => {
	const id = c.req.param("id");
	const order = await updateOrder(id, await c.req.json());
	return c.json(
		{
			value: [order],
		},
		200,
	);
});

app.delete("/:id", async (c) => {
	const id = c.req.param("id");
	const order = await deleteOrder(id);
	return c.json(
		{
			value: [order],
		},
		200,
	);
});
