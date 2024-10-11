import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { addressesTable } from "./addresses.ts";
import { tripsTable } from "./trips.ts";

export const ordersTable = pgTable("orders", {
	id: uuid("id").primaryKey().defaultRandom(),
	quantity: integer("quantity").notNull(),
	packageType: text("package_type").notNull(),
	unloadingAddress: uuid("unloading_address")
		.notNull()
		.references(() => addressesTable.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		}),
	unloadingDateTime: timestamp("unloading_date_time", {
		mode: "string",
		withTimezone: true,
	}).notNull(),
	deliveryInstructions: text("delivery_instructions").notNull(),
	status: text("status", { enum: ["GESLOTEN", "OPEN"] }),
	tripId: uuid("trip_id")
		.references(() => tripsTable.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		})
		.notNull(),
});
