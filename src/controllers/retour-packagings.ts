import { Hono } from "hono";
import {
	create_retour_packaging,
	delete_retour_packaging,
	get_retour_packaging,
	get_retour_packagings,
	update_retour_packaging,
} from "../services/retour-packagings.js";
import type { Environment } from "../utility/types.js";

export const retour_packagings = new Hono<Environment>();

retour_packagings.post("/", async (c) => {
	const retour_packaging = await create_retour_packaging(await c.req.json());
	return c.json(
		{
			data: retour_packaging,
		},
		201,
	);
});

retour_packagings.get("/", async (c) => {
	const retour_packagings = await get_retour_packagings();
	return c.json(
		{
			data: retour_packagings,
		},
		200,
	);
});

retour_packagings.get("/:id", async (c) => {
	const id = c.req.param("id");
	const retour_packaging = await get_retour_packaging(id);
	return c.json(
		{
			data: retour_packaging,
		},
		200,
	);
});

retour_packagings.patch("/:id", async (c) => {
	const id = c.req.param("id");
	const retour_packaging = await update_retour_packaging(
		id,
		await c.req.json(),
	);
	return c.json(
		{
			data: retour_packaging,
		},
		200,
	);
});

retour_packagings.delete("/:id", async (c) => {
	const id = c.req.param("id");
	const retour_packaging = await delete_retour_packaging(id);
	return c.json(
		{
			data: retour_packaging,
		},
		200,
	);
});
