import { pgTable, uuid } from "drizzle-orm/pg-core";
import { lines } from "./lines.model.js";
import { orders } from "./orders.model.js";

export const orderLines = pgTable("order_lines", {
	id: uuid("id").primaryKey().defaultRandom(),
	orderId: uuid("order_id")
		.notNull()
		.references(() => orders.id),
	lineId: uuid("line_id")
		.notNull()
		.references(() => lines.id),
});
