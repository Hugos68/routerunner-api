import type { sessionsTable } from "../database/tables/sessions.ts";

export type Session = typeof sessionsTable.$inferSelect;
