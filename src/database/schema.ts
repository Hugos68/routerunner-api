import { customType } from "drizzle-orm/pg-core";
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-valibot";
import { minLength, partial, pick, string, transform } from "valibot";
import { HASH_CONFIG } from "../utility/constants";

const hash = customType<{ data: string }>({
	dataType: () => {
		return "text";
	},
	toDriver: (value) => {
		return Bun.password.hashSync(value, HASH_CONFIG);
	},
});

export const users_table = pgTable("users", {
	id: uuid("id").primaryKey().defaultRandom(),
	username: text("username").unique().notNull(),
	password: hash("password").notNull(),
});

export const roles_table = pgTable("roles", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("role", { enum: ["DRIVER", "PLANNER", "ADMIN"] })
		.notNull()
		.unique(),
});

export const sessions_table = pgTable("sessions", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users_table.id)
		.unique(),
});

export const trips_table = pgTable("trips", {
	id: uuid("id").primaryKey().defaultRandom(),
	driverId: uuid("driver_id")
		.notNull()
		.references(() => users_table.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		}),
	startLocation: uuid("start_location")
		.notNull()
		.references(() => addresses_table.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		}),
	loadingDateTime: timestamp("loading_date_time", {
		mode: "string",
		withTimezone: true,
	}).notNull(),
});

export const orders_table = pgTable("orders", {
	id: uuid("id").primaryKey().defaultRandom(),
	quantity: integer("quantity").notNull(),
	packageType: text("package_type").notNull(),
	unloadingAddress: uuid("unloading_address")
		.notNull()
		.references(() => addresses_table.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		}),
	unloadingDateTime: timestamp("unloading_date_time", {
		mode: "string",
		withTimezone: true,
	}).notNull(),
	deliveryInstructions: text("delivery_instructions").notNull(),
	status: text("status", { enum: ["GESLOTEN", "OPEN"] }),
});

export const lines_table = pgTable("lines", {
	id: uuid("id").primaryKey().defaultRandom(),
	palletId: text("pallet_id").notNull(),
	quantity: integer("quantity").notNull(),
	productName: text("product_name").notNull(),
	packageType: text("package_type").notNull(),
});

export const addresses_table = pgTable("addresses", {
	id: uuid("id").primaryKey().defaultRandom(),
	street: text("street").notNull(),
	number: text("number").notNull(),
	city: text("city").notNull(),
	state: text("state").notNull(),
	country: text("country").notNull(),
	zip: text("zip").notNull(),
});

export const notes_table = pgTable("notes", {
	id: uuid("id").primaryKey().defaultRandom(),
	content: text("content").notNull(),
	photo: text("photo"),
});

export const retour_packaging_table = pgTable("retour_packagings", {
	id: uuid("id").primaryKey().defaultRandom(),
	quantity: integer("quantity").notNull(),
	packageType: text("package_type").notNull(),
});

export const order_lines_table = pgTable("order_lines", {
	id: uuid("id").primaryKey().defaultRandom(),
	orderId: uuid("order_id")
		.notNull()
		.references(() => orders_table.id),
	lineId: uuid("line_id")
		.notNull()
		.references(() => lines_table.id),
});

export const order_trips_table = pgTable("order_trips", {
	id: uuid("id").primaryKey().defaultRandom(),
	orderId: uuid("order_id")
		.notNull()
		.references(() => orders_table.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		}),
	tripId: uuid("trip_id")
		.notNull()
		.references(() => trips_table.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		}),
});

export const retour_packaging_orders_table = pgTable(
	"retour_packaging_orders",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		retourPackagingId: uuid("retour_packaging_id")
			.notNull()
			.references(() => retour_packaging_table.id),
		orderId: uuid("order_id")
			.notNull()
			.references(() => orders_table.id),
	},
);

export const trip_drivers_table = pgTable("trip_drivers", {
	id: uuid("id").primaryKey().defaultRandom(),
	driverId: uuid("driver_id")
		.notNull()
		.references(() => users_table.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		}),
	tripId: uuid("trip_id")
		.notNull()
		.references(() => trips_table.id),
});

export const user_roles_table = pgTable("user_roles", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users_table.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		})
		.unique(),
	roleId: uuid("role_id")
		.notNull()
		.references(() => roles_table.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		}),
});

export type User = typeof users_table.$inferSelect;
export type Role = typeof roles_table.$inferSelect;
export type Session = typeof sessions_table.$inferSelect;
export type Trip = typeof trips_table.$inferSelect;
export type Order = typeof orders_table.$inferSelect;
export type Line = typeof lines_table.$inferSelect;
export type Address = typeof addresses_table.$inferSelect;
export type Note = typeof notes_table.$inferSelect;
export type RetourPackaging = typeof retour_packaging_table.$inferSelect;
export type OrderLine = typeof order_lines_table.$inferSelect;
export type OrderTrip = typeof order_trips_table.$inferSelect;
export type RetourPackagingOrders =
	typeof retour_packaging_orders_table.$inferSelect;
export type TripDrivers = typeof trip_drivers_table.$inferSelect;
export type UserRoles = typeof user_roles_table.$inferSelect;

export const CreateUserSchema = transform(
	createInsertSchema(users_table, {
		password: () => string([minLength(10)]),
	}),
	(output) => {
		return output;
	},
);
export const UpdateUserSchema = partial(CreateUserSchema);

export const CreateRoleSchema = createInsertSchema(roles_table);
export const UpdateRoleSchema = partial(CreateRoleSchema);

export const CreateSessionSchema = pick(CreateUserSchema, [
	"username",
	"password",
]);

export const CreateTripSchema = createInsertSchema(trips_table);
export const UpdateTripSchema = partial(CreateTripSchema);

export const CreateOrderSchema = createInsertSchema(orders_table);
export const UpdateOrderSchema = partial(CreateOrderSchema);

export const CreateLineSchema = createInsertSchema(lines_table);
export const UpdateLineSchema = partial(CreateLineSchema);

export const CreateAddressSchema = createInsertSchema(addresses_table);
export const UpdateAddressSchema = partial(CreateAddressSchema);

export const CreateNoteSchema = createInsertSchema(notes_table);
export const UpdateNoteSchema = partial(CreateNoteSchema);

export const CreateRetourPackagingSchema = createInsertSchema(
	retour_packaging_table,
);
export const UpdateRetourPackagingSchema = partial(CreateRetourPackagingSchema);

export const CreateOrderLineSchema = createInsertSchema(order_lines_table);
export const UpdateOrderLineSchema = partial(CreateOrderLineSchema);

export const CreateOrderTripSchema = createInsertSchema(order_trips_table);
export const UpdateOrderTripSchema = partial(CreateOrderTripSchema);

export const CreateTripDriverSchema = createInsertSchema(trip_drivers_table);
export const UpdateTripDriverSchema = partial(CreateTripDriverSchema);

export const CreateUserRolesSchema = createInsertSchema(user_roles_table);
export const UpdateUserRolesSchema = partial(CreateUserRolesSchema);
