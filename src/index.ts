import { Hono } from "hono";
import dogs from "./controllers/dogs.controller..js";

const app = new Hono().basePath("/api/v1");

app.route("/dogs", dogs);

export default app;
