import { and, eq } from "drizzle-orm";
import { parse, partial } from "valibot";
import { database } from "../database/database.js";
import {
	type Address,
	CreateAddressSchema,
	UpdateAddressSchema,
	addresses_table,
} from "../database/schema.js";
import { create_filter_conditions } from "../utility/create-filter-conditions.js";
import { NotFoundError } from "../utility/errors.js";

export const create_address = async (input: unknown) => {
	const values = parse(CreateAddressSchema, input);
	const [address] = await database
		.insert(addresses_table)
		.values(values)
		.returning();
	return address;
};

export const get_addresses = async (filter: Record<string, unknown> = {}) => {
	const conditions = create_filter_conditions(
		filter,
		partial(CreateAddressSchema),
		addresses_table,
	);
	const addresses = await database
		.select()
		.from(addresses_table)
		.where(and(...conditions));
	return addresses;
};

export const get_address = async (id: Address["id"]) => {
	const [address] = await database
		.select()
		.from(addresses_table)
		.where(eq(addresses_table.id, id));
	if (address === undefined) {
		throw new NotFoundError(`Address with id ${id} not found`);
	}
	return address;
};

export const update_address = async (id: Address["id"], input: unknown) => {
	const values = parse(UpdateAddressSchema, input);
	const [address] = await database
		.update(addresses_table)
		.set(values)
		.where(eq(addresses_table.id, id))
		.returning();
	if (address === undefined) {
		throw new NotFoundError(`Address with id ${id} not found`);
	}
	return address;
};

export const delete_address = async (id: Address["id"]) => {
	const [address] = await database
		.delete(addresses_table)
		.where(eq(addresses_table.id, id))
		.returning();
	if (address === undefined) {
		throw new NotFoundError(`Address with id ${id} not found`);
	}
	return address;
};
