import { Hono } from "hono";
import {
	create_address,
	delete_address,
	get_address,
	get_addresses,
	update_address,
} from "../services/addresses.js";
import type { Environment } from "../utility/types.js";

export const addresses = new Hono<Environment>();

addresses.get("/", async (c) => {
	const addresses = await get_addresses();
	return c.json(
		{
			data: addresses,
		},
		200,
	);
});

addresses.get("/:id", async (c) => {
	const id = c.req.param("id");
	const address = await get_address(id);
	return c.json(
		{
			data: address,
		},
		200,
	);
});

addresses.post("/", async (c) => {
	const address = await create_address(await c.req.json());
	return c.json(
		{
			data: address,
		},
		201,
	);
});

addresses.patch("/:id", async (c) => {
	const id = c.req.param("id");
	const address = await update_address(id, await c.req.json());
	return c.json(
		{
			data: address,
		},
		200,
	);
});

addresses.delete("/:id", async (c) => {
	const id = c.req.param("id");
	const address = await delete_address(id);
	return c.json(
		{
			data: address,
		},
		200,
	);
});
