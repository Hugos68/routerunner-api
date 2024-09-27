import { Hono } from "hono";
import users from "./controllers/users.controller.js";
import { onError } from "./handlers/on-error.js";

const app = new Hono().basePath("/api/v1");

/**
 * Handlers
 */
app.onError(onError);

/**
 * Middleware
 */
// TODO

/**
 * Routes
 */
app.route("/users", users);

export default app;
