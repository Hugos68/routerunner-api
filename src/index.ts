import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { logger } from "hono/logger";
import addresses from "./controllers/addresses.ts";
import lines from "./controllers/lines.ts";
import notes from "./controllers/notes.ts";
import orders from "./controllers/orders.ts";
import retourPackagings from "./controllers/retour-packagings.ts";
import roles from "./controllers/roles.ts";
import sessions from "./controllers/sessions.ts";
import trips from "./controllers/trips.ts";
import users from "./controllers/users.ts";
import { notFound } from "./handlers/not-found.ts";
import { onError } from "./handlers/on-error.ts";
import { authentication } from "./middleware/authentication.ts";
import type { Environment } from "./types/environment.ts";
import { SESSION_COOKIE_KEY } from "./utility/constants.ts";

const app = new OpenAPIHono<Environment>().basePath("/api/v1");

/**
 * Middleware
 */
app.use(logger());
app.use(cors());
app.use(authentication);
app.use(csrf());

/**
 * Handlers
 */
app.onError(onError);
app.notFound(notFound);

/**
 * Routes
 */
app.route("/users", users);
app.route("/sessions", sessions);
app.route("/trips", trips);
app.route("/orders", orders);
app.route("/addresses", addresses);
app.route("/lines", lines);
app.route("/notes", notes);
app.route("/retour-packagings", retourPackagings);
app.route("/roles", roles);

/**
 * OpenAPI
 */
app.doc("/doc", {
	openapi: "3.0.0",
	info: {
		title: "Routerunner API",
		version: "0.0.1",
		description: "API documentation for Routerunner",
	},
});
app.openAPIRegistry.registerComponent("securitySchemes", "Session", {
	type: "apiKey",
	scheme: "cookie",
	name: SESSION_COOKIE_KEY,
});

/**
 * Swagger UI
 */
app.get("/ui", swaggerUI({ url: "/api/v1/doc" }));

export default app;
