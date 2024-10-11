import { createSelectSchema } from "drizzle-zod";
import { addressesTable } from "../database/tables/addresses.ts";

export const AddressSchema = createSelectSchema(addressesTable);
export const CreateAddressSchema = AddressSchema.omit({ id: true });
export const UpdateAddressSchema = CreateAddressSchema.partial();
export const AddressParamsSchema = AddressSchema.pick({ id: true });
export const AddressQuerySchema = AddressSchema.partial();
