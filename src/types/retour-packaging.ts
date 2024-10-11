import type { z } from "zod";
import type {
	CreateRetourPackagingSchema,
	RetourPackagingSchema,
	UpdateRetourPackagingSchema,
} from "../schemas/retour-packagings.ts";

export type RetourPackaging = z.infer<typeof RetourPackagingSchema>;
export type RetourPackagingToCreate = z.infer<
	typeof CreateRetourPackagingSchema
>;
export type RetourPackagingToUpdate = z.infer<
	typeof UpdateRetourPackagingSchema
>;
