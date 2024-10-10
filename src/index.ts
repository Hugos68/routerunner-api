import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { users } from "./controllers/users.ts";

const app = new OpenAPIHono().basePath("/api/v1");

/**
 * Middleware
 */
app.use(logger());
app.use("/*", cors());

/**
 * Routes
 */
app.route("/users", users);

/**
 * Swagger UI/OpenAPI
 */
app.doc("/doc", {
	openapi: "3.0.0",
	info: {
		title: "Routerunner API",
		version: "0.0.1",
	},
});
app.get("/ui", swaggerUI({ url: "/api/v1/doc" }));

// biome-ignore lint/style/noDefaultExport: Required to run the app
export default app;
