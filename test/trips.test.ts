import { beforeEach, describe, expect, it } from "bun:test";
// biome-ignore lint/style/noNamespaceImport: <explanation>
import * as uuid from "uuid";
import {
	createTrip,
	deleteTrip,
	getTrip,
	getTrips,
	updateTrip,
} from "../src/services/trips.ts";
import type { Trip } from "../src/types/trip.ts";
import {
	ResourceNotFoundError,
	UnauthorizedError,
} from "../src/utility/errors.ts";
import { seedDatabase } from "./seed.ts";

let seedData: Awaited<ReturnType<typeof seedDatabase>>;

beforeEach(async () => {
	seedData = await seedDatabase();
});

describe("Trip Service Tests", () => {
	it("should create a new trip as a planner", async () => {
		const plannerActor = { ...seedData.planner, role: seedData.plannerRole };
		const tripToCreate = {
			driverId: seedData.driver.id,
			startLocation: seedData.address.id,
			loadingDateTime: new Date().toDateString(),
		};

		const createdTrip: Trip = await createTrip(plannerActor, tripToCreate);
		expect(createdTrip).toBeDefined();
		expect(createdTrip.driverId).toBe(seedData.driver.id);
		expect(createdTrip.startLocation).toBe(seedData.address.id);
	});

	it("should get all trips as a driver", async () => {
		const driverActor = { ...seedData.driver, role: seedData.driverRole };

		const trips = await getTrips(driverActor, {});
		expect(trips).toBeDefined();
		expect(trips.length).toBeGreaterThan(0);
	});

	it("should get a trip by ID as an admin", async () => {
		const adminActor = { ...seedData.admin, role: seedData.adminRole };
		const tripId = seedData.trip.id;

		const trip = await getTrip(adminActor, tripId);
		expect(trip).toBeDefined();
		expect(trip.id).toBe(tripId);
	});

	it("should update a trip as an admin", async () => {
		const adminActor = { ...seedData.admin, role: seedData.adminRole };
		const tripId = seedData.trip.id;
		const loadingDateTime = new Date().toDateString();
		const tripToUpdate = {
			loadingDateTime: loadingDateTime,
		};

		const updatedTrip = await updateTrip(adminActor, tripId, tripToUpdate);
		expect(updatedTrip).toBeDefined();
	});

	it("should delete a trip as a planner", async () => {
		const plannerActor = { ...seedData.planner, role: seedData.plannerRole };
		const tripId = seedData.trip.id;

		const trip = await deleteTrip(plannerActor, tripId);

		await expect(trip).toBeDefined();
	});

	it("should delete a trip as a admin", async () => {
		const adminActor = { ...seedData.admin, role: seedData.adminRole };
		const tripId = seedData.trip.id;

		const trip = await deleteTrip(adminActor, tripId);
		await expect(trip).toBeDefined();
	});

	it("should throw ResourceNotFoundError when a driver deletes a trip", async () => {
		const driverActor = { ...seedData.driver, role: seedData.driverRole };
		const tripId = seedData.trip.id;

		await expect(deleteTrip(driverActor, tripId)).rejects.toThrow(
			ResourceNotFoundError,
		);
	});

	it("should throw UnauthorizedError when a non-planner tries to create a trip", async () => {
		const driverActor = { ...seedData.driver, role: seedData.driverRole };
		const tripToCreate = {
			driverId: seedData.driver.id,
			startLocation: "Berlin",
			loadingDateTime: new Date().toDateString(),
		};

		await expect(createTrip(driverActor, tripToCreate)).rejects.toThrow(
			UnauthorizedError,
		);
	});

	it("should throw ResourceNotFoundError when getting a nonexistent trip", async () => {
		const adminActor = { ...seedData.admin, role: seedData.adminRole };
		const nonexistentTripId = uuid.v4();

		await expect(getTrip(adminActor, nonexistentTripId)).rejects.toThrow(
			ResourceNotFoundError,
		);
	});
});
