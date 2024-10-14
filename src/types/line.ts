import type { z } from "zod";
import type {
	CreateLineSchema,
	LineQuerySchema,
	LineSchema,
	UpdateLineSchema,
} from "../schemas/lines.ts";

export type Line = z.infer<typeof LineSchema>;
export type LineToCreate = z.infer<typeof CreateLineSchema>;
export type LineToUpdate = z.infer<typeof UpdateLineSchema>;
export type LineQuery = z.infer<typeof LineQuerySchema>;
