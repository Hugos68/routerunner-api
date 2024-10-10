import { createSelectSchema } from "drizzle-zod";
import { sessionsTable } from "../database/tables/sessions.ts";
import { UserSchema } from "./users.ts";

export const SessionSchema = createSelectSchema(sessionsTable);
export const CreateSessionSchema = UserSchema.pick({
	username: true,
	password: true,
});
export const SessionParamsSchema = SessionSchema.pick({ id: true });
export const SessionQuerySchema = SessionSchema.partial();
