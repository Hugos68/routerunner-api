import { eq } from "drizzle-orm";
import { database } from "../database/database.ts";
import { addressesTable } from "../database/tables/addresses.ts";
import type { Actor } from "../types/actor.ts";
import type {
	Address,
	AddressToCreate,
	AddressToUpdate,
} from "../types/address.ts";
import { authorize } from "../utility/authorize.ts";
import { ResourceNotFoundError } from "../utility/errors.ts";

export const getAddress = async (actor: Actor, id: Address["id"]) => {
	authorize(actor)
		.isAuthenticated()
		.throwCustomError(new ResourceNotFoundError());
	const [address] = await database
		.select()
		.from(addressesTable)
		.where(eq(addressesTable.id, id));
	if (address === undefined) {
		throw new ResourceNotFoundError();
	}
	return address;
};

export const getAddresses = async (actor: Actor) => {
	authorize(actor).hasRoles("ADMIN", "PLANNER");
	const addresses = await database.select().from(addressesTable);
	return addresses;
};

export const createAddress = async (
	actor: Actor,
	addressToCreate: AddressToCreate,
) => {
	authorize(actor).hasRoles("ADMIN", "PLANNER");
	const [address] = await database
		.insert(addressesTable)
		.values(addressToCreate)
		.returning();
	if (address === undefined) {
		throw new Error("Failed to create address");
	}
	return address;
};

export const updateAddress = async (
	actor: Actor,
	id: Address["id"],
	addressToUpdate: AddressToUpdate,
) => {
	authorize(actor)
		.hasRoles("ADMIN", "PLANNER")
		.throwCustomError(new ResourceNotFoundError());
	const [address] = await database
		.update(addressesTable)
		.set(addressToUpdate)
		.where(eq(addressesTable.id, id))
		.returning();
	if (address === undefined) {
		throw new Error("Failed to update address");
	}
	return address;
};

export const deleteAddress = async (actor: Actor, id: Address["id"]) => {
	authorize(actor)
		.hasRoles("ADMIN", "PLANNER")
		.throwCustomError(new ResourceNotFoundError());
	const [address] = await database
		.delete(addressesTable)
		.where(eq(addressesTable.id, id))
		.returning();
	if (address === undefined) {
		throw new Error("Failed to delete address");
	}
	return address;
};
