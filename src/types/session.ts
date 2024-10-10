import type { z } from "zod";
import type {
	CreateSessionSchema,
	SessionSchema,
} from "../schemas/sessions.ts";

export type Session = z.infer<typeof SessionSchema>;
export type SessionToCreate = z.infer<typeof CreateSessionSchema>;
