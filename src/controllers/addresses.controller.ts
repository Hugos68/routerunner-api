import { Hono } from "hono";
import {
	createAddress,
	deleteAddress,
	getAddress,
	getAddresses,
	updateAddress,
} from "../services/addresses.service";

export const addresses = new Hono();

addresses.get("/", async (c) => {
	const addresses = await getAddresses();
	return c.json(
		{
			value: addresses,
		},
		200,
	);
});

addresses.get("/:id", async (c) => {
	const id = c.req.param("id");
	const address = await getAddress(id);
	return c.json(
		{
			value: [address],
		},
		200,
	);
});

addresses.post("/", async (c) => {
	const address = await createAddress(await c.req.json());
	return c.json(
		{
			value: [address],
		},
		201,
	);
});

addresses.patch("/:id", async (c) => {
	const id = c.req.param("id");
	const address = await updateAddress(id, await c.req.json());
	return c.json(
		{
			value: [address],
		},
		200,
	);
});

addresses.delete("/:id", async (c) => {
	const id = c.req.param("id");
	const address = await deleteAddress(id);
	return c.json(
		{
			value: [address],
		},
		200,
	);
});
