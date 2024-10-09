import { beforeEach } from "bun:test";
import { database } from "../src/database/database.ts";
import {
	addressesTable,
	ordersTable,
	rolesTable,
	tripsTable,
	usersTable,
} from "../src/database/schema.ts";

beforeEach(async () => {
	await database.delete(usersTable);
	await database.delete(rolesTable);
	await database.delete(addressesTable);
	await database.delete(ordersTable);
	await database.delete(tripsTable);
	const [driverRole] = await database
		.insert(rolesTable)
		.values({
			name: "DRIVER",
		})
		.returning();
	if (driverRole === undefined) {
		throw new Error("Failed to create driver role");
	}
	const [plannerRole] = await database
		.insert(rolesTable)
		.values({
			name: "PLANNER",
		})
		.returning();
	if (plannerRole === undefined) {
		throw new Error("Failed to create planner role");
	}
	const [adminRole] = await database
		.insert(rolesTable)
		.values({
			name: "ADMIN",
		})
		.returning();
	if (adminRole === undefined) {
		throw new Error("Failed to create admin role");
	}

	const [driver] = await database
		.insert(usersTable)
		.values({
			username: "driver",
			password: "1234567890",
			roleId: driverRole.id,
		})
		.returning();
	if (driver === undefined) {
		throw new Error("Failed to create driver");
	}
	const [planner] = await database
		.insert(usersTable)
		.values({
			username: "planner",
			password: "1234567890",
			roleId: plannerRole.id,
		})
		.returning();
	if (planner === undefined) {
		throw new Error("Failed to create planner");
	}
	const [admin] = await database
		.insert(usersTable)
		.values({
			username: "admin",
			password: "1234567890",
			roleId: adminRole.id,
		})
		.returning();
	if (admin === undefined) {
		throw new Error("Failed to create admin");
	}

	const [address1] = await database
		.insert(addressesTable)
		.values({
			street: "123 Main St",
			number: "1",
			city: "Springfield",
			state: "IL",
			zip: "62701",
			country: "USA",
		})
		.returning();
	if (address1 === undefined) {
		throw new Error("Failed to create address1");
	}
	const [trip1] = await database
		.insert(tripsTable)
		.values({
			driverId: driver.id,
			startLocation: address1.id,
			loadingDateTime: new Date().toDateString(),
		})
		.returning();
	if (trip1 === undefined) {
		throw new Error("Failed to create trip1");
	}
	const [order1] = await database
		.insert(ordersTable)
		.values({
			quantity: 10,
			packageType: "Pallet",
			unloadingAddress: address1.id,
			unloadingDateTime: new Date().toDateString(),
			deliveryInstructions: "Handle with care",
			status: "OPEN",
			tripId: trip1.id,
		})
		.returning();
	if (order1 === undefined) {
		throw new Error("Failed to create order1");
	}
});
