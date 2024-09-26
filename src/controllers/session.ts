import { Hono } from "hono";
import { createRequestValidator } from "../helpers/request-validator";
import { CreateUserSchema } from "../database/tables/user";
import { pick } from "valibot";
import { createSession } from "../services/session";

const app = new Hono();


app.get("/", (c) => {
    return c.json({});
});

app.get("/:id", (c) => {
    return c.json({});
});

app.post("/", createRequestValidator(pick(CreateUserSchema, ["email", "password"])), async (c) => {
    const credentials = c.req.valid('json');
    const session = await createSession(credentials);
    return c.json(session);
});

app.delete("/:id", (c) => {
    return c.json({});
});

export default app;