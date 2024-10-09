import { Hono } from "hono";
import { authorization } from "../middleware/authorization.js";
import {
	createRetourPackaging,
	deleteRetourPackaging,
	getRetourPackaging,
	getRetourPackagings,
	updateRetourPackaging,
} from "../services/retour-packagings.js";
import { RouterunnerResponse } from "../utility/responses.js";
import type { Environment } from "../utility/types.js";

export const retourPackagings = new Hono<Environment>();

retourPackagings.post(
	"/",
	authorization("DRIVER", "PLANNER", "ADMIN"),
	async (c) => {
		const retourPackaging = await createRetourPackaging(await c.req.json());
		return c.json(RouterunnerResponse.data(retourPackaging), 201);
	},
);

retourPackagings.get(
	"/",
	authorization("DRIVER", "PLANNER", "ADMIN"),
	async (c) => {
		const retourPackagings = await getRetourPackagings(c.req.query());
		return c.json(RouterunnerResponse.data(retourPackagings), 200);
	},
);

retourPackagings.get(
	"/:id",
	authorization("DRIVER", "PLANNER", "ADMIN"),
	async (c) => {
		const id = c.req.param("id");
		const retourPackaging = await getRetourPackaging(id);
		return c.json(RouterunnerResponse.data(retourPackaging), 200);
	},
);

retourPackagings.patch(
	"/:id",
	authorization("DRIVER", "PLANNER", "ADMIN"),
	async (c) => {
		const id = c.req.param("id");
		const retourPackaging = await updateRetourPackaging(id, await c.req.json());
		return c.json(RouterunnerResponse.data(retourPackaging), 200);
	},
);

retourPackagings.delete(
	"/:id",
	authorization("DRIVER", "PLANNER", "ADMIN"),
	async (c) => {
		const id = c.req.param("id");
		const retourPackaging = await deleteRetourPackaging(id);
		return c.json(RouterunnerResponse.data(retourPackaging), 200);
	},
);
