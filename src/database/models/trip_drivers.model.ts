import { pgTable, uuid } from "drizzle-orm/pg-core";
import { trips } from "./trips.model";
import { users } from "./users.model";

export const tripDrivers = pgTable("trip_drivers", {
	id: uuid("id").primaryKey().defaultRandom(),
	driverId: uuid("driver_id")
		.notNull()
		.references(() => users.id),
	tripId: uuid("trip_id")
		.notNull()
		.references(() => trips.id),
});
