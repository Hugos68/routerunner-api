import { eq } from "drizzle-orm";
import { parse } from "valibot";
import { database } from "../database/database.js";
import {
	type Address,
	CreateAddressSchema,
	UpdateAddressSchema,
	addresses,
} from "../database/models/addresses.model.js";
import { NotFoundError } from "../utility/errors.js";

export const createAddress = async (input: unknown) => {
	const values = parse(CreateAddressSchema, input);
	const [result] = await database.insert(addresses).values(values).returning();
	return result;
};

export const getAddresses = async () => {
	const result = await database.select().from(addresses);
	return result;
};

export const getAddress = async (id: Address["id"]) => {
	const [result] = await database
		.select()
		.from(addresses)
		.where(eq(addresses.id, id));
	if (result === undefined) {
		throw new NotFoundError(`Address with id ${id} not found`);
	}
	return result;
};

export const updateAddress = async (id: Address["id"], input: unknown) => {
	const values = parse(UpdateAddressSchema, input);
	const [result] = await database
		.update(addresses)
		.set(values)
		.where(eq(addresses.id, id))
		.returning();
	if (result === undefined) {
		throw new NotFoundError(`Address with id ${id} not found`);
	}
	return result;
};

export const deleteAddress = async (id: Address["id"]) => {
	const [result] = await database.delete(addresses).where(eq(addresses.id, id));
	if (result === undefined) {
		throw new NotFoundError(`Address with id ${id} not found`);
	}
	return result;
};
