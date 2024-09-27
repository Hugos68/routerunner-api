import { parse } from "valibot";
import { database } from "../database/database.js";
import { InsertUserSchema, users } from "../database/tables/users.table.js";

export async function createUser(input: unknown) {
	const values = parse(InsertUserSchema, input);
	const [user] = await database.insert(users).values(values).returning();
	return user;
}
