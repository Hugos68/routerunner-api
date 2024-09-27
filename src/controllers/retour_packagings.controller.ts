import { Hono } from "hono";
import {
	createRetourPackaging,
	deleteRetourPackaging,
	getRetourPackaging,
	getRetourPackagings,
	updateRetourPackaging,
} from "../services/retour_packagings.service";
import type { Environment } from "../utility/types.js";

export const retourEmballage = new Hono<Environment>();

retourEmballage.post("/", async (c) => {
	const retourEmballage = await createRetourPackaging(await c.req.json());
	return c.json(
		{
			value: [retourEmballage],
		},
		201,
	);
});

retourEmballage.get("/", async (c) => {
	const retourEmballages = await getRetourPackagings();
	return c.json(
		{
			value: retourEmballages,
		},
		200,
	);
});

retourEmballage.get("/:id", async (c) => {
	const id = c.req.param("id");
	const retourEmballages = await getRetourPackaging(id);
	return c.json(
		{
			value: [retourEmballages],
		},
		200,
	);
});

retourEmballage.patch("/:id", async (c) => {
	const id = c.req.param("id");
	const retourEmballages = await updateRetourPackaging(id, await c.req.json());
	return c.json(
		{
			value: [retourEmballages],
		},
		200,
	);
});

retourEmballage.delete("/:id", async (c) => {
	const id = c.req.param("id");
	const retourEmballages = await deleteRetourPackaging(id);
	return c.json(
		{
			value: [retourEmballages],
		},
		200,
	);
});
