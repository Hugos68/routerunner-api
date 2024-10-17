import { describe, expect, it } from "bun:test";
import { hash } from "../src/database/columns/hash.ts";
describe("Hashing Tests", () => {
	it("should hash a password", () => {
		const password = "1234567890";
		const hashedPassword = hash(password);
		expect(hashedPassword).toBeDefined();
		expect(hashedPassword).not.toBe(password);
	});
});
