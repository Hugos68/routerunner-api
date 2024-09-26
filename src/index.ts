import { Hono } from "hono";
import session from "./controllers/session.js";
import user from "./controllers/user.js";

const app = new Hono().basePath("/api/v1");

app.route("/users", user);
app.route("/sessions", session);

export default app;
