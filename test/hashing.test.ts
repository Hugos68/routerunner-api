import { describe, expect, it } from "bun:test";
import { HASH_CONFIG } from "../src/utility/constants.ts";

describe("Hashing Tests", () => {
	it("should hash a password", async () => {
		const password = "1234567890";
		const wrongPassword = "0123456789";
		const hashedPassword = Bun.password.hashSync(password, HASH_CONFIG);
		expect(hashedPassword).toBeDefined();
		expect(await Bun.password.verify(wrongPassword, hashedPassword)).toBe(
			false,
		);
	});
});
