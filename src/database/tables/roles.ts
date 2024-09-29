import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-valibot";
import { partial } from "valibot";

export const roles_table = pgTable("roles", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("role", { enum: ["ADMIN", "USER", "GUEST"] })
		.notNull()
		.unique(),
});

export type Role = typeof roles_table.$inferSelect;

export const CreateRoleSchema = createInsertSchema(roles_table);

export const UpdateRoleSchema = partial(CreateRoleSchema);
