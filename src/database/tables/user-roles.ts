import { pgTable, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-valibot";
import { partial } from "valibot";
import { roles_table } from "./roles.js";
import { users_table } from "./users.js";

export const user_roles_table = pgTable("user_roles", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users_table.id)
		.unique(),
	roleId: uuid("role_id")
		.notNull()
		.references(() => roles_table.id),
});

export type UserRole = typeof user_roles_table.$inferSelect;

export const CreateUserRoleSchema = createInsertSchema(user_roles_table);

export const UpdateUserRoleSchema = partial(CreateUserRoleSchema);
