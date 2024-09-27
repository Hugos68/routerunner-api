import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-valibot";
import { partial } from "valibot";

export const retourPackagings = pgTable("retour_packagings", {
	id: uuid("id").primaryKey().defaultRandom(),
	quantity: integer("quantity").notNull(),
	packageType: text("package_type").notNull(),
});

export type RetourEmballage = typeof retourPackagings.$inferSelect;

export const CreateRetourEmballageSchema = createInsertSchema(retourPackagings);

export const UpdateRetourEmballageSchema = partial(CreateRetourEmballageSchema);
