import { Hono } from "hono";
import {
	createAddress,
	deleteAddress,
	getAddress,
	getAddresses,
	updateAddress,
} from "../services/addresses.service";

const app = new Hono();

app.get("/", async (c) => {
	const addresses = await getAddresses();
	return c.json(
		{
			value: addresses,
		},
		200,
	);
});

app.get("/:id", async (c) => {
	const id = c.req.param("id");
	const address = await getAddress(id);
	return c.json(
		{
			value: [address],
		},
		200,
	);
});

app.post("/", async (c) => {
	const address = await createAddress(await c.req.json());
	return c.json(
		{
			value: [address],
		},
		201,
	);
});

app.patch("/:id", async (c) => {
	const id = c.req.param("id");
	const address = await updateAddress(id, await c.req.json());
	return c.json(
		{
			value: [address],
		},
		200,
	);
});

app.delete("/:id", async (c) => {
	const id = c.req.param("id");
	const address = await deleteAddress(id);
	return c.json(
		{
			value: [address],
		},
		200,
	);
});

export default app;
