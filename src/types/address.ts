import type { z } from "zod";
import type {
	AddressQuerySchema,
	AddressSchema,
	CreateAddressSchema,
	UpdateAddressSchema,
} from "../schemas/addresses.ts";

export type Address = z.infer<typeof AddressSchema>;
export type AddressToCreate = z.infer<typeof CreateAddressSchema>;
export type AddressToUpdate = z.infer<typeof UpdateAddressSchema>;
export type AddressQuery = z.infer<typeof AddressQuerySchema>;
