import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { address } from "./address";
import { driver } from "./driver";

export const trip = pgTable("trip", {
	id: uuid("id").primaryKey().defaultRandom(),
	driverId: uuid("driver_id")
		.notNull()
		.references(() => driver.id),
	startLocation: uuid("start_location")
		.notNull()
		.references(() => address.id),
	loadingDateTime: timestamp("loading_date_time").notNull(),
});

export const insertTripSchema = createInsertSchema(trip);
