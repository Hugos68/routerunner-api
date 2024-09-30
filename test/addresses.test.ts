import { describe, expect, test } from "bun:test";
import {
	create_address,
	delete_address,
	get_address,
	get_addresses,
	update_address,
} from "../src/services/addresses";
import * as uuid from "uuid";
import { NotFoundError } from "../src/utility/errors";

describe("Addresses", () => {
	test("Create an address", async () => {
		const address = await create_address({
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
		const addresses = await get_addresses();
		expect(addresses).toBeInstanceOf(Array);
		expect(addresses.length).toBeGreaterThan(0);
	});

	test("Get an address", async () => {
		const addresses = await get_addresses();
		const address = await get_address(addresses[0]?.id ?? "");
		expect(address).toBeDefined();
	});

	test("Getting an unknown address will throw a NotFoundError", async () => {
		expect(() => get_address(uuid.v4())).toThrowError(NotFoundError);
	});

	test("Updating an unknown address will throw a NotFoundError", async () => {
		expect(() =>
			update_address(uuid.v4(), {
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
		const addresses = await get_addresses();
		const address = await update_address(addresses[0]?.id ?? "", {
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
		expect(() => delete_address(uuid.v4())).toThrowError(NotFoundError);
	});

	test("Delete an address", async () => {
		const addresses = await get_addresses();
		console.log(addresses[0]?.id);

		const address = await delete_address(addresses[0]?.id ?? "");
		expect(address).toBeDefined();
	});
});
