import { Hono } from "hono";
import { logger } from "hono/logger";
import { addresses } from "./controllers/addresses.js";
import { lines } from "./controllers/lines.js";
import { notes } from "./controllers/notes.js";
import { orders } from "./controllers/orders.js";
import { retour_packaging } from "./controllers/retour-packagings.js";
import { roles } from "./controllers/roles.js";
import { sessions } from "./controllers/sessions.js";
import { trips } from "./controllers/trips.js";
import { users } from "./controllers/users.js";
import { on_error } from "./handlers/on-error.js";
import { authentication } from "./middleware/authentication.js";
import { cors } from "hono/cors";

const app = new Hono().basePath("/api/v1");

/**
 * Handlers
 */
app.onError(on_error);

/**
 * Middleware
 */
app.use(logger());
app.use(authentication);
app.use(
	"/*",
	cors({
		origin: "*", // Frontend URL (your Flutter app)
		allowMethods: ["GET", "POST", "OPTIONS"], // Allowed HTTP methods
		allowHeaders: ["Content-Type", "Authorization"], // Allowed headers in requests
		exposeHeaders: ["Content-Length", "Authorization"], // Headers you want to expose to the frontend
		credentials: true, // If you need to allow credentials (cookies, authorization headers)
	}),
); /**
 * Routes
 */
app.route("/addresses", addresses);
app.route("/lines", lines);
app.route("/notes", notes);
app.route("/orders", orders);
app.route("/retour-packaging", retour_packaging);
app.route("/roles", roles);
app.route("/sessions", sessions);
app.route("/trips", trips);
app.route("/users", users);

export default app;
