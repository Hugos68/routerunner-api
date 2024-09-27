import { pgTable, uuid } from "drizzle-orm/pg-core";
import { roles } from "./roles.table";
import { users } from "./users.table";

export const userRoles = pgTable("user_roles", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id),
	roleId: uuid("role_id")
		.notNull()
		.references(() => roles.id),
});

export type UserRole = typeof userRoles.$inferSelect;
