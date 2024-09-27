import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-valibot";
import { partial } from "valibot";

export const retourEmballage = pgTable("retour_emballage", {
	id: uuid("id").primaryKey().defaultRandom(),
	quantity: integer("quantity").notNull(),
	packageType: text("package_type").notNull(),
});

export type RetourEmballage = typeof retourEmballage.$inferSelect;

export const CreateRetourEmballageSchema = createInsertSchema(retourEmballage);

export const UpdateRetourEmballageSchema = partial(CreateRetourEmballageSchema);
