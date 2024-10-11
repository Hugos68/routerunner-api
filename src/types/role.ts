import type { rolesTable } from "../database/tables/roles.ts";

export type Role = typeof rolesTable.$inferSelect;
