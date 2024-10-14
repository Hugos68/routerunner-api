import { database } from "../src/database/database.ts";
import { addressesTable } from "../src/database/tables/addresses.ts";
import { linesTable } from "../src/database/tables/lines.ts";
import { ordersTable } from "../src/database/tables/orders.ts";
import { rolesTable } from "../src/database/tables/roles.ts";
import { tripsTable } from "../src/database/tables/trips.ts";
import { usersTable } from "../src/database/tables/users.ts";

export async function seedDatabase() {
	await database.delete(usersTable);
	await database.delete(rolesTable);
	await database.delete(addressesTable);
	await database.delete(ordersTable);
	await database.delete(tripsTable);
	await database.delete(linesTable);

	const [driverRole] = await database
		.insert(rolesTable)
		.values({ name: "DRIVER" })
		.returning();
	if (driverRole === undefined) {
		throw new Error("Failed to create driver role");
	}
	const [plannerRole] = await database
		.insert(rolesTable)
		.values({ name: "PLANNER" })
		.returning();
	if (plannerRole === undefined) {
		throw new Error("Failed to create planner role");
	}
	const [adminRole] = await database
		.insert(rolesTable)
		.values({ name: "ADMIN" })
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

	const [address] = await database
		.insert(addressesTable)
		.values({
			number: "1234",
			street: "1234 Elm St",
			city: "Springfield",
			state: "IL",
			country: "US",
			zip: "62701",
		})
		.returning();
	if (address === undefined) {
		throw new Error("Failed to create address");
	}

	const [trip] = await database
		.insert(tripsTable)
		.values({
			driverId: driver.id,
			startLocation: address.id,
			loadingDateTime: new Date().toDateString(),
		})
		.returning();
	if (trip === undefined) {
		throw new Error("Failed to create trip1");
	}

	const [order] = await database
		.insert(ordersTable)
		.values({
			quantity: 10,
			packageType: "Pallet",
			unloadingAddress: address.id,
			unloadingDateTime: new Date().toDateString(),
			deliveryInstructions: "Handle with care",
			status: "OPEN",
			tripId: trip.id,
		})
		.returning();
	if (order === undefined) {
		throw new Error("Failed to create order1");
	}

	const [line] = await database
		.insert(linesTable)
		.values({
			palletId: "1",
			quantity: 10,
			packageType: "Kratten",
			orderId: order.id,
			productName: "Bananen",
		})
		.returning();
	if (line === undefined) {
		throw new Error("Failed to create line");
	}

	// Return the inserted records for test use
	return {
		driver,
		planner,
		admin,
		driverRole,
		plannerRole,
		adminRole,
		address,
		trip,
		order,
		line,
	};
}
