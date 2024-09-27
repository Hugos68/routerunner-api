import { line, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-valibot";
import { lines } from "./lines.table";
import { orders } from "./orders.table";

export const orderLines = pgTable("order_lines", {
	id: uuid("id").primaryKey().defaultRandom(),
	orderId: uuid("order_id")
		.notNull()
		.references(() => orders.id),
	lineId: uuid("line_id")
		.notNull()
		.references(() => lines.id),
});
