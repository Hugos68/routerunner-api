import { pgTable, uuid } from "drizzle-orm/pg-core";
import { trips } from "./trips.tables";
import { users } from "./users.table";

export const trip_drivers = pgTable("trip_drivers", {
	id: uuid("id").primaryKey().defaultRandom(),
	driverId: uuid("driver_id")
		.notNull()
		.references(() => users.id),
	tripId: uuid("trip_id")
		.notNull()
		.references(() => trips.id),
});
