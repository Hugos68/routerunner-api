import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { ordersTable } from "./orders.ts";

export const linesTable = pgTable("lines", {
	id: uuid("id").primaryKey().defaultRandom(),
	palletId: text("pallet_id").notNull(),
	quantity: integer("quantity").notNull(),
	productName: text("product_name").notNull(),
	packageType: text("package_type").notNull(),
	orderId: uuid("order_id")
		.references(() => ordersTable.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		})
		.notNull(),
});
