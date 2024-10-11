import { createSelectSchema } from "drizzle-zod";
import { linesTable } from "../database/tables/lines.ts";

export const LineSchema = createSelectSchema(linesTable);
export const CreateLineSchema = LineSchema.omit({ id: true });
export const UpdateLineSchema = CreateLineSchema.partial();
export const LineParamsSchema = LineSchema.pick({ id: true });
export const LineQuerySchema = LineSchema.partial();
