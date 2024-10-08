import { describe, expect, test } from "bun:test";
import { v4 } from "uuid";
import { getAddresses } from "../src/services/addresses.ts";
import {
	createTrip,
	deleteTrip,
	getTrip,
	getTrips,
	updateTrip,
} from "../src/services/trips.ts";
import { getUsers } from "../src/services/users.ts";
import { NotFoundError } from "../src/utility/errors.ts";

describe("Trips", () => {
	test("Create a trip", async () => {
		const users = await getUsers();
		const addresses = await getAddresses();
		const trip = await createTrip({
			driverId: users[0]?.id ?? "",
			startLocation: addresses[0]?.id ?? "",
			loadingDateTime: new Date().toDateString(),
		});
		expect(trip).toBeDefined();
	});
	test("Get all trips", async () => {
		const trips = await getTrips();
		expect(trips).toBeInstanceOf(Array);
		expect(trips.length).toBeGreaterThan(0);
	});
	test("Get a trip", async () => {
		const trips = await getTrips();
		const trip = await getTrip(trips[0]?.id ?? "");
		expect(trip).toBeDefined();
	});
	test("Updating an unknown trip will throw a NotFoundError", async () => {
		const users = await getUsers();
		const addresses = await getAddresses();
		expect(() =>
			updateTrip(v4(), {
				driverId: users[0]?.id ?? "",
				startLocation: addresses[0]?.id ?? "",
				loadingDateTime: new Date().toDateString(),
			}),
		).toThrowError(NotFoundError);
	});
	test("Updating a trip", async () => {
		const trips = await getTrips();
		const users = await getUsers();
		const addresses = await getAddresses();
		const trip = await updateTrip(trips[0]?.id ?? "", {
			driverId: users[0]?.id ?? "",
			startLocation: addresses[0]?.id ?? "",
			loadingDateTime: new Date().toDateString(),
		});
		expect(trip).toBeDefined();
	});
	test("Deleting a trip", async () => {
		const trips = await getTrips();
		const trip = await deleteTrip(trips[0]?.id ?? "");
		expect(trip).toBeDefined();
	});
	test("Deleting an unknown trip will throw a NotFoundError", async () => {
		expect(() => deleteTrip(v4())).toThrowError(NotFoundError);
	});
});
