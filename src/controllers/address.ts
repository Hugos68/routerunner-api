import { Hono } from "hono";
import {
	insertAddressSchema,
	updateAddressSchema,
} from "../database/tables/address";
import { createRequestValidator } from "../helpers/request-validator";
import {
	createAddress,
	deleteAddress,
	getAddress,
	getAddresses,
	updateAddress,
} from "../services/address";

const app = new Hono();

app.get("/", async (c) => {
	const addresses = await getAddresses();
	return c.json(addresses, 200);
});

app.get("/:id", async (c) => {
	const id = c.req.param("id");
	const address = await getAddress(id);
	return c.json(address, 200);
});

app.post("/", createRequestValidator(insertAddressSchema), async (c) => {
	const address = c.req.valid("json");
	const result = await createAddress(address);
	return c.json(result, 201);
});

app.patch("/:id", createRequestValidator(updateAddressSchema), async (c) => {
	const id = c.req.param("id");
	const address = c.req.valid("json");
	const result = await updateAddress(id, address);
	return c.json(result, 200);
});

app.delete("/:id", async (c) => {
	const id = c.req.param("id");
	const result = await deleteAddress(id);
	return c.json(result, 200);
});

export default app;
