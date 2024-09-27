import { pgTable, uuid } from "drizzle-orm/pg-core";
import { orders } from "./orders.table";
import { trips } from "./trips.tables";

export const order_trips = pgTable("order_trips", {
	id: uuid("id").primaryKey().defaultRandom(),
	orderId: uuid("order_id")
		.notNull()
		.references(() => orders.id),
	tripId: uuid("trip_id")
		.notNull()
		.references(() => trips.id),
});

export type OrderTrip = typeof order_trips.$inferSelect;
