import { Hono } from "hono";
import { addresses } from "./controllers/addresses.controller.js";
import { lines } from "./controllers/lines.controller.js";
import { notes } from "./controllers/notes.controller.js";
import { orders } from "./controllers/orders.controller.js";
import { retourEmballage } from "./controllers/retour_packagings.controller.js";
import { roles } from "./controllers/roles.controller.js";
import { sessions } from "./controllers/sessions.controller.js";
import { trips } from "./controllers/trips.controller.js";
import { users } from "./controllers/users.controller.js";
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
app.route("/addresses", addresses);
app.route("/lines", lines);
app.route("/notes", notes);
app.route("/orders", orders);
app.route("/retour-packaging", retourEmballage);
app.route("/roles", roles);
app.route("/sessions", sessions);
app.route("/trips", trips);
app.route("/users", users);

export default app;
