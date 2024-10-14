import type { Address } from "../src/types/address.ts";
import type { Line } from "../src/types/line.ts";
import type { Order } from "../src/types/order.ts";
import type { Role } from "../src/types/role.ts";
import type { Trip } from "../src/types/trip.ts";
import type { User } from "../src/types/user.ts";

export type SeedData = {
	driver: User;
	planner: User;
	admin: User;
	driverRole: Role;
	plannerRole: Role;
	adminRole: Role;
	address: Address;
	trip: Trip;
	order: Order;
	line: Line;
};
