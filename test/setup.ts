import { beforeEach } from "bun:test";
import { seedDatabase } from "./services/seed.ts";

export let seedData: Awaited<ReturnType<typeof seedDatabase>>;
beforeEach(async () => {
	seedData = await seedDatabase();
});
