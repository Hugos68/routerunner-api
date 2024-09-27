import { Hono } from "hono";
import {
	createRetourEmballage,
	deleteRetourEmballage,
	getRetourEmballage,
	getRetourEmballages,
	updateRetourEmballage,
} from "../services/retour_emballage.service";

const app = new Hono();

app.post("/", async (c) => {
	const retour_emballage = await createRetourEmballage(await c.req.json());
	return c.json(
		{
			value: [retour_emballage],
		},
		201,
	);
});

app.get("/", async (c) => {
	const retour_emballages = await getRetourEmballages();
	return c.json(
		{
			value: retour_emballages,
		},
		200,
	);
});

app.get("/:id", async (c) => {
	const id = c.req.param("id");
	const retour_emballage = await getRetourEmballage(id);
	return c.json(
		{
			value: [retour_emballage],
		},
		200,
	);
});

app.patch("/:id", async (c) => {
	const id = c.req.param("id");
	const retour_emballage = await updateRetourEmballage(id, await c.req.json());
	return c.json(
		{
			value: [retour_emballage],
		},
		200,
	);
});

app.delete("/:id", async (c) => {
	const id = c.req.param("id");
	const retour_emballage = await deleteRetourEmballage(id);
	return c.json(
		{
			value: [retour_emballage],
		},
		200,
	);
});

export default app;
