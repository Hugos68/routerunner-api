import { text } from "drizzle-orm/pg-core";
import { pgTable, uuid } from "drizzle-orm/pg-core";
import { hash } from "../columns/hash.ts";
import { rolesTable } from "./roles.ts";

export const usersTable = pgTable("users", {
	id: uuid("id").primaryKey().defaultRandom(),
	username: text("username").unique().notNull(),
	password: hash("password").notNull(),
	roleId: uuid("role_id")
		.references(() => rolesTable.id)
		.notNull(),
});
