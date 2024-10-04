import { beforeEach } from "bun:test";
import { database } from "../src/database/database";
import {
	addresses_table,
	orders_table,
	roles_table,
	trips_table,
	user_roles_table,
	users_table,
} from "../src/database/schema";

beforeEach(async () => {
	await database.delete(user_roles_table);
	await database.delete(users_table);
	await database.delete(roles_table);
	await database.delete(addresses_table);
	await database.delete(orders_table);
	await database.delete(trips_table);

	const [driver] = await database
		.insert(users_table)
		.values({
			username: "driver",
			password: "1234567890",
		})
		.returning();
	if (driver === undefined) {
		throw new Error("Failed to create driver");
	}
	const [planner] = await database
		.insert(users_table)
		.values({
			username: "planner",
			password: "1234567890",
		})
		.returning();
	if (planner === undefined) {
		throw new Error("Failed to create planner");
	}
	const [admin] = await database
		.insert(users_table)
		.values({
			username: "admin",
			password: "1234567890",
		})
		.returning();
	if (admin === undefined) {
		throw new Error("Failed to create admin");
	}
	const [driverRole] = await database
		.insert(roles_table)
		.values({
			name: "DRIVER",
		})
		.returning();
	if (driverRole === undefined) {
		throw new Error("Failed to create driver role");
	}
	const [plannerRole] = await database
		.insert(roles_table)
		.values({
			name: "PLANNER",
		})
		.returning();
	if (plannerRole === undefined) {
		throw new Error("Failed to create planner role");
	}
	const [adminRole] = await database
		.insert(roles_table)
		.values({
			name: "ADMIN",
		})
		.returning();
	if (adminRole === undefined) {
		throw new Error("Failed to create admin role");
	}

	const [address1] = await database
		.insert(addresses_table)
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

	const [order1] = await database
		.insert(orders_table)
		.values({
			quantity: 10,
			packageType: "Pallet",
			unloadingAddress: address1.id,
			unloadingDateTime: new Date().toDateString(),
			deliveryInstructions: "Handle with care",
			status: "OPEN",
		})
		.returning();
	if (order1 === undefined) {
		throw new Error("Failed to create order1");
	}

	const [trip1] = await database
		.insert(trips_table)
		.values({
			driverId: driver.id,
			startLocation: address1.id,
			loadingDateTime: new Date().toDateString(),
		})
		.returning();
	if (trip1 === undefined) {
		throw new Error("Failed to create trip1");
	}

	await database.insert(user_roles_table).values({
		userId: driver.id,
		roleId: driverRole.id,
	});
	await database.insert(user_roles_table).values({
		userId: planner.id,
		roleId: plannerRole.id,
	});
	await database.insert(user_roles_table).values({
		userId: admin.id,
		roleId: adminRole.id,
	});
});
