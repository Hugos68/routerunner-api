import { Hono } from "hono";
import address from "./controllers/address.js";
import order from "./controllers/order.js";
import session from "./controllers/session.js";
import user from "./controllers/user.js";

const app = new Hono().basePath("/api/v1");

app.route("/users", user);
app.route("/sessions", session);
app.route("/addresses", address);
app.route("/orders", order);

export default app;
