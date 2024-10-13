import type { z } from "zod";
import type {
	CreateOrderSchema,
	OrderQuerySchema,
	OrderSchema,
	UpdateOrderSchema,
} from "../schemas/orders.ts";

export type Order = z.infer<typeof OrderSchema>;
export type OrderToCreate = z.infer<typeof CreateOrderSchema>;
export type OrderToUpdate = z.infer<typeof UpdateOrderSchema>;
export type OrderQuery = z.infer<typeof OrderQuerySchema>;
