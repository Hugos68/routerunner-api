import { pgTable, uuid } from "drizzle-orm/pg-core";
import { lines_table } from "./lines.js";
import { orders_table } from "./orders.js";

export const order_lines_table = pgTable("order_lines", {
	id: uuid("id").primaryKey().defaultRandom(),
	orderId: uuid("order_id")
		.notNull()
		.references(() => orders_table.id),
	lineId: uuid("line_id")
		.notNull()
		.references(() => lines_table.id),
});
