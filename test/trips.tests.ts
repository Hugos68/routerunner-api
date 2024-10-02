import { describe, expect, test } from "bun:test";
import * as uuid from "uuid";
import { get_addresses } from "../src/services/addresses";
import {
	create_trip,
	delete_trip,
	get_trip,
	get_trips,
	update_trip,
} from "../src/services/trips";
import { get_users } from "../src/services/users";
import { NotFoundError } from "../src/utility/errors";

describe("Trips", () => {
	test("Create a trip", async () => {
		const users = await get_users();
		const addresses = await get_addresses();
		const trip = await create_trip({
			driverId: users[0]?.id ?? "",
			startLocation: addresses[0]?.id ?? "",
			loadingDateTime: new Date().toDateString(),
		});
		expect(trip).toBeDefined();
	});
	test("Get all trips", async () => {
		const trips = await get_trips();
		expect(trips).toBeInstanceOf(Array);
		expect(trips.length).toBeGreaterThan(0);
	});
	test("Get a trip", async () => {
		const trips = await get_trips();
		const trip = await get_trip(trips[0]?.id ?? "");
		expect(trip).toBeDefined();
	});
	test("Updating an unknown trip will throw a NotFoundError", async () => {
		const users = await get_users();
		const addresses = await get_addresses();
		expect(() =>
			update_trip(uuid.v4(), {
				driverId: users[0]?.id ?? "",
				startLocation: addresses[0]?.id ?? "",
				loadingDateTime: new Date().toDateString(),
			}),
		).toThrowError(NotFoundError);
	});
	test("Updating a trip", async () => {
		const trips = await get_trips();
		const users = await get_users();
		const addresses = await get_addresses();
		const trip = await update_trip(trips[0]?.id ?? "", {
			driverId: users[0]?.id ?? "",
			startLocation: addresses[0]?.id ?? "",
			loadingDateTime: new Date().toDateString(),
		});
		expect(trip).toBeDefined();
	});
	test("Deleting a trip", async () => {
		const trips = await get_trips();
		const trip = await delete_trip(trips[0]?.id ?? "");
		expect(trip).toBeDefined();
	});
	test("Deleting an unknown trip will throw a NotFoundError", async () => {
		expect(() => delete_trip(uuid.v4())).toThrowError(NotFoundError);
	});
});
