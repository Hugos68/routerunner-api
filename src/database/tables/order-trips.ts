import { pgTable, uuid } from "drizzle-orm/pg-core";
import { orders_table } from "./orders.js";
import { trips_table } from "./trips.js";

export const order_trips_table = pgTable("order_trips", {
	id: uuid("id").primaryKey().defaultRandom(),
	orderId: uuid("order_id")
		.notNull()
		.references(() => orders_table.id),
	tripId: uuid("trip_id")
		.notNull()
		.references(() => trips_table.id),
});

export type OrderTrip = typeof order_trips_table.$inferSelect;
