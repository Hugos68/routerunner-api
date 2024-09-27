import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-valibot";
import { partial } from "valibot";

export const addresses = pgTable("addresses", {
	id: uuid("id").primaryKey().defaultRandom(),
	street: text("street").notNull(),
	number: text("number").notNull(),
	city: text("city").notNull(),
	state: text("state").notNull(),
	country: text("country").notNull(),
	zip: text("zip").notNull(),
});

export type Address = typeof addresses.$inferSelect;

export const CreateAddressSchema = createInsertSchema(addresses);

export const UpdateAddressSchema = partial(CreateAddressSchema);
