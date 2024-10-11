import { beforeEach } from "bun:test";
import { $ } from "bun";
beforeEach(async () => {
	await $`bun drizzle:seed`;
});
