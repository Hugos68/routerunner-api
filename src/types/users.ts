import type { usersTable } from "../database/tables/users.ts";

export type User = typeof usersTable.$inferSelect;
