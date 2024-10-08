import { Hono } from "hono";
import {
	createAddress,
	deleteAddress,
	getAddress,
	getAddresses,
	updateAddress,
} from "../services/addresses.js";
import type { Environment } from "../utility/types.js";

export const addresses = new Hono<Environment>();

addresses.post("/", async (c) => {
	const address = await createAddress(await c.req.json());
	return c.json(
		{
			data: address,
		},
		201,
	);
});

addresses.get("/", async (c) => {
	const addresses = await getAddresses(c.req.query());
	return c.json(
		{
			data: addresses,
		},
		200,
	);
});

addresses.get("/:id", async (c) => {
	const id = c.req.param("id");
	const address = await getAddress(id);
	return c.json(
		{
			data: address,
		},
		200,
	);
});

addresses.patch("/:id", async (c) => {
	const id = c.req.param("id");
	const address = await updateAddress(id, await c.req.json());
	return c.json(
		{
			data: address,
		},
		200,
	);
});

addresses.delete("/:id", async (c) => {
	const id = c.req.param("id");
	const address = await deleteAddress(id);
	return c.json(
		{
			data: address,
		},
		200,
	);
});
