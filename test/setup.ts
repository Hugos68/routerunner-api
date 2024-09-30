import { beforeEach } from "bun:test";
import { database } from "../src/database/database";
import {
	roles_table,
	user_roles_table,
	users_table,
} from "../src/database/schema";

beforeEach(async () => {
	await database.delete(user_roles_table);
	await database.delete(users_table);
	await database.delete(roles_table);

	const [driver] = await database
		.insert(users_table)
		.values({
			email: "driver@test.com",
			password: "driver",
		})
		.returning();
	if (driver === undefined) {
		throw new Error("Failed to create driver");
	}
	const [planner] = await database
		.insert(users_table)
		.values({
			email: "planner@test.com",
			password: "planner",
		})
		.returning();
	if (planner === undefined) {
		throw new Error("Failed to create planner");
	}
	const [admin] = await database
		.insert(users_table)
		.values({
			email: "admin@test.com",
			password: "admin",
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
