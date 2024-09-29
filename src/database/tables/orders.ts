import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-valibot";
import { partial } from "valibot";
import { addresses_table } from "./addresses.js";

export const orders_table = pgTable("orders", {
	id: uuid("id").primaryKey().defaultRandom(),
	quantity: integer("quantity").notNull(),
	packageType: text("package_type").notNull(),
	unloadingAddress: uuid("unloading_address")
		.notNull()
		.references(() => addresses_table.id),
	unloadingDateTime: timestamp("unloading_date_time", {
		mode: "string",
		withTimezone: true,
	}).notNull(),
	deliveryInstructions: text("delivery_instructions").notNull(),
	status: text("status", { enum: ["GESLOTEN", "OPEN"] }),
});

export type Order = typeof orders_table.$inferSelect;

export const CreateOrderSchema = createInsertSchema(orders_table);

export const updateOrderSchema = partial(CreateOrderSchema);
