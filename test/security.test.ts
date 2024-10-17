import { describe, expect, it } from "bun:test";
import { HASH_CONFIG } from "../src/utility/constants.ts";

describe("Security", () => {
	describe("Hashing Algorithm", () => {
		it('Should use the "argon2id" algorithm', () => {
			expect(HASH_CONFIG.algorithm).toBe("argon2id");
		});
		it("Should use a minimum memory cost of 19,456", () => {
			expect(HASH_CONFIG.memoryCost).toBeGreaterThanOrEqual(19_456);
		});
		it("Should use a minimum time cost of 2", () => {
			expect(HASH_CONFIG.timeCost).toBeGreaterThanOrEqual(2);
		});
	});
});
