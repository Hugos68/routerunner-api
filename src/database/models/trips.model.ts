import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-valibot";
import { partial } from "valibot";
import { addresses } from "./addresses.model";
import { users } from "./users.model";

export const trips = pgTable("trips", {
	id: uuid("id").primaryKey().defaultRandom(),
	driverId: uuid("driver_id")
		.notNull()
		.references(() => users.id),
	startLocation: uuid("start_location")
		.notNull()
		.references(() => addresses.id),
	loadingDateTime: timestamp("loading_date_time").notNull(),
});

export type Trip = typeof trips.$inferSelect;

export const CreateTripSchema = createInsertSchema(trips);

export const UpdateTripSchema = partial(CreateTripSchema);
