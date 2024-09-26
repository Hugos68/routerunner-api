import { Hono } from "hono";
import user from "./controllers/user.js";

const app = new Hono().basePath("/api/v1");

app.route("/users", user);

export default app;
