import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-valibot";
import { partial } from "valibot";

export const lines = pgTable("lines", {
	id: uuid("id").primaryKey().defaultRandom(),
	palletId: text("pallet_id").notNull(),
	quantity: text("quantity").notNull(),
	productName: text("product_name").notNull(),
	packageType: text("package_type").notNull(),
});

export type Line = typeof lines.$inferSelect;

export const CreateLineSchema = createInsertSchema(lines);

export const UpdateLineSchema = partial(CreateLineSchema);
