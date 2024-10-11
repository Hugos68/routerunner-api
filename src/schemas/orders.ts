import { createSelectSchema } from "drizzle-zod";
import { ordersTable } from "../database/tables/orders.ts";

export const OrderSchema = createSelectSchema(ordersTable);
export const CreateOrderSchema = OrderSchema.omit({ id: true });
export const UpdateOrderSchema = CreateOrderSchema.partial();
export const OrderParamsSchema = OrderSchema.pick({ id: true });
export const OrderQuerySchema = OrderSchema.partial();
