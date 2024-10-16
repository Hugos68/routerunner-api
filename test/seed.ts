import { database } from "../src/database/database.ts";
import { addressesTable } from "../src/database/tables/addresses.ts";
import { linesTable } from "../src/database/tables/lines.ts";
import { notesTable } from "../src/database/tables/notes.ts";
import { ordersTable } from "../src/database/tables/orders.ts";
import { retourPackagingsTable } from "../src/database/tables/retour-packagings.ts";
import { rolesTable } from "../src/database/tables/roles.ts";
import { sessionsTable } from "../src/database/tables/sessions.ts";
import { tripsTable } from "../src/database/tables/trips.ts";
import { usersTable } from "../src/database/tables/users.ts";

export async function seedDatabase() {
	await database.delete(usersTable);
	await database.delete(rolesTable);
	await database.delete(addressesTable);
	await database.delete(ordersTable);
	await database.delete(tripsTable);
	await database.delete(linesTable);
	await database.delete(sessionsTable);
	await database.delete(notesTable);
	await database.delete(retourPackagingsTable);

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

	const [note] = await database
		.insert(notesTable)
		.values({
			orderId: order.id,
			content: "Handle with care",
		})
		.returning();

	if (note === undefined) {
		throw new Error("Failed to create note");
	}

	const [retourPackaging] = await database
		.insert(retourPackagingsTable)
		.values({
			quantity: 10,
			packageType: "Pallet",
			orderId: order.id,
		})
		.returning();

	if (retourPackaging === undefined) {
		throw new Error("Failed to create retourPackaging");
	}

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
		note,
		retourPackaging,
	};
}
