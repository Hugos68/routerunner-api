import { pgTable, uuid } from "drizzle-orm/pg-core";
import { orders } from "./orders.model";
import { retourPackagings } from "./retour_packagings.model";

export const retourPackagingOrders = pgTable("retour_packaging_orders", {
	id: uuid("id").primaryKey().defaultRandom(),
	retourPackagingId: uuid("retour_packaging_id")
		.notNull()
		.references(() => retourPackagings.id),
	orderId: uuid("order_id")
		.notNull()
		.references(() => orders.id),
});
