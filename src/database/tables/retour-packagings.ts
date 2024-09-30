import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-valibot";
import { partial } from "valibot";

export const retour_packaging_table = pgTable("retour_packagings", {
	id: uuid("id").primaryKey().defaultRandom(),
	quantity: integer("quantity").notNull(),
	packageType: text("package_type").notNull(),
});

export type RetourEmballage = typeof retour_packaging_table.$inferSelect;

export const CreateRetourEmballageSchema = createInsertSchema(
	retour_packaging_table,
);

export const UpdateRetourEmballageSchema = partial(CreateRetourEmballageSchema);
