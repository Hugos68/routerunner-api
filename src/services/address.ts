import { eq } from "drizzle-orm";
import { type Output, pick } from "valibot";
import { database } from "../database/database.js";

import { type Address, address } from "../database/tables/address.js";

export async function createAddress(data: Omit<Address, "id">) {
	return await database.insert(address).values(data).returning();
}

export async function getAddress(id: Address["id"]) {
	return await database.select().from(address).where(eq(address.id, id));
}

export async function getAddresses() {
	return await database.select().from(address);
}

export async function updateAddress(
	id: Address["id"],
	data: Partial<Omit<Address, "id">>,
) {
	return await database
		.update(address)
		.set(data)
		.where(eq(address.id, id))
		.returning();
}

export async function deleteAddress(id: Address["id"]) {
	return await database.delete(address).where(eq(address.id, id)).returning();
}
