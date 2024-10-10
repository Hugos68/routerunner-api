import type { sessionsTable } from "../database/tables/sessions.ts";
import type { Role } from "./roles.ts";
import type { User } from "./users.ts";

export type Session = typeof sessionsTable.$inferSelect;

export interface SessionWithUser extends Session {
	user: User & { role: Role };
}
