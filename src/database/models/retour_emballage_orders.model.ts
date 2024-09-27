import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { orders } from "./orders.table";
import { retourEmballage } from "./retour_emballage.model";

export const retourEmballageOrders = pgTable("retour_emballage_orders", {
	id: uuid("id").primaryKey().defaultRandom(),
	retourEmballageId: uuid("retour_emballage_id")
		.notNull()
		.references(() => retourEmballage.id),
	orderId: uuid("order_id")
		.notNull()
		.references(() => orders.id),
});
