import { pgTable, uuid } from "drizzle-orm/pg-core";
import { role } from "./role";
import { user } from "./user";

export const userRoles = pgTable("user_roles", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id")
		.notNull()
		.references(() => user.id),
	roleId: uuid("role_id")
		.notNull()
		.references(() => role.id),
});
