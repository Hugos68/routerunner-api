import { Hono } from "hono";
import {
	createRetourPackaging,
	deleteRetourPackaging,
	getRetourPackaging,
	getRetourPackagings,
	updateRetourPackaging,
} from "../services/retour_packagings.service";

export const retourEmballage = new Hono();

retourEmballage.post("/", async (c) => {
	const retour_emballage = await createRetourPackaging(await c.req.json());
	return c.json(
		{
			value: [retour_emballage],
		},
		201,
	);
});

retourEmballage.get("/", async (c) => {
	const retour_emballages = await getRetourPackagings();
	return c.json(
		{
			value: retour_emballages,
		},
		200,
	);
});

retourEmballage.get("/:id", async (c) => {
	const id = c.req.param("id");
	const retour_emballage = await getRetourPackaging(id);
	return c.json(
		{
			value: [retour_emballage],
		},
		200,
	);
});

retourEmballage.patch("/:id", async (c) => {
	const id = c.req.param("id");
	const retour_emballage = await updateRetourPackaging(id, await c.req.json());
	return c.json(
		{
			value: [retour_emballage],
		},
		200,
	);
});

retourEmballage.delete("/:id", async (c) => {
	const id = c.req.param("id");
	const retour_emballage = await deleteRetourPackaging(id);
	return c.json(
		{
			value: [retour_emballage],
		},
		200,
	);
});
