import { pgTable, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-valibot";
import { partial } from "valibot";
import { roles } from "./roles.model";
import { users } from "./users.model";

export const userRoles = pgTable("user_roles", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id)
		.unique(),
	roleId: uuid("role_id")
		.notNull()
		.references(() => roles.id),
});

export type UserRole = typeof userRoles.$inferSelect;

export const CreateUserRoleSchema = createInsertSchema(userRoles);

export const UpdateUserRoleSchema = partial(CreateUserRoleSchema);
