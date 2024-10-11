import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { ordersTable } from "./orders.ts";

export const retourPackagingsTable = pgTable("retour_packagings", {
	id: uuid("id").primaryKey().defaultRandom(),
	quantity: integer("quantity").notNull(),
	packageType: text("package_type").notNull(),
	orderId: uuid("order_id")
		.references(() => ordersTable.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		})
		.notNull(),
});
