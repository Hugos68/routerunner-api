import { Hono } from "hono";
import {
	createRetourEmballage,
	deleteRetourEmballage,
	getRetourEmballage,
	getRetourEmballages,
	updateRetourEmballage,
} from "../services/retour_emballage.service";

export const retourEmballage = new Hono();

retourEmballage.post("/", async (c) => {
	const retour_emballage = await createRetourEmballage(await c.req.json());
	return c.json(
		{
			value: [retour_emballage],
		},
		201,
	);
});

retourEmballage.get("/", async (c) => {
	const retour_emballages = await getRetourEmballages();
	return c.json(
		{
			value: retour_emballages,
		},
		200,
	);
});

retourEmballage.get("/:id", async (c) => {
	const id = c.req.param("id");
	const retour_emballage = await getRetourEmballage(id);
	return c.json(
		{
			value: [retour_emballage],
		},
		200,
	);
});

retourEmballage.patch("/:id", async (c) => {
	const id = c.req.param("id");
	const retour_emballage = await updateRetourEmballage(id, await c.req.json());
	return c.json(
		{
			value: [retour_emballage],
		},
		200,
	);
});

retourEmballage.delete("/:id", async (c) => {
	const id = c.req.param("id");
	const retour_emballage = await deleteRetourEmballage(id);
	return c.json(
		{
			value: [retour_emballage],
		},
		200,
	);
});
