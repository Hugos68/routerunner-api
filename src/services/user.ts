import { eq } from "drizzle-orm";
import { database } from "../database/database.js";
import { type User, user } from "../database/tables/user.js";

export async function createUser(data: Omit<User, "id">) {
	return await database
		.insert(user)
		.values({
			...data,
			password: await Bun.password.hash(data.password, {
				algorithm: "argon2id",
				memoryCost: 19_456,
				timeCost: 2,
			}),
		})
		.returning();
}

export async function getUser(id: string) {
	return await database.select().from(user).where(eq(user.id, id));
}

export async function getUsers() {
	return await database.select().from(user);
}

export async function updateUser(id: string, data: Partial<User>) {
	return await database
		.update(user)
		.set(data)
		.where(eq(user.id, id))
		.returning();
}
