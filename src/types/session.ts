import type { z } from "zod";
import type {
	CreateSessionSchema,
	SessionQuerySchema,
	SessionSchema,
} from "../schemas/sessions.ts";

export type Session = z.infer<typeof SessionSchema>;
export type SessionToCreate = z.infer<typeof CreateSessionSchema>;
export type SessionQuery = z.infer<typeof SessionQuerySchema>;
