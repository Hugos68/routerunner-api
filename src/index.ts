import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import users from "./controllers/users.ts";
import { authentication } from "./middleware/authentication.ts";
import type { Environment } from "./types/environment.ts";

const app = new OpenAPIHono<Environment>().basePath("/api/v1");

/**
 * Middleware
 */
app.use(logger());
app.use("*", cors());
app.use(authentication);

/**
 * Routes
 */
app.route("/users", users);

/**
 * OpenAPI
 */
app.doc("/doc", {
	openapi: "3.0.0",
	info: {
		title: "Routerunner API",
		version: "0.0.1",
	},
});

/**
 * Swagger UI
 */
app.get("/ui", swaggerUI({ url: "/api/v1/doc" }));

export default app;
