import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { SESSION_LIFETIME } from "../../utility/constants.ts";
import { usersTable } from "./users.ts";

export const sessionsTable = pgTable("sessions", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id")
		.notNull()
		.references(() => usersTable.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		})
		.unique(),
	expiresAt: timestamp("expires_at")
		.notNull()
		.default(new Date(Date.now() + SESSION_LIFETIME)),
});
