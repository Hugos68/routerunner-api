import { database } from "./database";
import {
	addressesTable,
	linesTable,
	ordersTable,
	rolesTable,
	tripsTable,
	usersTable,
} from "./schema";
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
	.values({ username: "driver", password: "1234567890", roleId: driverRole.id })
	.returning();
if (driver === undefined) {
	throw new Error("Failed to create driver");
}
await database.insert(usersTable).values({
	username: "planner",
	password: "1234567890",
	roleId: plannerRole.id,
});

await database
	.insert(usersTable)
	.values({ username: "admin", password: "1234567890", roleId: adminRole.id });

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

const [address2] = await database
	.insert(addressesTable)
	.values({
		street: "123 Elm St",
		number: "1234",
		city: "Springfield",
		state: "IL",
		zip: "62701",
		country: "USA",
	})
	.returning();
if (address2 === undefined) {
	throw new Error("Failed to create address2");
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

const [trip2] = await database
	.insert(tripsTable)
	.values({
		driverId: driver.id,
		startLocation: address2.id,
		loadingDateTime: new Date().toDateString(),
	})
	.returning();

if (trip2 === undefined) {
	throw new Error("Failed to create trip2");
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

const [order2] = await database
	.insert(ordersTable)
	.values({
		quantity: 20,
		packageType: "Pallet",
		unloadingAddress: address2.id,
		unloadingDateTime: new Date().toDateString(),
		deliveryInstructions: "Handle with care",
		status: "OPEN",
		tripId: trip2.id,
	})
	.returning();

if (order2 === undefined) {
	throw new Error("Failed to create order2");
}

await database.insert(linesTable).values({
	palletId: "1",
	quantity: 10,
	packageType: "Kratten",
	orderId: order1.id,
	productName: "Bananen",
});

await database.insert(linesTable).values({
	palletId: "2",
	quantity: 20,
	packageType: "Collie",
	orderId: order2.id,
	productName: "Appels",
});

await database.insert(linesTable).values({
	palletId: "3",
	quantity: 30,
	packageType: "Dozen",
	orderId: order2.id,
	productName: "Peren",
});

console.log("Database seeded");
