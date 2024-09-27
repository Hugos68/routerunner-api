import { dogs } from "../database/tables/dogs.table";
import { parse, ValiError } from "valibot";
import { createInsertSchema } from "drizzle-valibot";
import { database } from "../database/database.js";
import { Result } from "../utility/result.js";

export const createDog = async (input: unknown) => {
	try {
		const dog = parse(createInsertSchema(dogs), input);
		const result = await database.insert(dogs).values(dog).returning();
		return Result.ok(result);
	} catch (error) {
		if (error instanceof ValiError) {
			return Result.err("Validation", error.message);
		}
		return Result.err("Unknown", error.message);
	}
};
