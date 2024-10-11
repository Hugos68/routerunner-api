import { createSelectSchema } from "drizzle-zod";
import { retourPackagingsTable } from "../database/tables/retour-packagings.ts";

export const RetourPackagingSchema = createSelectSchema(retourPackagingsTable);
export const CreateRetourPackagingSchema = RetourPackagingSchema.omit({
	id: true,
});
export const UpdateRetourPackagingSchema =
	CreateRetourPackagingSchema.partial();
export const RetourPackagingParamsSchema = RetourPackagingSchema.pick({
	id: true,
});
export const RetourPackagingQuerySchema = RetourPackagingSchema.partial();
