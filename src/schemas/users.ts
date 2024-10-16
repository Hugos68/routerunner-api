import { z } from "@hono/zod-openapi";
import { createSelectSchema } from "drizzle-zod";
import { usersTable } from "../database/tables/users.ts";

export const UserSchema = createSelectSchema(usersTable, {
	password: z.string().min(10),
});
export const CreateUserSchema = UserSchema.omit({ id: true });
export const UpdateUserSchema = CreateUserSchema.partial();
export const UserParamsSchema = UserSchema.pick({ id: true });
export const UserQuerySchema = UserSchema.omit({ password: true }).partial();
