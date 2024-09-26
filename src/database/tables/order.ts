import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { address } from "./address";
import { createInsertSchema } from "drizzle-valibot";
import { partial } from "valibot";

export const order = pgTable("order", {
    id: uuid("id").primaryKey().defaultRandom(),
    quantity: integer("quantity").notNull(),
    packageType: text("package_type").notNull(),
    unloadingAddress: uuid("unloading_address")
        .notNull()
        .references(() => address.id),
    unloadingDateTime: timestamp("unloading_date_time").notNull(),
    deliveryInstructions: text("delivery_instructions").notNull(),
    status: text("status").notNull(),
});


export type Order = typeof order.$inferSelect;

export const insertOrderSchema = createInsertSchema(order);

export const updateOrderSchema = partial(insertOrderSchema);