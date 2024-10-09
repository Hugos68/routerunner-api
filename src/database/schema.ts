import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-valibot";
import { minLength, partial, string, transform } from "valibot";
import { SESSION_LIFETIME } from "../utility/constants.js";
import { hash } from "./columns.js";

export const usersTable = pgTable("users", {
	id: uuid("id").primaryKey().defaultRandom(),
	username: text("username").unique().notNull(),
	password: hash("password").notNull(),
	roleId: uuid("role_id")
		.references(() => rolesTable.id)
		.notNull(),
});

export const rolesTable = pgTable("roles", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("role", { enum: ["DRIVER", "PLANNER", "ADMIN"] })
		.notNull()
		.unique(),
});

export const sessionsTable = pgTable("sessions", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id")
		.notNull()
		.references(() => usersTable.id)
		.unique(),
	expiresAt: timestamp("expires_at")
		.notNull()
		.default(new Date(Date.now() + SESSION_LIFETIME)),
});

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

export const ordersTable = pgTable("orders", {
	id: uuid("id").primaryKey().defaultRandom(),
	quantity: integer("quantity").notNull(),
	packageType: text("package_type").notNull(),
	unloadingAddress: uuid("unloading_address")
		.notNull()
		.references(() => addressesTable.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		}),
	unloadingDateTime: timestamp("unloading_date_time", {
		mode: "string",
		withTimezone: true,
	}).notNull(),
	deliveryInstructions: text("delivery_instructions").notNull(),
	status: text("status", { enum: ["GESLOTEN", "OPEN"] }),
	tripId: uuid("trip_id")
		.references(() => tripsTable.id)
		.notNull(),
});

export const linesTable = pgTable("lines", {
	id: uuid("id").primaryKey().defaultRandom(),
	palletId: text("pallet_id").notNull(),
	quantity: integer("quantity").notNull(),
	productName: text("product_name").notNull(),
	packageType: text("package_type").notNull(),
	orderId: uuid("order_id")
		.references(() => ordersTable.id)
		.notNull(),
});

export const addressesTable = pgTable("addresses", {
	id: uuid("id").primaryKey().defaultRandom(),
	street: text("street").notNull(),
	number: text("number").notNull(),
	city: text("city").notNull(),
	state: text("state").notNull(),
	country: text("country").notNull(),
	zip: text("zip").notNull(),
});

export const notesTable = pgTable("notes", {
	id: uuid("id").primaryKey().defaultRandom(),
	content: text("content").notNull(),
	photo: text("photo"),
	orderId: uuid("order_id")
		.references(() => ordersTable.id)
		.notNull(),
});

export const retourPackagingsTable = pgTable("retour_packagings", {
	id: uuid("id").primaryKey().defaultRandom(),
	quantity: integer("quantity").notNull(),
	packageType: text("package_type").notNull(),
	orderId: uuid("order_id")
		.references(() => ordersTable.id)
		.notNull(),
});

export type User = typeof usersTable.$inferSelect;
export type Role = typeof rolesTable.$inferSelect;
export type Session = typeof sessionsTable.$inferSelect;
export type Trip = typeof tripsTable.$inferSelect;
export type Order = typeof ordersTable.$inferSelect;
export type Line = typeof linesTable.$inferSelect;
export type Address = typeof addressesTable.$inferSelect;
export type Note = typeof notesTable.$inferSelect;
export type RetourPackaging = typeof retourPackagingsTable.$inferSelect;

export const CreateUserSchema = transform(
	createInsertSchema(usersTable, {
		password: () => string([minLength(10)]),
	}),
	(output) => {
		return output;
	},
);
export const UpdateUserSchema = partial(CreateUserSchema);

export const CreateRoleSchema = createInsertSchema(rolesTable);
export const UpdateRoleSchema = partial(CreateRoleSchema);

export const CreateSessionSchema = createInsertSchema(sessionsTable);
export const UpdateSessionSchema = partial(CreateSessionSchema);

export const CreateTripSchema = createInsertSchema(tripsTable);
export const UpdateTripSchema = partial(CreateTripSchema);

export const CreateOrderSchema = createInsertSchema(ordersTable);
export const UpdateOrderSchema = partial(CreateOrderSchema);

export const CreateLineSchema = createInsertSchema(linesTable);
export const UpdateLineSchema = partial(CreateLineSchema);

export const CreateAddressSchema = createInsertSchema(addressesTable);
export const UpdateAddressSchema = partial(CreateAddressSchema);

export const CreateNoteSchema = createInsertSchema(notesTable);
export const UpdateNoteSchema = partial(CreateNoteSchema);

export const CreateRetourPackagingSchema = createInsertSchema(
	retourPackagingsTable,
);
export const UpdateRetourPackagingSchema = partial(CreateRetourPackagingSchema);
