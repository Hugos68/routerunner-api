import type { z } from "zod";
import type {
	CreateUserSchema,
	UpdateUserSchema,
	UserQuerySchema,
	UserSchema,
} from "../schemas/users.ts";

export type User = z.infer<typeof UserSchema>;
export type UserToCreate = z.infer<typeof CreateUserSchema>;
export type UserToUpdate = z.infer<typeof UpdateUserSchema>;
export type UserQuery = z.infer<typeof UserQuerySchema>;
