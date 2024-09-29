import { pgTable, uuid } from "drizzle-orm/pg-core";
import { trips_table } from "./trips.js";
import { users_table } from "./users.js";

export const trip_drivers_table = pgTable("trip_drivers", {
	id: uuid("id").primaryKey().defaultRandom(),
	driverId: uuid("driver_id")
		.notNull()
		.references(() => users_table.id),
	tripId: uuid("trip_id")
		.notNull()
		.references(() => trips_table.id),
});
