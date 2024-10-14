import { beforeEach } from "bun:test";
import { seedDatabase } from "./seed";

export let seedData: Awaited<ReturnType<typeof seedDatabase>>;
beforeEach(async () => {
	seedData = await seedDatabase();

	console.log("seedData", seedData);
});
