import { afterEach, beforeAll, beforeEach } from "bun:test";
import { $ } from "bun";
import { database } from "../src/database/database.js";

beforeAll(async () => {
	await $`bun push`;
	console.log("Database setup complete");
});

beforeEach(async () => {});

afterEach(async () => {});
