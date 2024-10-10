import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { ordersTable } from "./orders.ts";

export const notesTable = pgTable("notes", {
	id: uuid("id").primaryKey().defaultRandom(),
	content: text("content").notNull(),
	orderId: uuid("order_id")
		.references(() => ordersTable.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		})
		.notNull(),
});
