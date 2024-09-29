import { pgTable, uuid } from "drizzle-orm/pg-core";
import { orders_table } from "./orders.js";
import { retour_packaging_table } from "./retour-packagings.js";

export const retour_packaging_orders_table = pgTable(
	"retour_packaging_orders",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		retourPackagingId: uuid("retour_packaging_id")
			.notNull()
			.references(() => retour_packaging_table.id),
		orderId: uuid("order_id")
			.notNull()
			.references(() => orders_table.id),
	},
);
