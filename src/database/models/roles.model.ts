import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-valibot";
import { partial } from "valibot";

export const roles = pgTable("roles", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("role", { enum: ["ADMIN", "USER", "GUEST"] })
		.notNull()
		.unique(),
});

export type Role = typeof roles.$inferSelect;

export const CreateRoleSchema = createInsertSchema(roles);

export const UpdateRoleSchema = partial(CreateRoleSchema);
