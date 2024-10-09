import { and, eq } from "drizzle-orm";
import { parse } from "valibot";
import { database } from "../database/database.js";
import {
	type Address,
	CreateAddressSchema,
	UpdateAddressSchema,
	addressesTable,
} from "../database/schema.js";
import { createFilterConditions } from "../utility/create-filter-conditions.js";
import { NotFoundError } from "../utility/errors.js";

export const createAddress = async (input: unknown) => {
	const values = parse(CreateAddressSchema, input);
	const [address] = await database
		.insert(addressesTable)
		.values(values)
		.returning();
	return address;
};

export const getAddresses = async (filter: Record<string, unknown> = {}) => {
	const conditions = createFilterConditions(filter, addressesTable);
	const addresses = await database
		.select()
		.from(addressesTable)
		.where(and(...conditions));
	return addresses;
};

export const getAddress = async (id: Address["id"]) => {
	const [address] = await database
		.select()
		.from(addressesTable)
		.where(eq(addressesTable.id, id));
	if (address === undefined) {
		throw new NotFoundError();
	}
	return address;
};

export const updateAddress = async (id: Address["id"], input: unknown) => {
	const values = parse(UpdateAddressSchema, input);
	const [address] = await database
		.update(addressesTable)
		.set(values)
		.where(eq(addressesTable.id, id))
		.returning();
	if (address === undefined) {
		throw new NotFoundError();
	}
	return address;
};

export const deleteAddress = async (id: Address["id"]) => {
	const [address] = await database
		.delete(addressesTable)
		.where(eq(addressesTable.id, id))
		.returning();
	if (address === undefined) {
		throw new NotFoundError();
	}
	return address;
};
