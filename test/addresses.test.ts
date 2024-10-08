import { describe, expect, test } from "bun:test";
import { v4 } from "uuid";
import {
	createAddress,
	deleteAddress,
	getAddress,
	getAddresses,
	updateAddress,
} from "../src/services/addresses.ts";
import { NotFoundError } from "../src/utility/errors.ts";

describe("Addresses", () => {
	test("Create an address", async () => {
		const address = await createAddress({
			street: "test",
			number: "123",
			city: "test",
			state: "test",
			country: "test",
			zip: "1234",
		});
		expect(address).toBeDefined();
	});

	test("Get all addresses", async () => {
		const addresses = await getAddresses();
		expect(addresses).toBeInstanceOf(Array);
		expect(addresses.length).toBeGreaterThan(0);
	});

	test("Get an address", async () => {
		const addresses = await getAddresses();
		const address = await getAddress(addresses[0]?.id ?? "");
		expect(address).toBeDefined();
	});

	test("Getting an unknown address will throw a NotFoundError", async () => {
		expect(() => getAddress(v4())).toThrowError(NotFoundError);
	});

	test("Updating an unknown address will throw a NotFoundError", async () => {
		expect(() =>
			updateAddress(v4(), {
				street: "test",
				number: "123",
				city: "test",
				state: "test",
				country: "test",
				zip: "1234",
			}),
		).toThrowError(NotFoundError);
	});

	test("Updating an address", async () => {
		const addresses = await getAddresses();
		const address = await updateAddress(addresses[0]?.id ?? "", {
			street: "test",
			number: "123",
			city: "test",
			state: "test",
			country: "test",
			zip: "1234",
		});
		expect(address).toBeDefined();
	});

	test("Deleting an unknown address will throw a NotFoundError", async () => {
		expect(() => deleteAddress(v4())).toThrowError(NotFoundError);
	});

	test("Delete an address", async () => {
		const addresses = await getAddresses();
		const address = await deleteAddress(addresses[0]?.id ?? "");
		expect(address).toBeDefined();
	});
});
