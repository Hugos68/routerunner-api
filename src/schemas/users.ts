import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { usersTable } from "../database/tables/users.ts";

export const UserSchema = createSelectSchema(usersTable, {
	password: z.string(),
});
export const CreateUserSchema = UserSchema.omit({ id: true });
export const UpdateUserSchema = CreateUserSchema.partial();
