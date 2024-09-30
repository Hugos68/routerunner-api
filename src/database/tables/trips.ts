import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-valibot";
import { partial } from "valibot";
import { addresses_table } from "./addresses.js";
import { users_table } from "./users.js";

export const trips_table = pgTable("trips", {
	id: uuid("id").primaryKey().defaultRandom(),
	driverId: uuid("driver_id")
		.notNull()
		.references(() => users_table.id),
	startLocation: uuid("start_location")
		.notNull()
		.references(() => addresses_table.id),
	loadingDateTime: timestamp("loading_date_time").notNull(),
});

export type Trip = typeof trips_table.$inferSelect;

export const CreateTripSchema = createInsertSchema(trips_table);

export const UpdateTripSchema = partial(CreateTripSchema);
