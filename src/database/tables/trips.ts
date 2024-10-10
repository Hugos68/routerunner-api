import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { addressesTable } from "./addresses.ts";
import { usersTable } from "./users.ts";

export const tripsTable = pgTable("trips", {
	id: uuid("id").primaryKey().defaultRandom(),
	driverId: uuid("driver_id")
		.notNull()
		.references(() => usersTable.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		}),
	startLocation: uuid("start_location")
		.notNull()
		.references(() => addressesTable.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		}),
	loadingDateTime: timestamp("loading_date_time", {
		mode: "string",
		withTimezone: true,
	}).notNull(),
});
